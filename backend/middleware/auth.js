const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware xác thực người dùng
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Lưu thông tin user vào request
    req.user = {
      username: decoded.username,
      role: decoded.role,
      sqlUser: decoded.sqlUser
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token đã hết hạn' });
    }
    console.error('Lỗi xác thực:', error);
    return res.status(500).json({ error: 'Lỗi xác thực' });
  }
};

module.exports = authenticate;

