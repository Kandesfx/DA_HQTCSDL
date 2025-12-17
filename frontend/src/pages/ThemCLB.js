import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI } from '../services/api';
import './ThemCLB.css';

const ThemCLB = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    MaCLB: '',
    TenCLB: '',
    NgayThanhLap: '',
    MoTa: '',
  });
  const [useTransaction, setUseTransaction] = useState(false);
  const [doiNhomData, setDoiNhomData] = useState({
    MaDoiBanDau: '',
    TenDoiBanDau: '',
    MoTaDoi: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.MaCLB.trim()) e.MaCLB = 'Mã CLB bắt buộc';
    if (!formData.TenCLB.trim()) e.TenCLB = 'Tên CLB bắt buộc';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, val) => {
    setFormData((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng kiểm tra thông tin');
      return;
    }
    
    // Validate đội nhóm nếu dùng transaction
    if (useTransaction && (!doiNhomData.MaDoiBanDau || !doiNhomData.TenDoiBanDau)) {
      toast.error('Vui lòng nhập đầy đủ thông tin đội nhóm ban đầu');
      return;
    }
    
    try {
      setLoading(true);
      
      if (useTransaction) {
        // Sử dụng Transaction Procedure
        const result = await clbAPI.taoVoiDoiNhom({
          ...formData,
          ...doiNhomData
        });
        toast.success('Thêm CLB với đội nhóm thành công (Transaction)');
      } else {
        // Tạo CLB thông thường
        await clbAPI.create(formData);
        toast.success('Thêm CLB thành công');
      }
      
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể tạo CLB');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="them-clb">
      <div className="card">
        <div className="card-header">
          <h2>Thêm Câu Lạc Bộ</h2>
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
            />
            {errors.MaCLB && <div className="error">{errors.MaCLB}</div>}
          </div>
          <div className="form-group">
            <label>
              Tên CLB <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.TenCLB}
              onChange={(e) => handleChange('TenCLB', e.target.value)}
              maxLength={100}
            />
            {errors.TenCLB && <div className="error">{errors.TenCLB}</div>}
          </div>
          <div className="form-group">
            <label>Ngày thành lập</label>
            <input
              type="date"
              value={formData.NgayThanhLap}
              onChange={(e) => handleChange('NgayThanhLap', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.MoTa}
              onChange={(e) => handleChange('MoTa', e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Transaction Option */}
          <div className="form-group" style={{ 
            border: '2px solid #667eea', 
            padding: '15px', 
            borderRadius: '8px',
            background: '#f0f4ff'
          }}>
            <label style={{ fontWeight: 'bold', color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={useTransaction}
                onChange={(e) => setUseTransaction(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              💡 Tạo CLB kèm đội nhóm ban đầu (Transaction)
            </label>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', marginLeft: '30px' }}>
              Sử dụng Procedure: sp_QLCLB_TaoCLBVoiDoiNhom - Đảm bảo tính toàn vẹn dữ liệu
            </div>
            
            {useTransaction && (
              <div style={{ marginTop: '15px', marginLeft: '30px' }}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>
                    Mã Đội Nhóm Ban Đầu <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={doiNhomData.MaDoiBanDau}
                    onChange={(e) => setDoiNhomData({...doiNhomData, MaDoiBanDau: e.target.value.toUpperCase()})}
                    maxLength={5}
                    placeholder="VD: DN01"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>
                    Tên Đội Nhóm Ban Đầu <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={doiNhomData.TenDoiBanDau}
                    onChange={(e) => setDoiNhomData({...doiNhomData, TenDoiBanDau: e.target.value})}
                    maxLength={100}
                    placeholder="VD: Đội Ban Đầu"
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả Đội Nhóm</label>
                  <textarea
                    value={doiNhomData.MoTaDoi}
                    onChange={(e) => setDoiNhomData({...doiNhomData, MoTaDoi: e.target.value})}
                    maxLength={200}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemCLB;


