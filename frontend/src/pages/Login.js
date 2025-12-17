import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } else {
      toast.error(result.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        <div className="login-info">
          <p><strong>💡 Đăng nhập bằng SQL Server Login:</strong></p>
          <p style={{ fontSize: '13px', marginBottom: '10px', color: '#666' }}>
            Sử dụng tài khoản SQL Server đã được tạo trong database
          </p>
          <ul>
            <li>Admin: <code>Nguyen</code> / <code>Nguyen@123</code></li>
            <li>QLCLB: <code>Hai</code> / <code>Hai@123</code></li>
            <li>QLSuKien: <code>Thuan</code> / <code>Thuan@123</code></li>
            <li>HoTro: <code>Chi</code> / <code>Chi@123</code></li>
            <li>ThongKe: <code>Van</code> / <code>Van@123</code></li>
          </ul>
          <p style={{ fontSize: '12px', marginTop: '10px', color: '#856404', background: '#fff3cd', padding: '8px', borderRadius: '4px' }}>
            ⚠️ Lưu ý: Đảm bảo SQL Server đã được cấu hình cho phép kết nối từ xa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

