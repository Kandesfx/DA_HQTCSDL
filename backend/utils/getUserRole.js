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
    
    // Kiểm tra xem có phải db_owner không (trước tiên)
    try {
      const dbOwnerCheck = await request.query(`
        SELECT IS_MEMBER('db_owner') AS IsDbOwner
      `);
      
      if (dbOwnerCheck.recordset[0].IsDbOwner === 1) {
        console.log(`[getUserRole] User ${sqlUserName} là db_owner → Admin`);
        return 'Admin';
      }
    } catch (err) {
      console.log(`[getUserRole] Không thể kiểm tra db_owner:`, err.message);
    }
    
    // Lấy role từ sys.database_role_members
    // Sử dụng parameter để tránh SQL injection
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
    
    console.log(`[getUserRole] Tìm thấy ${result.recordset.length} role cho ${sqlUserName}`);
    
    // Nếu có role, trả về role đầu tiên
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
        'db_owner': 'Admin', // db_owner cũng là Admin
        'db_datareader': 'ThongKe', // Fallback
        'db_datawriter': 'HoTro' // Fallback
      };
      
      const mappedRole = roleMapping[roleName] || roleName;
      console.log(`[getUserRole] Role mapped: ${mappedRole}`);
      return mappedRole;
    }
    
    // Nếu không tìm thấy trong role, thử lấy từ bảng AppUsers (nếu có) để mapping
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
      // Bảng AppUsers có thể không tồn tại, bỏ qua
      console.log(`[getUserRole] Không thể truy vấn AppUsers:`, err.message);
    }
    
    // Nếu vẫn không tìm thấy, thử kiểm tra trực tiếp bằng cách query với user hiện tại
    // Sử dụng IS_MEMBER() - function này user có thể tự kiểm tra quyền của mình
    try {
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
          // Query trực tiếp với role name (IS_MEMBER không hỗ trợ parameter)
          const directCheck = await request.query(`
            SELECT IS_MEMBER('${check.role.replace(/'/g, "''")}') AS IsMember
          `);
          
          if (directCheck.recordset[0].IsMember === 1) {
            console.log(`[getUserRole] Lấy role bằng IS_MEMBER('${check.role}'): ${check.appRole}`);
            return check.appRole;
          }
        } catch (err) {
          // Bỏ qua lỗi và thử role tiếp theo
          console.log(`[getUserRole] Không thể kiểm tra IS_MEMBER('${check.role}'):`, err.message);
          continue;
        }
      }
    } catch (err) {
      console.log(`[getUserRole] Không thể kiểm tra IS_MEMBER:`, err.message);
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

