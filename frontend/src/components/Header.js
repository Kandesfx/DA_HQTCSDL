import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = (role) => {
    const roleNames = {
      'Admin': 'Quản trị viên',
      'QLCLB': 'Quản lý CLB',
      'QLSuKien': 'Quản lý Sự kiện',
      'HoTro': 'Hỗ trợ',
      'ThongKe': 'Thống kê'
    };
    return roleNames[role] || role;
  };

  if (!isAuthenticated) {
    return null; // Không hiển thị header nếu chưa đăng nhập
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Quản Lý CLB & Đội Nhóm</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Danh Sách CLB</Link>
          <Link to="/doinhom" className="nav-link">Đội Nhóm</Link>
          {(user?.role === 'Admin' || user?.role === 'QLCLB' || user?.role === 'HoTro') && (
            <>
              <Link to="/clb/them" className="nav-link btn btn-primary">
                + Thêm CLB
              </Link>
              <Link to="/doinhom/them" className="nav-link btn btn-primary">
                + Thêm Đội Nhóm
              </Link>
            </>
          )}
          <div className="user-info">
            <span className="user-name">
              {user?.username} ({getRoleName(user?.role)})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

