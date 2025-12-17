const sql = require('mssql');
require('dotenv').config();

// Cấu hình kết nối
const useWindowsAuth = process.env.DB_USE_WINDOWS_AUTH === 'true' || 
                       (!process.env.DB_USER && !process.env.DB_PASSWORD);

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'QL_CLBvaDoiNhom',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
    enableArithAbort: true
  }
};

if (useWindowsAuth) {
  config.options.trustedConnection = true;
} else {
  config.user = process.env.DB_USER || 'sa';
  config.password = process.env.DB_PASSWORD || '';
}

async function fixAppUsersTable() {
  let pool;
  try {
    console.log('Đang kết nối đến database...');
    pool = await sql.connect(config);
    console.log('Đã kết nối thành công!');

    // Kiểm tra xem bảng có tồn tại không
    const checkTable = await pool.request().query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'AppUsers'
    `);

    if (checkTable.recordset[0].count === 0) {
      console.log('Bảng AppUsers chưa tồn tại, đang tạo mới...');
    } else {
      console.log('Bảng AppUsers đã tồn tại, đang kiểm tra cột...');
    }

    // Kiểm tra các cột
    const checkColumns = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'AppUsers'
    `);

    const columns = checkColumns.recordset.map(r => r.COLUMN_NAME);
    const hasRole = columns.includes('Role');
    const hasSQLUser = columns.includes('SQLUser');

    console.log('Các cột hiện có:', columns.join(', '));

    if (!hasRole || !hasSQLUser) {
      console.log('Đang thêm các cột còn thiếu...');
      
      if (!hasRole) {
        await pool.request().query(`
          ALTER TABLE AppUsers
          ADD Role NVARCHAR(50) NULL
        `);
        console.log('✓ Đã thêm cột Role');
      }

      if (!hasSQLUser) {
        await pool.request().query(`
          ALTER TABLE AppUsers
          ADD SQLUser NVARCHAR(50) NULL
        `);
        console.log('✓ Đã thêm cột SQLUser');
      }

      // Cập nhật dữ liệu
      console.log('Đang cập nhật dữ liệu...');
      await pool.request().query(`
        UPDATE AppUsers SET Role = 'Admin', SQLUser = 'NguyenUser' WHERE Username = 'admin' AND (Role IS NULL OR SQLUser IS NULL);
        UPDATE AppUsers SET Role = 'QLCLB', SQLUser = 'HaiUser' WHERE Username = 'hai' AND (Role IS NULL OR SQLUser IS NULL);
        UPDATE AppUsers SET Role = 'QLSuKien', SQLUser = 'ThuanUser' WHERE Username = 'thuan' AND (Role IS NULL OR SQLUser IS NULL);
        UPDATE AppUsers SET Role = 'HoTro', SQLUser = 'ChiUser' WHERE Username = 'chi' AND (Role IS NULL OR SQLUser IS NULL);
        UPDATE AppUsers SET Role = 'ThongKe', SQLUser = 'VanUser' WHERE Username = 'van' AND (Role IS NULL OR SQLUser IS NULL);
      `);

      // Đặt NOT NULL
      const checkNull = await pool.request().query(`
        SELECT COUNT(*) as nullCount FROM AppUsers WHERE Role IS NULL OR SQLUser IS NULL
      `);

      if (checkNull.recordset[0].nullCount === 0) {
        await pool.request().query(`
          ALTER TABLE AppUsers
          ALTER COLUMN Role NVARCHAR(50) NOT NULL;
          ALTER TABLE AppUsers
          ALTER COLUMN SQLUser NVARCHAR(50) NOT NULL;
        `);
        console.log('✓ Đã đặt NOT NULL cho các cột');
      }
    } else {
      console.log('Tất cả các cột đã tồn tại!');
    }

    // Kiểm tra dữ liệu
    const result = await pool.request().query(`
      SELECT UserId, Username, Role, SQLUser FROM AppUsers
    `);

    console.log('\nDữ liệu trong bảng AppUsers:');
    console.table(result.recordset);

    console.log('\n✓ Hoàn tất! Bảng AppUsers đã được cập nhật thành công.');
    
  } catch (error) {
    console.error('Lỗi:', error.message);
    if (error.originalError) {
      console.error('Chi tiết:', error.originalError.message);
    }
    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
      console.log('\nĐã đóng kết nối.');
    }
  }
}

// Chạy script
fixAppUsersTable();

