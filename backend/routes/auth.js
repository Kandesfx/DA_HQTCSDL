const express = require('express');
const router = express.Router();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const { getUserRole, getCurrentSQLUser } = require('../utils/getUserRole');
require('dotenv').config();

// Secret key cho JWT (nên lưu trong .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Đăng nhập bằng SQL Server login trực tiếp
router.post('/login', async (req, res) => {
  let tempPool = null;
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username và password là bắt buộc' });
    }

    // Lấy thông tin database từ .env
    let dbServer = process.env.DB_SERVER || 'localhost';
    // Xử lý format: loại bỏ port nếu có (port được set riêng)
    if (dbServer.includes(',') && !dbServer.includes('\\')) {
      dbServer = dbServer.split(',')[0].trim();
    }
    const dbDatabase = process.env.DB_DATABASE || 'QL_CLBvaDoiNhom';
    const dbPort = parseInt(process.env.DB_PORT) || 1433;
    const dbEncrypt = process.env.DB_ENCRYPT === 'true';
    const dbTrustCert = process.env.DB_TRUST_CERTIFICATE === 'true';

    // Tạo connection config với username/password từ request
    const loginConfig = {
      server: dbServer,
      database: dbDatabase,
      port: dbPort,
      user: username,  // SQL Server login name (ví dụ: Hai, Nguyen, Thuan)
      password: password,  // SQL Server login password
      options: {
        encrypt: dbEncrypt,
        trustServerCertificate: dbTrustCert,
        enableArithAbort: true
      }
    };
    
    console.log(`[Login] Đang kết nối đến: ${dbServer}:${dbPort}`);

    // Thử kết nối với SQL Server bằng username/password
    try {
      tempPool = await sql.connect(loginConfig);
      console.log(`Đăng nhập thành công với SQL Server login: ${username}`);
    } catch (loginError) {
      // Nếu không kết nối được, có thể là sai username/password
      if (loginError.code === 'ELOGIN' || loginError.code === 'EREQUEST') {
        return res.status(401).json({ 
          error: 'Tên đăng nhập hoặc mật khẩu không đúng',
          details: 'Không thể kết nối đến SQL Server với thông tin đăng nhập này'
        });
      }
      throw loginError;
    }

    // Lấy thông tin user từ database
    const sqlUserName = await getCurrentSQLUser(tempPool);
    console.log(`[Login] SQL User name: ${sqlUserName}`);
    
    if (!sqlUserName) {
      await tempPool.close();
      return res.status(500).json({ 
        error: 'Không thể xác định SQL user name',
        details: 'Có thể user chưa được tạo trong database'
      });
    }
    
    const role = await getUserRole(tempPool, sqlUserName);
    console.log(`[Login] Role: ${role}`);

    if (!role) {
      await tempPool.close();
      return res.status(403).json({ 
        error: 'User không có quyền truy cập hệ thống',
        details: `User "${sqlUserName}" không được gán vào bất kỳ role nào. Vui lòng liên hệ admin để được gán quyền.`
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        username: username,
        sqlUser: sqlUserName,
        role: role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Đóng connection tạm
    await tempPool.close();
    tempPool = null;

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        username: username,
        sqlUser: sqlUserName,
        role: role
      }
    });
  } catch (error) {
    // Đảm bảo đóng connection nếu có lỗi
    if (tempPool) {
      try {
        await tempPool.close();
      } catch (closeError) {
        console.error('Lỗi đóng connection:', closeError);
      }
    }
    
    console.error('Lỗi đăng nhập:', error);
    
    if (error.code === 'ELOGIN' || error.code === 'EREQUEST') {
      return res.status(401).json({ 
        error: 'Tên đăng nhập hoặc mật khẩu không đúng',
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Lỗi server khi đăng nhập',
      details: error.message
    });
  }
});

// Đăng xuất (client chỉ cần xóa token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
});

// Kiểm tra token và lấy thông tin user hiện tại
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Không có token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Trả về thông tin từ token (không cần query database)
    res.json({
      username: decoded.username,
      sqlUser: decoded.sqlUser,
      role: decoded.role
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    console.error('Lỗi kiểm tra token:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;

