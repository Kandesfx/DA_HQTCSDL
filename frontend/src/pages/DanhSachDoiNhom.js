import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doinhomAPI, clbAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './DanhSachCLB.css';

const DanhSachDoiNhom = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [clbList, setClbList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMaCLB, setFilterMaCLB] = useState('');

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
      const [dnData, clbData] = await Promise.all([
        doinhomAPI.getAll({ MaCLB: filterMaCLB || undefined }),
        clbAPI.getAll()
      ]);
      setData(dnData);
      setClbList(clbData);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách đội nhóm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadData();
    }
  }, [filterMaCLB]);

  const handleDelete = async (MaDoi, TenDoi) => {
    if (!window.confirm(`Xóa đội nhóm "${TenDoi}"?`)) return;
    try {
      await doinhomAPI.delete(MaDoi);
      toast.success('Xóa đội nhóm thành công');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể xóa đội nhóm');
    }
  };

  const getCLBName = (MaCLB) => {
    const clb = clbList.find(c => c.MaCLB === MaCLB);
    return clb ? clb.TenCLB : MaCLB;
  };

  return (
    <div className="danh-sach-clb">
      <div className="page-header">
        <h1>Danh Sách Đội Nhóm</h1>
        {canCreate && (
          <Link to="/doinhom/them" className="btn btn-primary">
            + Thêm Đội Nhóm
          </Link>
        )}
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="filter-clb" style={{ fontWeight: '500' }}>Lọc theo CLB:</label>
        <select
          id="filter-clb"
          value={filterMaCLB}
          onChange={(e) => setFilterMaCLB(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          <option value="">Tất cả CLB</option>
          {clbList.map((c) => (
            <option key={c.MaCLB} value={c.MaCLB}>
              {c.TenCLB}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-container">
          {data.length === 0 ? (
            <div className="empty-state">
              {filterMaCLB ? 'Chưa có đội nhóm trong CLB này' : 'Chưa có đội nhóm'}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã Đội</th>
                  <th>Tên Đội</th>
                  <th>Thuộc CLB</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.MaDoi}>
                    <td>{item.MaDoi}</td>
                    <td>{item.TenDoi}</td>
                    <td>
                      <Link to={`/clb/${item.MaCLB}`} className="link-to-detail">
                        {getCLBName(item.MaCLB)}
                      </Link>
                    </td>
                    <td>{item.MoTa || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/clb/${item.MaCLB}`}
                          className="btn btn-secondary"
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          Xem CLB
                        </Link>
                        {canEdit && (
                          <Link
                            to={`/doinhom/sua/${item.MaDoi}`}
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
                            onClick={() => handleDelete(item.MaDoi, item.TenDoi)}
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

export default DanhSachDoiNhom;

