import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI, doinhomAPI } from '../services/api';
import './ThemCLB.css';

const ThemDoiNhomStandalone = () => {
  const navigate = useNavigate();
  const [clbList, setClbList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    MaDoi: '',
    TenDoi: '',
    MaCLB: '',
    MoTa: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCLB();
  }, []);

  const loadCLB = async () => {
    try {
      setLoading(true);
      const data = await clbAPI.getAll();
      setClbList(data);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách CLB');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.MaDoi.trim()) e.MaDoi = 'Mã đội bắt buộc';
    if (!formData.TenDoi.trim()) e.TenDoi = 'Tên đội bắt buộc';
    if (!formData.MaCLB) e.MaCLB = 'Vui lòng chọn CLB';
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
    try {
      setSaving(true);
      await doinhomAPI.create(formData);
      toast.success('Thêm đội nhóm thành công');
      navigate('/doinhom');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Không thể tạo đội nhóm';
      if (err.response?.status === 400 && errorMsg.includes('đã tồn tại')) {
        toast.error(errorMsg);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="them-clb">
      <div className="card">
        <div className="card-header">
          <h2>Thêm Đội Nhóm</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Mã Đội <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.MaDoi}
              onChange={(e) => handleChange('MaDoi', e.target.value.toUpperCase())}
              maxLength={5}
            />
            {errors.MaDoi && <div className="error">{errors.MaDoi}</div>}
          </div>
          <div className="form-group">
            <label>
              Tên Đội <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.TenDoi}
              onChange={(e) => handleChange('TenDoi', e.target.value)}
              maxLength={100}
            />
            {errors.TenDoi && <div className="error">{errors.TenDoi}</div>}
          </div>
          <div className="form-group">
            <label>
              Thuộc CLB <span className="required">*</span>
            </label>
            <select
              value={formData.MaCLB}
              onChange={(e) => handleChange('MaCLB', e.target.value)}
            >
              <option value="">-- Chọn CLB --</option>
              {clbList.map((c) => (
                <option key={c.MaCLB} value={c.MaCLB}>
                  {c.TenCLB}
                </option>
              ))}
            </select>
            {errors.MaCLB && <div className="error">{errors.MaCLB}</div>}
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.MoTa}
              onChange={(e) => handleChange('MoTa', e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/doinhom')}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemDoiNhomStandalone;

