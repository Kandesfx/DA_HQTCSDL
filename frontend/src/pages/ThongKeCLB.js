import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './DanhSachCLB.css';

const ThongKeCLB = () => {
  const { user } = useAuth();
  const [thongKe, setThongKe] = useState([]);
  const [baoCao, setBaoCao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('thongke'); // 'thongke' hoặc 'baocao'

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'thongke') {
        const data = await clbAPI.thongKe();
        setThongKe(data);
      } else {
        const data = await clbAPI.baoCaoTongHop();
        setBaoCao(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nhiều đội nhóm':
        return { color: '#28a745', fontWeight: 'bold' };
      case 'Trung bình':
        return { color: '#ffc107' };
      case 'Ít đội nhóm':
        return { color: '#fd7e14' };
      default:
        return { color: '#6c757d' };
    }
  };

  return (
    <div className="danh-sach-clb">
      <div className="page-header">
        <h1>Thống Kê & Báo Cáo CLB</h1>
        <Link to="/" className="btn btn-secondary">
          Quay lại
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ 
        marginBottom: '20px', 
        borderBottom: '2px solid #e0e0e0',
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setActiveTab('thongke')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'thongke' ? '#667eea' : 'transparent',
            color: activeTab === 'thongke' ? 'white' : '#333',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            fontWeight: activeTab === 'thongke' ? 'bold' : 'normal'
          }}
        >
          📊 Thống Kê (Procedure)
        </button>
        <button
          onClick={() => setActiveTab('baocao')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'baocao' ? '#667eea' : 'transparent',
            color: activeTab === 'baocao' ? 'white' : '#333',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            fontWeight: activeTab === 'baocao' ? 'bold' : 'normal'
          }}
        >
          📋 Báo Cáo Tổng Hợp (Cursor)
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          {activeTab === 'thongke' ? (
            <div className="table-container">
              <div style={{ 
                marginBottom: '15px', 
                padding: '10px', 
                background: '#e7f3ff', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>💡 Sử dụng Procedure:</strong> sp_QLCLB_ThongKeCLB
                <br />
                Hiển thị thống kê tất cả CLB kèm số lượng đội nhóm và trạng thái
              </div>
              
              {thongKe.length === 0 ? (
                <div className="empty-state">Chưa có dữ liệu</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Mã CLB</th>
                      <th>Tên CLB</th>
                      <th>Ngày thành lập</th>
                      <th>Số đội nhóm</th>
                      <th>Trạng thái</th>
                      <th>Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thongKe.map((item) => (
                      <tr key={item.MaCLB}>
                        <td>{item.MaCLB}</td>
                        <td>
                          <Link to={`/clb/${item.MaCLB}`} className="link-to-detail">
                            {item.TenCLB}
                          </Link>
                        </td>
                        <td>{formatDate(item.NgayThanhLap)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                          {item.SoLuongDoiNhom}
                        </td>
                        <td style={getStatusColor(item.TrangThai)}>
                          {item.TrangThai}
                        </td>
                        <td>{item.MoTa || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="table-container">
              <div style={{ 
                marginBottom: '15px', 
                padding: '10px', 
                background: '#fff3cd', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>💡 Sử dụng Cursor:</strong> sp_QLCLB_BaoCaoTongHop
                <br />
                Duyệt qua từng CLB để tạo báo cáo chi tiết kèm danh sách đội nhóm
              </div>
              
              {baoCao.length === 0 ? (
                <div className="empty-state">Chưa có dữ liệu</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Mã CLB</th>
                      <th>Tên CLB</th>
                      <th>Số đội nhóm</th>
                      <th>Danh sách đội nhóm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baoCao.map((item) => (
                      <tr key={item.MaCLB}>
                        <td>{item.MaCLB}</td>
                        <td>
                          <Link to={`/clb/${item.MaCLB}`} className="link-to-detail">
                            {item.TenCLB}
                          </Link>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                          {item.SoDoiNhom}
                        </td>
                        <td style={{ maxWidth: '400px' }}>
                          {item.DanhSachDoiNhom}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThongKeCLB;

