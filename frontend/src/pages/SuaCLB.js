import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI } from '../services/api';
import './ThemCLB.css';

const SuaCLB = () => {
  const navigate = useNavigate();
  const { MaCLB } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    TenCLB: '',
    NgayThanhLap: '',
    MoTa: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [MaCLB]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clbAPI.getById(MaCLB);
      setFormData({
        TenCLB: data.TenCLB || '',
        NgayThanhLap: data.NgayThanhLap ? data.NgayThanhLap.slice(0, 10) : '',
        MoTa: data.MoTa || '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải thông tin CLB');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
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
    try {
      setSaving(true);
      await clbAPI.update(MaCLB, formData);
      toast.success('Cập nhật CLB thành công');
      navigate(`/clb/${MaCLB}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể cập nhật CLB');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="them-clb">
      <div className="card">
        <div className="card-header">
          <h2>Sửa Câu Lạc Bộ: {MaCLB}</h2>
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/clb/${MaCLB}`)}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuaCLB;


