const sql = require('mssql');

/**
 * Lấy role của user từ database dựa trên SQL Server user name
 * @param {sql.ConnectionPool} pool - Connection pool đã kết nối với user đó
 * @param {string} sqlUserName - Tên SQL Server user (ví dụ: HaiUser, NguyenUser)
 * @returns {Promise<string|null>} - Role name hoặc null nếu không tìm thấy
 */
async function getUserRole(pool, sqlUserName) {
  try {
    const request = pool.request();
    
    console.log(`[getUserRole] Đang lấy role cho user: ${sqlUserName}`);
    
    // ƯU TIÊN 1: Sử dụng IS_MEMBER() - cách an toàn nhất, không cần quyền đọc system tables
    // User có thể tự kiểm tra role của chính mình mà không cần quyền đặc biệt
    try {
      // Kiểm tra db_owner trước (nếu có thì là Admin)
      const dbOwnerCheck = await request.query(`
        SELECT IS_MEMBER('db_owner') AS IsDbOwner
      `);
      
      if (dbOwnerCheck.recordset[0].IsDbOwner === 1) {
        console.log(`[getUserRole] User ${sqlUserName} là db_owner → Admin`);
        return 'Admin';
      }
      
      // Kiểm tra từng role một (theo thứ tự ưu tiên)
      const roleChecks = [
        { role: 'Role_Admin', appRole: 'Admin' },
        { role: 'Role_QLCLB', appRole: 'QLCLB' },
        { role: 'Role_QLSuKien', appRole: 'QLSuKien' },
        { role: 'Role_HoTro', appRole: 'HoTro' },
        { role: 'Role_ThongKe', appRole: 'ThongKe' }
      ];
      
      for (const check of roleChecks) {
        try {
          // Escape single quotes trong role name để tránh SQL injection
          const escapedRole = check.role.replace(/'/g, "''");
          const directCheck = await request.query(`
            SELECT IS_MEMBER('${escapedRole}') AS IsMember
          `);
          
          if (directCheck.recordset[0].IsMember === 1) {
            console.log(`[getUserRole] Tìm thấy role bằng IS_MEMBER('${check.role}'): ${check.appRole}`);
            return check.appRole;
          }
        } catch (err) {
          // Bỏ qua lỗi và thử role tiếp theo
          console.log(`[getUserRole] Không thể kiểm tra IS_MEMBER('${check.role}'):`, err.message);
          continue;
        }
      }
    } catch (err) {
      console.log(`[getUserRole] Lỗi khi kiểm tra IS_MEMBER:`, err.message);
    }
    
    // ƯU TIÊN 2: Thử lấy từ bảng AppUsers (nếu user có quyền đọc)
    try {
      request.input('sqlUserName2', sql.NVarChar(50), sqlUserName);
      const appUserResult = await request.query(`
        SELECT Role 
        FROM AppUsers 
        WHERE SQLUser = @sqlUserName2
      `);
      
      if (appUserResult.recordset.length > 0) {
        const role = appUserResult.recordset[0].Role;
        console.log(`[getUserRole] Lấy role từ AppUsers: ${role}`);
        return role;
      }
    } catch (err) {
      // Bảng AppUsers có thể không tồn tại hoặc user không có quyền đọc
      console.log(`[getUserRole] Không thể truy vấn AppUsers (có thể không có quyền):`, err.message);
    }
    
    // ƯU TIÊN 3: Thử query sys.database_role_members (chỉ nếu có quyền)
    // Lưu ý: Cách này yêu cầu quyền đọc system tables, có thể không có khi kết nối tới DB của người khác
    try {
      request.input('sqlUserName', sql.NVarChar(50), sqlUserName);
      
      const result = await request.query(`
        SELECT rp.name AS RoleName
        FROM sys.database_role_members drm
        JOIN sys.database_principals rp 
          ON drm.role_principal_id = rp.principal_id
        JOIN sys.database_principals dp 
          ON drm.member_principal_id = dp.principal_id
        WHERE dp.name = @sqlUserName
      `);
      
      console.log(`[getUserRole] Tìm thấy ${result.recordset.length} role từ sys.database_role_members`);
      
      if (result.recordset.length > 0) {
        const roleName = result.recordset[0].RoleName;
        console.log(`[getUserRole] Role database: ${roleName}`);
        
        // Map database role name sang application role name
        const roleMapping = {
          'Role_Admin': 'Admin',
          'Role_QLCLB': 'QLCLB',
          'Role_QLSuKien': 'QLSuKien',
          'Role_HoTro': 'HoTro',
          'Role_ThongKe': 'ThongKe',
          'db_owner': 'Admin',
          'db_datareader': 'ThongKe',
          'db_datawriter': 'HoTro'
        };
        
        const mappedRole = roleMapping[roleName] || roleName;
        console.log(`[getUserRole] Role mapped: ${mappedRole}`);
        return mappedRole;
      }
    } catch (err) {
      // Không có quyền đọc system tables - đây là trường hợp bình thường khi kết nối tới DB của người khác
      console.log(`[getUserRole] Không thể truy vấn sys.database_role_members (không có quyền):`, err.message);
    }
    
    // ƯU TIÊN 4: Thử suy luận role dựa trên quyền trực tiếp trên các đối tượng
    // Nếu user có quyền trên các bảng/procedure cụ thể, có thể suy luận role
    try {
      // Kiểm tra quyền trên các bảng của QLCLB
      const clbTableCheck = await request.query(`
        SELECT HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'SELECT') AS HasSelect,
               HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'INSERT') AS HasInsert,
               HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'UPDATE') AS HasUpdate,
               HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'DELETE') AS HasDelete
      `);
      
      const clbPerms = clbTableCheck.recordset[0];
      const hasCLBFullAccess = clbPerms.HasSelect === 1 && clbPerms.HasInsert === 1 && 
                                clbPerms.HasUpdate === 1 && clbPerms.HasDelete === 1;
      
      // Kiểm tra quyền trên các procedure của QLCLB
      let hasCLBProcedures = false;
      try {
        const procCheck = await request.query(`
          SELECT HAS_PERMS_BY_NAME('dbo.sp_QLCLB_ThongKeCLB', 'OBJECT', 'EXECUTE') AS HasExec
        `);
        hasCLBProcedures = procCheck.recordset[0].HasExec === 1;
      } catch (err) {
        // Procedure có thể không tồn tại
      }
      
      // Nếu có quyền đầy đủ trên CLB và DoiNhom, có thể là QLCLB
      if (hasCLBFullAccess || hasCLBProcedures) {
        const doinhomTableCheck = await request.query(`
          SELECT HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'SELECT') AS HasSelect,
                 HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'INSERT') AS HasInsert,
                 HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'UPDATE') AS HasUpdate,
                 HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'DELETE') AS HasDelete
        `);
        
        const doinhomPerms = doinhomTableCheck.recordset[0];
        const hasDoiNhomFullAccess = doinhomPerms.HasSelect === 1 && doinhomPerms.HasInsert === 1 && 
                                     doinhomPerms.HasUpdate === 1 && doinhomPerms.HasDelete === 1;
        
        if (hasDoiNhomFullAccess || hasCLBProcedures) {
          console.log(`[getUserRole] Suy luận role QLCLB dựa trên quyền trực tiếp trên đối tượng`);
          return 'QLCLB';
        }
      }
      
      // Kiểm tra quyền trên các bảng của QLSuKien
      try {
        const sukienTableCheck = await request.query(`
          SELECT HAS_PERMS_BY_NAME('dbo.SuKien', 'OBJECT', 'SELECT') AS HasSelect,
                 HAS_PERMS_BY_NAME('dbo.SuKien', 'OBJECT', 'INSERT') AS HasInsert,
                 HAS_PERMS_BY_NAME('dbo.SuKien', 'OBJECT', 'UPDATE') AS HasUpdate,
                 HAS_PERMS_BY_NAME('dbo.SuKien', 'OBJECT', 'DELETE') AS HasDelete
        `);
        
        const sukienPerms = sukienTableCheck.recordset[0];
        const hasSuKienFullAccess = sukienPerms.HasSelect === 1 && sukienPerms.HasInsert === 1 && 
                                    sukienPerms.HasUpdate === 1 && sukienPerms.HasDelete === 1;
        
        if (hasSuKienFullAccess) {
          console.log(`[getUserRole] Suy luận role QLSuKien dựa trên quyền trực tiếp trên đối tượng`);
          return 'QLSuKien';
        }
      } catch (err) {
        // Bảng SuKien có thể không tồn tại
      }
      
    } catch (err) {
      console.log(`[getUserRole] Không thể kiểm tra quyền trực tiếp:`, err.message);
    }
    
    console.log(`[getUserRole] Không tìm thấy role cho ${sqlUserName}`);
    return null;
  } catch (error) {
    console.error('[getUserRole] Lỗi lấy role:', error);
    return null;
  }
}

/**
 * Lấy SQL Server user name từ connection
 * @param {sql.ConnectionPool} pool - Connection pool
 * @returns {Promise<string|null>} - SQL user name
 */
async function getCurrentSQLUser(pool) {
  try {
    const request = pool.request();
    const result = await request.query(`SELECT SUSER_SNAME() AS CurrentUser, USER_NAME() AS DatabaseUser`);
    
    if (result.recordset.length > 0) {
      // Trả về database user name (ví dụ: HaiUser)
      return result.recordset[0].DatabaseUser;
    }
    return null;
  } catch (error) {
    console.error('Lỗi lấy SQL user:', error);
    return null;
  }
}

module.exports = {
  getUserRole,
  getCurrentSQLUser
};

