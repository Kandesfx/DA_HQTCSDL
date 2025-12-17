const sql = require('mssql');
require('dotenv').config();

console.log('🔍 Đang kiểm tra cấu hình kết nối SQL Server...\n');

// Hiển thị cấu hình (ẩn password)
console.log('📋 Thông tin cấu hình:');
console.log('   Server:', process.env.DB_SERVER || 'localhost');
console.log('   Database:', process.env.DB_DATABASE || 'QL_CLBvaDoiNhom');
console.log('   Port:', process.env.DB_PORT || 1433);
console.log('   User:', process.env.DB_USER || '(Windows Auth)');
console.log('   Password:', process.env.DB_PASSWORD ? '***' : '(không có)');
console.log('   Windows Auth:', process.env.DB_USE_WINDOWS_AUTH === 'true' ? 'Có' : 'Không');
console.log('   Encrypt:', process.env.DB_ENCRYPT === 'true' ? 'Có' : 'Không');
console.log('   Trust Certificate:', process.env.DB_TRUST_CERTIFICATE === 'true' ? 'Có' : 'Không');
console.log('');

// Kiểm tra xem có dùng Windows Authentication không
const useWindowsAuth = process.env.DB_USE_WINDOWS_AUTH === 'true' || 
                       (!process.env.DB_USER && !process.env.DB_PASSWORD);

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'QL_CLBvaDoiNhom',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
    enableArithAbort: true,
    connectTimeout: 10000, // 10 giây timeout
    requestTimeout: 10000
  }
};

// Nếu dùng Windows Authentication
if (useWindowsAuth) {
  config.options.trustedConnection = true;
  console.log('⚠️  Đang sử dụng Windows Authentication');
  console.log('   Lưu ý: Windows Auth có thể không hoạt động với mssql driver');
  console.log('   Khuyến nghị: Chuyển sang SQL Server Authentication\n');
} else {
  // Nếu dùng SQL Server Authentication
  config.user = process.env.DB_USER || 'sa';
  config.password = process.env.DB_PASSWORD || '';
  console.log('✅ Đang sử dụng SQL Server Authentication\n');
}

// Test kết nối
async function testConnection() {
  try {
    console.log('🔄 Đang thử kết nối...');
    const pool = await sql.connect(config);
    
    console.log('✅ KẾT NỐI THÀNH CÔNG!\n');
    
    // Test query đơn giản
    console.log('🔄 Đang test query...');
    const result = await pool.request().query('SELECT @@VERSION AS Version, DB_NAME() AS CurrentDatabase');
    
    console.log('✅ Query thành công!\n');
    console.log('📊 Thông tin Server:');
    console.log('   Database hiện tại:', result.recordset[0].CurrentDatabase);
    console.log('   SQL Server Version:', result.recordset[0].Version.split('\n')[0]);
    console.log('');
    
    // Test xem có bảng SuKien không
    console.log('🔄 Đang kiểm tra bảng SuKien...');
    const tableCheck = await pool.request().query(`
      SELECT COUNT(*) AS TableExists 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'SuKien'
    `);
    
    if (tableCheck.recordset[0].TableExists > 0) {
      console.log('✅ Bảng SuKien tồn tại');
      
      // Đếm số lượng sự kiện
      const countResult = await pool.request().query('SELECT COUNT(*) AS Count FROM SuKien');
      console.log('   Số lượng sự kiện:', countResult.recordset[0].Count);
    } else {
      console.log('⚠️  Bảng SuKien không tồn tại');
    }
    console.log('');
    
    // Test xem có bảng CLB không
    console.log('🔄 Đang kiểm tra bảng CLB...');
    const clbCheck = await pool.request().query(`
      SELECT COUNT(*) AS TableExists 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'CLB'
    `);
    
    if (clbCheck.recordset[0].TableExists > 0) {
      console.log('✅ Bảng CLB tồn tại');
      
      // Đếm số lượng CLB
      const clbCountResult = await pool.request().query('SELECT COUNT(*) AS Count FROM CLB');
      console.log('   Số lượng CLB:', clbCountResult.recordset[0].Count);
    } else {
      console.log('⚠️  Bảng CLB không tồn tại');
    }
    console.log('');
    
    await pool.close();
    console.log('✅ Đóng kết nối thành công');
    console.log('\n🎉 TẤT CẢ CÁC TEST ĐỀU THÀNH CÔNG!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ LỖI KẾT NỐI:\n');
    console.error('   Code:', error.code || 'N/A');
    console.error('   Message:', error.message);
    
    if (error.originalError) {
      console.error('\n   Chi tiết lỗi gốc:');
      console.error('   Code:', error.originalError.code || 'N/A');
      console.error('   Message:', error.originalError.message || 'N/A');
    }
    
    console.error('\n💡 Gợi ý khắc phục:');
    
    if (error.code === 'ETIMEOUT' || error.code === 'ESOCKET') {
      console.error('   1. Kiểm tra SQL Server đang chạy');
      console.error('   2. Kiểm tra TCP/IP đã được bật trong SQL Server Configuration Manager');
      console.error('   3. Kiểm tra cổng 1433 đã được cấu hình');
      console.error('   4. Kiểm tra firewall không chặn cổng 1433');
      console.error('   5. Thử đổi DB_SERVER thành "localhost\\SQLEXPRESS" hoặc "127.0.0.1\\SQLEXPRESS"');
    }
    
    if (error.code === 'ELOGIN') {
      console.error('   1. Kiểm tra username và password trong file .env');
      console.error('   2. Đảm bảo SQL Server Authentication đã được bật');
      console.error('   3. Kiểm tra login có quyền truy cập database');
    }
    
    if (error.code === 'EDBNAME') {
      console.error('   1. Kiểm tra tên database trong file .env');
      console.error('   2. Đảm bảo database QL_CLBvaDoiNhom đã được tạo');
    }
    
    if (useWindowsAuth) {
      console.error('   6. Windows Authentication có thể không hoạt động với mssql driver');
      console.error('      Khuyến nghị: Chuyển sang SQL Server Authentication');
    }
    
    process.exit(1);
  }
}

// Chạy test
testConnection();

