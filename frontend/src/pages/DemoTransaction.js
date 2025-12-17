import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI } from '../services/api';
import './ThemCLB.css';

const DemoTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    MaCLB: '',
    TenCLBMoi: '',
    MoTaMoi: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (field, val) => {
    setFormData((p) => ({ ...p, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.MaCLB.trim()) {
      toast.error('Vui lòng nhập mã CLB');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      const data = await clbAPI.demoTransaction(formData);
      setResult(data);
      
      if (data.Status === 'Success') {
        toast.success('Demo transaction thành công!');
      } else {
        toast.error('Transaction đã rollback do lỗi');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Lỗi khi demo transaction';
      toast.error(errorMsg);
      setResult({ Status: 'Error', Message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="them-clb">
      <div className="card">
        <div className="card-header">
          <h2>💡 Demo Transaction (BEGIN TRAN / COMMIT / ROLLBACK)</h2>
        </div>
        
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          background: '#e7f3ff', 
          borderRadius: '8px',
          border: '2px solid #0066cc'
        }}>
          <h3 style={{ marginTop: 0, color: '#0066cc' }}>Mô tả:</h3>
          <p style={{ marginBottom: '10px' }}>
            <strong>Procedure:</strong> sp_QLCLB_DemoTransaction
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Chức năng:</strong> Cập nhật thông tin CLB và tất cả đội nhóm của CLB đó trong một transaction.
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Transaction flow:</strong>
          </p>
          <ol style={{ marginLeft: '20px' }}>
            <li><strong>BEGIN TRAN</strong> - Bắt đầu transaction</li>
            <li>Cập nhật thông tin CLB</li>
            <li>Cập nhật mô tả cho tất cả đội nhóm</li>
            <li>Kiểm tra tính hợp lệ dữ liệu</li>
            <li><strong>COMMIT TRAN</strong> - Nếu thành công</li>
            <li><strong>ROLLBACK TRAN</strong> - Nếu có lỗi</li>
          </ol>
          <p style={{ marginTop: '10px', color: '#d32f2f', fontWeight: 'bold' }}>
            ⚠️ Nếu có lỗi ở bất kỳ bước nào, toàn bộ transaction sẽ được ROLLBACK!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Mã CLB <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.MaCLB}
              onChange={(e) => handleChange('MaCLB', e.target.value.toUpperCase())}
              maxLength={5}
              placeholder="VD: CLB01"
              required
            />
          </div>
          <div className="form-group">
            <label>Tên CLB Mới (tùy chọn)</label>
            <input
              type="text"
              value={formData.TenCLBMoi}
              onChange={(e) => handleChange('TenCLBMoi', e.target.value)}
              maxLength={100}
              placeholder="Để trống nếu không muốn đổi tên"
            />
          </div>
          <div className="form-group">
            <label>Mô tả Mới (tùy chọn)</label>
            <textarea
              value={formData.MoTaMoi}
              onChange={(e) => handleChange('MoTaMoi', e.target.value)}
              maxLength={200}
              placeholder="Để trống nếu không muốn đổi mô tả"
            />
          </div>

          {result && (
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              background: result.Status === 'Success' ? '#d4edda' : '#f8d7da',
              border: `2px solid ${result.Status === 'Success' ? '#28a745' : '#dc3545'}`,
              borderRadius: '8px'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                color: result.Status === 'Success' ? '#28a745' : '#dc3545' 
              }}>
                {result.Status === 'Success' ? '✓ Transaction thành công!' : '✗ Transaction đã rollback!'}
              </h3>
              <p><strong>Trạng thái:</strong> {result.Status}</p>
              <p><strong>Thông báo:</strong> {result.Message}</p>
              {result.SoLuongDoiNhom !== undefined && (
                <p><strong>Số lượng đội nhóm đã cập nhật:</strong> {result.SoLuongDoiNhom}</p>
              )}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang xử lý transaction...' : 'Chạy Demo Transaction'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoTransaction;

