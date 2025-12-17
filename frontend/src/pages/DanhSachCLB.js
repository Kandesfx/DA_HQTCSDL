import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './DanhSachCLB.css';

const DanhSachCLB = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kiểm tra quyền
  const canCreate = user?.role === 'Admin' || user?.role === 'QLCLB' || user?.role === 'HoTro';
  const canEdit = user?.role === 'Admin' || user?.role === 'QLCLB' || user?.role === 'HoTro';
  const canDelete = user?.role === 'Admin' || user?.role === 'QLCLB';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await clbAPI.getAll();
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách CLB');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (MaCLB, TenCLB) => {
    if (!window.confirm(`Xóa CLB "${TenCLB}" và toàn bộ đội nhóm?`)) return;
    try {
      await clbAPI.delete(MaCLB);
      toast.success('Xóa CLB thành công');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể xóa CLB');
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN');
  };

  return (
    <div className="danh-sach-clb">
      <div className="page-header">
        <h1>Danh Sách Câu Lạc Bộ</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(user?.role === 'Admin' || user?.role === 'QLCLB') && (
            <>
              <Link to="/clb/thongke" className="btn btn-success" style={{ fontSize: '14px' }}>
                📊 Thống Kê
              </Link>
              <Link to="/clb/demo-transaction" className="btn btn-warning" style={{ fontSize: '14px', background: '#ffc107', color: '#000' }}>
                🔄 Demo Transaction
              </Link>
            </>
          )}
          {canCreate && (
            <Link to="/clb/them" className="btn btn-primary">
              + Thêm CLB
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-container">
          {data.length === 0 ? (
            <div className="empty-state">Chưa có CLB</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã CLB</th>
                  <th>Tên CLB</th>
                  <th>Ngày thành lập</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.MaCLB}>
                    <td>{item.MaCLB}</td>
                    <td>
                      <Link to={`/clb/${item.MaCLB}`} className="link-to-detail">
                        {item.TenCLB}
                      </Link>
                    </td>
                    <td>{formatDate(item.NgayThanhLap)}</td>
                    <td>{item.MoTa}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/clb/${item.MaCLB}`}
                          className="btn btn-secondary"
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          Xem
                        </Link>
                        {canEdit && (
                          <Link
                            to={`/clb/sua/${item.MaCLB}`}
                            className="btn btn-success"
                            style={{ fontSize: '12px', padding: '5px 10px' }}
                          >
                            Sửa
                          </Link>
                        )}
                        {canDelete && (
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '5px 10px' }}
                            onClick={() => handleDelete(item.MaCLB, item.TenCLB)}
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DanhSachCLB;


