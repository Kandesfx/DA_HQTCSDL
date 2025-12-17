const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');
const authenticate = require('../middleware/auth');
const { authorizeSuKien, authorizeSuKienWrite, authorizeSuKienDelete } = require('../middleware/authorize');

// Tất cả routes đều cần authentication
router.use(authenticate);

// GET: Lấy danh sách tất cả sự kiện (tất cả role có thể xem)
router.get('/', authorizeSuKien, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB, search, fromDate, toDate } = req.query;
    
    let query = `
      SELECT 
        s.MaSK,
        s.TenSK,
        s.NgayToChuc,
        s.DiaDiem,
        s.MaCLB,
        s.MoTa,
        ISNULL((
          SELECT SUM(SoTienTaiTro) 
          FROM TaiTroSuKien 
          WHERE MaSK = s.MaSK
        ), 0) AS TongTaiTro,
        c.TenCLB
      FROM SuKien s
      LEFT JOIN CLB c ON s.MaCLB = c.MaCLB
      WHERE 1=1
    `;
    
    const params = [];
    
    if (MaCLB) {
      query += ` AND s.MaCLB = @MaCLB`;
      params.push({ name: 'MaCLB', type: sql.Char(5), value: MaCLB });
    }
    
    if (search) {
      query += ` AND s.TenSK LIKE @search`;
      params.push({ name: 'search', type: sql.NVarChar(100), value: `%${search}%` });
    }
    
    if (fromDate) {
      query += ` AND s.NgayToChuc >= @fromDate`;
      params.push({ name: 'fromDate', type: sql.Date, value: fromDate });
    }
    
    if (toDate) {
      query += ` AND s.NgayToChuc <= @toDate`;
      params.push({ name: 'toDate', type: sql.Date, value: toDate });
    }
    
    query += ` ORDER BY s.NgayToChuc DESC`;
    
    const request = pool.request();
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy danh sách sự kiện:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách sự kiện' });
  }
});

// GET: Lấy chi tiết một sự kiện (tất cả role có thể xem)
router.get('/:MaSK', authorizeSuKien, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaSK } = req.params;
    
    // Lấy thông tin sự kiện
    const request = pool.request();
    request.input('MaSK', sql.Char(5), MaSK);
    
    const suKienResult = await request.query(`
      SELECT 
        s.*,
        c.TenCLB
      FROM SuKien s
      LEFT JOIN CLB c ON s.MaCLB = c.MaCLB
      WHERE s.MaSK = @MaSK
    `);
    
    if (suKienResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    }
    
    const suKien = suKienResult.recordset[0];
    
    // Lấy danh sách nhà tài trợ
    const taiTroRequest = pool.request();
    taiTroRequest.input('MaSK', sql.Char(5), MaSK);
    const taiTroResult = await taiTroRequest.query(`
      SELECT 
        tts.MaNTT,
        tts.SoTienTaiTro,
        ntt.TenNTT
      FROM TaiTroSuKien tts
      LEFT JOIN NhaTaiTro ntt ON tts.MaNTT = ntt.MaNTT
      WHERE tts.MaSK = @MaSK
    `);
    
    // Lấy danh sách người tham dự
    const thamDuRequest = pool.request();
    thamDuRequest.input('MaSK', sql.Char(5), MaSK);
    const thamDuResult = await thamDuRequest.query(`
      SELECT 
        tds.MaSV,
        tds.VaiTroTrongSuKien,
        tv.HoTen
      FROM ThamDuSuKien tds
      LEFT JOIN ThanhVien tv ON tds.MaSV = tv.MaSV
      WHERE tds.MaSK = @MaSK
    `);
    
    // Tính tổng tài trợ bằng function
    const tongTaiTroRequest = pool.request();
    tongTaiTroRequest.input('MaSK', sql.Char(5), MaSK);
    const tongTaiTroResult = await tongTaiTroRequest.query(`
      SELECT dbo.fn_TongTaiTroSuKien(@MaSK) AS TongTaiTro
    `);
    
    res.json({
      ...suKien,
      TongTaiTro: tongTaiTroResult.recordset[0]?.TongTaiTro || 0,
      NhaTaiTro: taiTroResult.recordset,
      NguoiThamDu: thamDuResult.recordset
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết sự kiện:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết sự kiện' });
  }
});

