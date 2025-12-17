const sql = require('mssql');
require('dotenv').config();

// Kiểm tra xem có dùng Windows Authentication không
const useWindowsAuth = process.env.DB_USE_WINDOWS_AUTH === 'true' || 
                       (!process.env.DB_USER && !process.env.DB_PASSWORD);

// Xử lý DB_SERVER: loại bỏ port nếu có (port được set riêng)
let dbServer = process.env.DB_SERVER || 'localhost';
// Nếu có dấu phẩy (format sai: IP,PORT), chỉ lấy phần IP
if (dbServer.includes(',') && !dbServer.includes('\\')) {
  dbServer = dbServer.split(',')[0].trim();
  console.warn(`[DB Config] Phát hiện format sai trong DB_SERVER, đã tự động sửa. Port nên được set riêng trong DB_PORT.`);
}

const config = {
  server: dbServer,
  database: process.env.DB_DATABASE || 'QL_CLBvaDoiNhom',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
    enableArithAbort: true
  }
};

// Log cấu hình (ẩn password)
console.log('[DB Config] Server:', config.server);
console.log('[DB Config] Database:', config.database);
console.log('[DB Config] Port:', config.port);
console.log('[DB Config] Auth:', useWindowsAuth ? 'Windows' : 'SQL Server');
if (!useWindowsAuth) {
  console.log('[DB Config] User:', config.user);
}

// Nếu dùng Windows Authentication
if (useWindowsAuth) {
  config.options.trustedConnection = true;
  // Hoặc có thể dùng: config.authentication = { type: 'default' };
} else {
  // Nếu dùng SQL Server Authentication
  config.user = process.env.DB_USER || 'sa';
  config.password = process.env.DB_PASSWORD || '';
}

let pool = null;

const getPool = async () => {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Đã kết nối SQL Server thành công!');
    return pool;
  } catch (error) {
    console.error('Lỗi kết nối SQL Server:', error);
    throw error;
  }
};

const closePool = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Đã đóng kết nối SQL Server');
    }
  } catch (error) {
    console.error('Lỗi đóng kết nối:', error);
  }
};

module.exports = {
  getPool,
  closePool,
  sql
};

