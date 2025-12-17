const sql = require('mssql');
require('dotenv').config();

// Test các cấu hình kết nối khác nhau
const testConfigs = [
  {
    name: 'Cấu hình hiện tại (.env)',
    config: (() => {
      const useWindowsAuth = process.env.DB_USE_WINDOWS_AUTH === 'true' || 
                             (!process.env.DB_USER && !process.env.DB_PASSWORD);
      const cfg = {
        server: process.env.DB_SERVER || 'localhost',
        database: process.env.DB_DATABASE || 'QL_CLBvaDoiNhom',
        port: parseInt(process.env.DB_PORT) || 1433,
        options: {
          encrypt: process.env.DB_ENCRYPT === 'true',
          trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
          enableArithAbort: true,
          connectTimeout: 5000
        }
      };
      if (useWindowsAuth) {
        cfg.options.trustedConnection = true;
      } else {
        cfg.user = process.env.DB_USER || 'sa';
        cfg.password = process.env.DB_PASSWORD || '';
      }
      return cfg;
    })()
  },
  {
    name: 'localhost\\SQLEXPRESS với SQL Auth',
    config: {
      server: 'localhost\\SQLEXPRESS',
      database: 'QL_CLBvaDoiNhom',
      user: 'sa',
      password: process.env.DB_PASSWORD || '',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 5000
      }
    }
  },
  {
    name: '127.0.0.1\\SQLEXPRESS với SQL Auth',
    config: {
      server: '127.0.0.1\\SQLEXPRESS',
      database: 'QL_CLBvaDoiNhom',
      user: 'sa',
      password: process.env.DB_PASSWORD || '',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 5000
      }
    }
  },
  {
    name: 'localhost,1433 (không có instance)',
    config: {
      server: 'localhost',
      database: 'QL_CLBvaDoiNhom',
      user: 'sa',
      password: process.env.DB_PASSWORD || '',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 5000
      }
    }
  }
];

async function testConfig(config, name) {
  try {
    console.log(`\n🔄 Đang test: ${name}`);
    console.log(`   Server: ${config.server}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user || '(Windows Auth)'}`);
    
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DB_NAME() AS CurrentDB');
    
    console.log(`✅ THÀNH CÔNG! Database: ${result.recordset[0].CurrentDB}`);
    await pool.close();
    return true;
  } catch (error) {
    console.log(`❌ THẤT BẠI: ${error.code || error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 BẮT ĐẦU TEST CÁC CẤU HÌNH KẾT NỐI\n');
  console.log('='.repeat(60));
  
  let successCount = 0;
  
  for (const test of testConfigs) {
    const success = await testConfig(test.config, test.name);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây giữa các test
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 KẾT QUẢ: ${successCount}/${testConfigs.length} cấu hình thành công`);
  
  if (successCount === 0) {
    console.log('\n💡 Không có cấu hình nào thành công. Vui lòng kiểm tra:');
    console.log('   1. SQL Server đang chạy');
    console.log('   2. TCP/IP đã được bật');
    console.log('   3. Cổng 1433 đã được cấu hình');
    console.log('   4. Username và password đúng');
  } else {
    console.log('\n✅ Tìm thấy cấu hình hoạt động! Sử dụng cấu hình đó trong file .env');
  }
  
  process.exit(successCount > 0 ? 0 : 1);
}

runTests();

