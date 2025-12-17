import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI, doinhomAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './ChiTietCLB.css';

const ChiTietCLB = () => {
  const { user } = useAuth();
  const { MaCLB } = useParams();
  const navigate = useNavigate();
  const [clb, setClb] = useState(null);
  const [doinhom, setDoinhom] = useState([]);
  const [soLuongDoiNhom, setSoLuongDoiNhom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra quyền
  const canEditCLB = user?.role === 'Admin' || user?.role === 'QLCLB' || user?.role === 'HoTro';
  const canCreateDoi = user?.role === 'Admin' || user?.role === 'QLCLB' || user?.role === 'HoTro';
  const canEditDoi = user?.role === 'Admin' || user?.role === 'QLCLB' || user?.role === 'HoTro';
  const canDeleteDoi = user?.role === 'Admin' || user?.role === 'QLCLB';

  useEffect(() => {
    loadData();
  }, [MaCLB]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clbData, dnData, soLuongData] = await Promise.all([
        clbAPI.getById(MaCLB),
        doinhomAPI.getAll({ MaCLB }),
        clbAPI.getSoLuongDoiNhom(MaCLB).catch(() => null), // Function
      ]);
      setClb(clbData);
      setDoinhom(dnData);
      if (soLuongData) {
        setSoLuongDoiNhom(soLuongData.SoLuongDoiNhom);
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải thông tin CLB');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoi = async (MaDoi, TenDoi) => {
    if (!window.confirm(`Xóa đội "${TenDoi}"?`)) return;
    try {
      await doinhomAPI.delete(MaDoi);
      toast.success('Xóa đội nhóm thành công');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể xóa đội nhóm');
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('vi-VN') : '');

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!clb) return <div className="empty-state">Không tìm thấy CLB</div>;

  return (
    <div className="chi-tiet-clb">
      <div className="page-header">
        <h1>Chi tiết CLB</h1>
        <div className="header-actions">
          {canEditCLB && (
            <Link to={`/clb/sua/${MaCLB}`} className="btn btn-success">
              Sửa CLB
            </Link>
          )}
          <Link to="/" className="btn btn-secondary">
            Quay lại
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="info-grid">
          <div className="info-item">
            <label>Mã CLB</label>
            <span>{clb.MaCLB}</span>
          </div>
          <div className="info-item">
            <label>Tên CLB</label>
            <span>{clb.TenCLB}</span>
          </div>
          <div className="info-item">
            <label>Ngày thành lập</label>
            <span>{formatDate(clb.NgayThanhLap)}</span>
          </div>
          {soLuongDoiNhom !== null && (
            <div className="info-item" style={{ 
              background: '#e7f3ff', 
              padding: '10px', 
              borderRadius: '4px',
              border: '1px solid #b3d9ff'
            }}>
              <label style={{ fontWeight: 'bold', color: '#0066cc' }}>
                💡 Số lượng đội nhóm (Function)
              </label>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
                {soLuongDoiNhom}
              </span>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                fn_QLCLB_SoLuongDoiNhom('{MaCLB}')
              </div>
            </div>
          )}
          {clb.MoTa && (
            <div className="info-item full-width">
              <label>Mô tả</label>
              <p>{clb.MoTa}</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Đội nhóm</h3>
          {canCreateDoi && (
            <Link
              to={`/clb/${MaCLB}/doinhom/them`}
              className="btn btn-primary"
              style={{ fontSize: '13px' }}
            >
              + Thêm đội nhóm
            </Link>
          )}
        </div>
        <div className="table-container">
          {doinhom.length === 0 ? (
            <div className="empty-state">Chưa có đội nhóm</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã đội</th>
                  <th>Tên đội</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {doinhom.map((d) => (
                  <tr key={d.MaDoi}>
                    <td>{d.MaDoi}</td>
                    <td>{d.TenDoi}</td>
                    <td>{d.MoTa}</td>
                    <td>
                      <div className="action-buttons">
                        {canEditDoi && (
                          <Link
                            to={`/doinhom/sua/${d.MaDoi}`}
                            className="btn btn-success"
                            style={{ fontSize: '12px', padding: '5px 10px' }}
                          >
                            Sửa
                          </Link>
                        )}
                        {canDeleteDoi && (
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: '12px', padding: '5px 10px' }}
                            onClick={() => handleDeleteDoi(d.MaDoi, d.TenDoi)}
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
      </div>
    </div>
  );
};

export default ChiTietCLB;


