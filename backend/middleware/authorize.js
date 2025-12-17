// Middleware kiểm tra quyền dựa trên role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Kiểm tra xem đã authenticate chưa
    if (!req.user) {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }

    const userRole = req.user.role;

    // Admin có quyền truy cập tất cả
    if (userRole === 'Admin') {
      return next();
    }

    // Kiểm tra xem role của user có trong danh sách allowedRoles không
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Bạn không có quyền thực hiện thao tác này',
        requiredRoles: allowedRoles,
        yourRole: userRole
      });
    }

    next();
  };
};

// Helper functions cho các nhóm quyền cụ thể
const authorizeCLB = authorize('Admin', 'QLCLB', 'HoTro', 'ThongKe');
const authorizeCLBWrite = authorize('Admin', 'QLCLB', 'HoTro');
const authorizeCLBDelete = authorize('Admin', 'QLCLB');

const authorizeSuKien = authorize('Admin', 'QLSuKien', 'HoTro', 'ThongKe');
const authorizeSuKienWrite = authorize('Admin', 'QLSuKien');
const authorizeSuKienDelete = authorize('Admin', 'QLSuKien');

const authorizeDoiNhom = authorize('Admin', 'QLCLB', 'HoTro', 'ThongKe');
const authorizeDoiNhomWrite = authorize('Admin', 'QLCLB', 'HoTro');
const authorizeDoiNhomDelete = authorize('Admin', 'QLCLB');

module.exports = {
  authorize,
  authorizeCLB,
  authorizeCLBWrite,
  authorizeCLBDelete,
  authorizeSuKien,
  authorizeSuKienWrite,
  authorizeSuKienDelete,
  authorizeDoiNhom,
  authorizeDoiNhomWrite,
  authorizeDoiNhomDelete
};

