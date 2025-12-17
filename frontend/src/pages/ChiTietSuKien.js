import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sukienAPI } from '../services/api';
import './ChiTietSuKien.css';

const ChiTietSuKien = () => {
  const { MaSK } = useParams();
  const navigate = useNavigate();
  const [suKien, setSuKien] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [MaSK]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await sukienAPI.getById(MaSK);
      setSuKien(data);
    } catch (error) {
      console.error('Lỗi tải chi tiết sự kiện:', error);
      toast.error('Không thể tải thông tin sự kiện');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa sự kiện "${suKien.TenSK}"?`
      )
    ) {
      return;
    }

    try {
      await sukienAPI.delete(MaSK);
      toast.success('Xóa sự kiện thành công');
      navigate('/');
    } catch (error) {
      console.error('Lỗi xóa sự kiện:', error);
      toast.error(error.response?.data?.error || 'Không thể xóa sự kiện');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!suKien) {
    return (
      <div className="empty-state">
        <p>Không tìm thấy sự kiện</p>
        <Link to="/" className="btn btn-primary">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="chi-tiet-su-kien">
      <div className="page-header">
        <h1>Chi Tiết Sự Kiện</h1>
        <div className="header-actions">
          <Link to={`/sukien/sua/${MaSK}`} className="btn btn-success">
            Sửa Sự Kiện
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Xóa Sự Kiện
          </button>
          <Link to="/" className="btn btn-secondary">
            Quay lại
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="info-section">
          <h2>{suKien.TenSK}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Mã Sự Kiện:</label>
              <span>{suKien.MaSK}</span>
            </div>
            <div className="info-item">
              <label>Ngày Tổ Chức:</label>
              <span>{formatDate(suKien.NgayToChuc)}</span>
            </div>
            <div className="info-item">
              <label>Địa Điểm:</label>
              <span>{suKien.DiaDiem}</span>
            </div>
            <div className="info-item">
              <label>Câu Lạc Bộ:</label>
              <span>{suKien.TenCLB}</span>
            </div>
            <div className="info-item">
              <label>Tổng Tài Trợ:</label>
              <span className="highlight">
                {suKien.TongTaiTro
                  ? new Intl.NumberFormat('vi-VN').format(suKien.TongTaiTro) +
                    ' đ'
                  : '0 đ'}
              </span>
            </div>
            {suKien.MoTa && (
              <div className="info-item full-width">
                <label>Mô Tả:</label>
                <p>{suKien.MoTa}</p>
              </div>
            )}
          </div>
        </div>

        {suKien.NhaTaiTro && suKien.NhaTaiTro.length > 0 && (
          <div className="info-section">
            <h3>Nhà Tài Trợ</h3>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Mã NTT</th>
                  <th>Tên Nhà Tài Trợ</th>
                  <th>Số Tiền</th>
                </tr>
              </thead>
              <tbody>
                {suKien.NhaTaiTro.map((tt, index) => (
                  <tr key={index}>
                    <td>{tt.MaNTT}</td>
                    <td>{tt.TenNTT}</td>
                    <td>
                      {new Intl.NumberFormat('vi-VN').format(tt.SoTienTaiTro)} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {suKien.NguoiThamDu && suKien.NguoiThamDu.length > 0 && (
          <div className="info-section">
            <h3>Người Tham Dự ({suKien.NguoiThamDu.length})</h3>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Mã SV</th>
                  <th>Họ Tên</th>
                  <th>Vai Trò</th>
                </tr>
              </thead>
              <tbody>
                {suKien.NguoiThamDu.map((td, index) => (
                  <tr key={index}>
                    <td>{td.MaSV}</td>
                    <td>{td.HoTen}</td>
                    <td>{td.VaiTroTrongSuKien}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChiTietSuKien;