// POST: Tạo mới sự kiện (chỉ Admin, QLSuKien)
router.post('/', authorizeSuKienWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaSK, TenSK, NgayToChuc, DiaDiem, MaCLB, MoTa } = req.body;
    
    // Validation
    if (!MaSK || !TenSK || !NgayToChuc || !DiaDiem || !MaCLB) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    
    // Kiểm tra ngày tổ chức không được là quá khứ
    const ngayToChuc = new Date(NgayToChuc);
    const ngayHienTai = new Date();
    ngayHienTai.setHours(0, 0, 0, 0);
    
    if (ngayToChuc < ngayHienTai) {
      return res.status(400).json({ error: 'Ngày tổ chức không được là quá khứ' });
    }
    
    // Sử dụng stored procedure nếu có, nếu không thì dùng INSERT trực tiếp
    const request = pool.request();
    request.input('MaSK', sql.Char(5), MaSK);
    request.input('TenSK', sql.NVarChar(100), TenSK);
    request.input('NgayToChuc', sql.Date, NgayToChuc);
    request.input('DiaDiem', sql.NVarChar(100), DiaDiem);
    request.input('MaCLB', sql.Char(5), MaCLB);
    request.input('MoTa', sql.NVarChar(200), MoTa || null);
    
    // Thử gọi stored procedure trước
    try {
      await request.execute('ThongKe_ThemSuKienMoi');
      res.status(201).json({ message: 'Tạo sự kiện thành công', MaSK });
    } catch (procError) {
      // Nếu stored procedure không tồn tại, dùng INSERT trực tiếp
      if (procError.message.includes('Could not find stored procedure')) {
        await request.query(`
          INSERT INTO SuKien (MaSK, TenSK, NgayToChuc, DiaDiem, MaCLB, MoTa)
          VALUES (@MaSK, @TenSK, @NgayToChuc, @DiaDiem, @MaCLB, @MoTa)
        `);
        res.status(201).json({ message: 'Tạo sự kiện thành công', MaSK });
      } else {
        throw procError;
      }
    }
  } catch (error) {
    console.error('Lỗi tạo sự kiện:', error);
    if (error.number === 2627) {
      res.status(400).json({ error: 'Mã sự kiện đã tồn tại' });
    } else if (error.number === 547) {
      res.status(400).json({ error: 'Mã CLB không tồn tại' });
    } else {
      res.status(500).json({ error: 'Lỗi server khi tạo sự kiện' });
    }
  }
});

