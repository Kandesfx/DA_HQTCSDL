import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sukienAPI } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ThemSuKien.css';

const ThemSuKien = () => {
  const navigate = useNavigate();
  const [clbList, setClbList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    MaSK: '',
    TenSK: '',
    NgayToChuc: null,
    DiaDiem: '',
    MaCLB: '',
    MoTa: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCLBList();
  }, []);

  const loadCLBList = async () => {
    try {
      const data = await sukienAPI.getCLBList();
      setClbList(data);
    } catch (error) {
      console.error('Lỗi tải danh sách CLB:', error);
      toast.error('Không thể tải danh sách CLB');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.MaSK.trim()) {
      newErrors.MaSK = 'Mã sự kiện là bắt buộc';
    } else if (!/^SK\d{2,}$/.test(formData.MaSK)) {
      newErrors.MaSK = 'Mã sự kiện phải có định dạng SK## (ví dụ: SK01)';
    }

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
    // Xóa lỗi khi người dùng bắt đầu nhập
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
      await sukienAPI.create(submitData);
      toast.success('Tạo sự kiện thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi tạo sự kiện:', error);
      toast.error(
        error.response?.data?.error || 'Không thể tạo sự kiện. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="them-su-kien">
      <div className="card">
        <div className="card-header">
          <h2>Thêm Sự Kiện Mới</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Mã Sự Kiện <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.MaSK}
              onChange={(e) => handleChange('MaSK', e.target.value.toUpperCase())}
              placeholder="VD: SK01, SK06"
              maxLength={5}
            />
            {errors.MaSK && <div className="error">{errors.MaSK}</div>}
          </div>

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
              {loading ? 'Đang lưu...' : 'Lưu Sự Kiện'}
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

export default ThemSuKien;

