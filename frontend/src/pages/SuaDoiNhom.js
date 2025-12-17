import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clbAPI, doinhomAPI } from '../services/api';
import './ThemCLB.css';

const SuaDoiNhom = () => {
  const navigate = useNavigate();
  const { MaDoi } = useParams();
  const [clbList, setClbList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    TenDoi: '',
    MaCLB: '',
    MoTa: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [MaDoi]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dn, clb] = await Promise.all([
        doinhomAPI.getById(MaDoi),
        clbAPI.getAll(),
      ]);
      setFormData({
        TenDoi: dn.TenDoi || '',
        MaCLB: dn.MaCLB || '',
        MoTa: dn.MoTa || '',
      });
      setClbList(clb);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải thông tin đội nhóm');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
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
      await doinhomAPI.update(MaDoi, formData);
      toast.success('Cập nhật đội nhóm thành công');
      // Cho phép quay lại trang danh sách đội nhóm hoặc chi tiết CLB
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/doinhom');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể cập nhật đội nhóm');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="them-clb">
      <div className="card">
        <div className="card-header">
          <h2>Sửa Đội Nhóm: {MaDoi}</h2>
        </div>
        <form onSubmit={handleSubmit}>
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
              onClick={() => navigate(`/clb/${formData.MaCLB || ''}`)}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuaDoiNhom;


