import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sukienAPI } from '../services/api';
import './DanhSachSuKien.css';

const DanhSachSuKien = () => {
  const [suKienList, setSuKienList] = useState([]);
  const [clbList, setClbList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    MaCLB: '',
    search: '',
    fromDate: '',
    toDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [suKienData, clbData] = await Promise.all([
        sukienAPI.getAll(filters),
        sukienAPI.getCLBList(),
      ]);
      setSuKienList(suKienData);
      setClbList(clbData);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      toast.error('Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (MaSK, TenSK) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${TenSK}"?`)) {
      return;
    }

    try {
      await sukienAPI.delete(MaSK);
      toast.success('Xóa sự kiện thành công');
      loadData();
    } catch (error) {
      console.error('Lỗi xóa sự kiện:', error);
      toast.error(error.response?.data?.error || 'Không thể xóa sự kiện');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      MaCLB: '',
      search: '',
      fromDate: '',
      toDate: '',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="danh-sach-su-kien">
      <div className="page-header">
        <h1>Danh Sách Sự Kiện</h1>
        <Link to="/sukien/them" className="btn btn-primary">
          + Thêm Sự Kiện Mới
        </Link>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Tìm kiếm theo tên</label>
            <input
              type="text"
              placeholder="Nhập tên sự kiện..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Lọc theo CLB</label>
            <select
              value={filters.MaCLB}
              onChange={(e) => handleFilterChange('MaCLB', e.target.value)}
            >
              <option value="">Tất cả CLB</option>
              {clbList.map((clb) => (
                <option key={clb.MaCLB} value={clb.MaCLB}>
                  {clb.TenCLB}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Từ ngày</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Đến ngày</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <button className="btn btn-secondary" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        {suKienList.length === 0 ? (
          <div className="empty-state">
            <p>Không có sự kiện nào</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã SK</th>
                <th>Tên Sự Kiện</th>
                <th>Ngày Tổ Chức</th>
                <th>Địa Điểm</th>
                <th>CLB</th>
                <th>Tổng Tài Trợ</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {suKienList.map((suKien) => (
                <tr key={suKien.MaSK}>
                  <td>{suKien.MaSK}</td>
                  <td>
                    <Link
                      to={`/sukien/${suKien.MaSK}`}
                      className="link-to-detail"
                    >
                      {suKien.TenSK}
                    </Link>
                  </td>
                  <td>{formatDate(suKien.NgayToChuc)}</td>
                  <td>{suKien.DiaDiem}</td>
                  <td>{suKien.TenCLB}</td>
                  <td>
                    {suKien.TongTaiTro
                      ? new Intl.NumberFormat('vi-VN').format(
                          suKien.TongTaiTro
                        ) + ' đ'
                      : '0 đ'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/sukien/${suKien.MaSK}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        Xem
                      </Link>
                      <Link
                        to={`/sukien/sua/${suKien.MaSK}`}
                        className="btn btn-success"
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        Sửa
                      </Link>
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                        onClick={() =>
                          handleDelete(suKien.MaSK, suKien.TenSK)
                        }
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DanhSachSuKien;

