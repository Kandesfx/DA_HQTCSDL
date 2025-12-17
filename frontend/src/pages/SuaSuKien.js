import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sukienAPI } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ThemSuKien.css';

const SuaSuKien = () => {
  const navigate = useNavigate();
  const { MaSK } = useParams();
  const [clbList, setClbList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    TenSK: '',
    NgayToChuc: null,
    DiaDiem: '',
    MaCLB: '',
    MoTa: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [MaSK]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [suKienData, clbData] = await Promise.all([
        sukienAPI.getById(MaSK),
        sukienAPI.getCLBList(),
      ]);

      setClbList(clbData);
      setFormData({
        TenSK: suKienData.TenSK || '',
        NgayToChuc: suKienData.NgayToChuc
          ? new Date(suKienData.NgayToChuc)
          : null,
        DiaDiem: suKienData.DiaDiem || '',
        MaCLB: suKienData.MaCLB || '',
        MoTa: suKienData.MoTa || '',
      });
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      toast.error('Không thể tải thông tin sự kiện');
      navigate('/');
    } finally {
      setLoadingData(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.TenSK.trim()) {
      newErrors.TenSK = 'Tên sự kiện là bắt buộc';
    }

    if (!formData.NgayToChuc) {
      newErrors.NgayToChuc = 'Ngày tổ chức là bắt buộc';
    } else {
      const ngayToChuc = new Date(formData.NgayToChuc);
      const ngayHienTai = new Date();
      ngayHienTai.setHours(0, 0, 0, 0);
      if (ngayToChuc < ngayHienTai) {
        newErrors.NgayToChuc = 'Ngày tổ chức không được là quá khứ';
      }
    }

    if (!formData.DiaDiem.trim()) {
      newErrors.DiaDiem = 'Địa điểm là bắt buộc';
    }

    if (!formData.MaCLB) {
      newErrors.MaCLB = 'Vui lòng chọn CLB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        NgayToChuc: formData.NgayToChuc.toISOString().split('T')[0],
      };
      await sukienAPI.update(MaSK, submitData);
      toast.success('Cập nhật sự kiện thành công!');
      navigate(`/sukien/${MaSK}`);
    } catch (error) {
      console.error('Lỗi cập nhật sự kiện:', error);
      toast.error(
        error.response?.data?.error || 'Không thể cập nhật sự kiện. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="them-su-kien">
      <div className="card">
        <div className="card-header">
          <h2>Sửa Sự Kiện: {MaSK}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Tên Sự Kiện <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.TenSK}
              onChange={(e) => handleChange('TenSK', e.target.value)}
              placeholder="Nhập tên sự kiện"
              maxLength={100}
            />
            {errors.TenSK && <div className="error">{errors.TenSK}</div>}
          </div>

          <div className="form-group">
            <label>
              Ngày Tổ Chức <span className="required">*</span>
            </label>
            <DatePicker
              selected={formData.NgayToChuc}
              onChange={(date) => handleChange('NgayToChuc', date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="date-picker-input"
              placeholderText="Chọn ngày tổ chức"
            />
            {errors.NgayToChuc && (
              <div className="error">{errors.NgayToChuc}</div>
            )}
          </div>

          <div className="form-group">
            <label>
              Địa Điểm <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.DiaDiem}
              onChange={(e) => handleChange('DiaDiem', e.target.value)}
              placeholder="Nhập địa điểm tổ chức"
              maxLength={100}
            />
            {errors.DiaDiem && <div className="error">{errors.DiaDiem}</div>}
          </div>

          <div className="form-group">
            <label>
              Câu Lạc Bộ <span className="required">*</span>
            </label>
            <select
              value={formData.MaCLB}
              onChange={(e) => handleChange('MaCLB', e.target.value)}
            >
              <option value="">-- Chọn CLB --</option>
              {clbList.map((clb) => (
                <option key={clb.MaCLB} value={clb.MaCLB}>
                  {clb.TenCLB}
                </option>
              ))}
            </select>
            {errors.MaCLB && <div className="error">{errors.MaCLB}</div>}
          </div>

          <div className="form-group">
            <label>Mô Tả</label>
            <textarea
              value={formData.MoTa}
              onChange={(e) => handleChange('MoTa', e.target.value)}
              placeholder="Nhập mô tả chi tiết về sự kiện (tùy chọn)"
              maxLength={200}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Cập Nhật'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/sukien/${MaSK}`)}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuaSuKien;