// PUT: Cập nhật sự kiện (chỉ Admin, QLSuKien)
router.put('/:MaSK', authorizeSuKienWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaSK } = req.params;
    const { TenSK, NgayToChuc, DiaDiem, MaCLB, MoTa } = req.body;
    
    // Kiểm tra sự kiện có tồn tại không
    const checkRequest = pool.request();
    checkRequest.input('MaSK', sql.Char(5), MaSK);
    const checkResult = await checkRequest.query(`
      SELECT NgayToChuc FROM SuKien WHERE MaSK = @MaSK
    `);
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    }
    
    // Kiểm tra sự kiện đã diễn ra chưa
    const ngayToChucCu = new Date(checkResult.recordset[0].NgayToChuc);
    const ngayHienTai = new Date();
    ngayHienTai.setHours(0, 0, 0, 0);
    
    if (ngayToChucCu < ngayHienTai) {
      return res.status(400).json({ error: 'Không thể sửa sự kiện đã diễn ra' });
    }
    
    // Kiểm tra ngày tổ chức mới
    if (NgayToChuc) {
      const ngayToChucMoi = new Date(NgayToChuc);
      if (ngayToChucMoi < ngayHienTai) {
        return res.status(400).json({ error: 'Ngày tổ chức không được là quá khứ' });
      }
    }
    
    // Cập nhật
    const updateRequest = pool.request();
    updateRequest.input('MaSK', sql.Char(5), MaSK);
    
    const updateFields = [];
    if (TenSK) {
      updateFields.push('TenSK = @TenSK');
      updateRequest.input('TenSK', sql.NVarChar(100), TenSK);
    }
    if (NgayToChuc) {
      updateFields.push('NgayToChuc = @NgayToChuc');
      updateRequest.input('NgayToChuc', sql.Date, NgayToChuc);
    }
    if (DiaDiem) {
      updateFields.push('DiaDiem = @DiaDiem');
      updateRequest.input('DiaDiem', sql.NVarChar(100), DiaDiem);
    }
    if (MaCLB) {
      updateFields.push('MaCLB = @MaCLB');
      updateRequest.input('MaCLB', sql.Char(5), MaCLB);
    }
    if (MoTa !== undefined) {
      updateFields.push('MoTa = @MoTa');
      updateRequest.input('MoTa', sql.NVarChar(200), MoTa || null);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Không có trường nào để cập nhật' });
    }
    
    const query = `UPDATE SuKien SET ${updateFields.join(', ')} WHERE MaSK = @MaSK`;
    await updateRequest.query(query);
    
    res.json({ message: 'Cập nhật sự kiện thành công', MaSK });
  } catch (error) {
    console.error('Lỗi cập nhật sự kiện:', error);
    if (error.number === 547) {
      res.status(400).json({ error: 'Mã CLB không tồn tại' });
    } else {
      res.status(500).json({ error: 'Lỗi server khi cập nhật sự kiện' });
    }
  }
});

// DELETE: Xóa sự kiện (chỉ Admin, QLSuKien)
router.delete('/:MaSK', authorizeSuKienDelete, async (req, res) => {
  const transaction = new sql.Transaction(await getPool());
  
  try {
    await transaction.begin();
    
    const { MaSK } = req.params;
    
    // Kiểm tra sự kiện có tồn tại không
    const checkRequest = new sql.Request(transaction);
    checkRequest.input('MaSK', sql.Char(5), MaSK);
    const checkResult = await checkRequest.query(`
      SELECT MaSK FROM SuKien WHERE MaSK = @MaSK
    `);
    
    if (checkResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    }
    
    // Xóa các bản ghi liên quan trước
    const deleteThamDu = new sql.Request(transaction);
    deleteThamDu.input('MaSK', sql.Char(5), MaSK);
    await deleteThamDu.query(`DELETE FROM ThamDuSuKien WHERE MaSK = @MaSK`);
    
    const deleteTaiTro = new sql.Request(transaction);
    deleteTaiTro.input('MaSK', sql.Char(5), MaSK);
    await deleteTaiTro.query(`DELETE FROM TaiTroSuKien WHERE MaSK = @MaSK`);
    
    // Xóa sự kiện
    const deleteRequest = new sql.Request(transaction);
    deleteRequest.input('MaSK', sql.Char(5), MaSK);
    await deleteRequest.query(`DELETE FROM SuKien WHERE MaSK = @MaSK`);
    
    await transaction.commit();
    res.json({ message: 'Xóa sự kiện thành công', MaSK });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi xóa sự kiện:', error);
    res.status(500).json({ error: 'Lỗi server khi xóa sự kiện' });
  }
});

// GET: Lấy danh sách CLB để hiển thị trong dropdown (tất cả role có thể xem)
router.get('/clb/list', authorizeSuKien, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT MaCLB, TenCLB FROM CLB ORDER BY TenCLB
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy danh sách CLB:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách CLB' });
  }
});

module.exports = router;

