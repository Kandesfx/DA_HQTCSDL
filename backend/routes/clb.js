const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');
const authenticate = require('../middleware/auth');
const { authorizeCLB, authorizeCLBWrite, authorizeCLBDelete } = require('../middleware/authorize');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Lấy danh sách CLB (tất cả role có thể xem)
router.get('/', authorizeCLB, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT MaCLB, TenCLB, NgayThanhLap, MoTa
      FROM CLB
      ORDER BY TenCLB
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy danh sách CLB:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách CLB' });
  }
});

// Lấy chi tiết 1 CLB (tất cả role có thể xem)
router.get('/:MaCLB', authorizeCLB, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB } = req.params;
    const reqDb = pool.request();
    reqDb.input('MaCLB', sql.Char(5), MaCLB);
    const result = await reqDb.query(`
      SELECT MaCLB, TenCLB, NgayThanhLap, MoTa
      FROM CLB WHERE MaCLB = @MaCLB
    `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Không tìm thấy CLB' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Lỗi lấy chi tiết CLB:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết CLB' });
  }
});

// Tạo mới CLB (chỉ Admin, QLCLB, HoTro)
router.post('/', authorizeCLBWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB, TenCLB, NgayThanhLap, MoTa } = req.body;
    if (!MaCLB || !TenCLB) {
      return res.status(400).json({ error: 'MaCLB và TenCLB là bắt buộc' });
    }
    const reqDb = pool.request();
    reqDb.input('MaCLB', sql.Char(5), MaCLB);
    reqDb.input('TenCLB', sql.NVarChar(100), TenCLB);
    reqDb.input('NgayThanhLap', sql.Date, NgayThanhLap || null);
    reqDb.input('MoTa', sql.NVarChar(200), MoTa || null);
    await reqDb.query(`
      INSERT INTO CLB (MaCLB, TenCLB, NgayThanhLap, MoTa)
      VALUES (@MaCLB, @TenCLB, @NgayThanhLap, @MoTa)
    `);
    res.status(201).json({ message: 'Tạo CLB thành công', MaCLB });
  } catch (error) {
    console.error('Lỗi tạo CLB:', error);
    if (error.number === 2627) {
      // Kiểm tra xem lỗi là do MaCLB hay TenCLB
      const errorMessage = error.message || '';
      if (errorMessage.includes('MaCLB') || errorMessage.includes('PRIMARY KEY')) {
        return res.status(400).json({ error: `Mã CLB "${req.body.MaCLB}" đã tồn tại. Vui lòng chọn mã khác.` });
      } else {
        return res.status(400).json({ error: `Tên CLB "${req.body.TenCLB}" đã tồn tại. Vui lòng chọn tên khác.` });
      }
    }
    res.status(500).json({ error: 'Lỗi server khi tạo CLB' });
  }
});

// Cập nhật CLB (chỉ Admin, QLCLB, HoTro)
router.put('/:MaCLB', authorizeCLBWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB } = req.params;
    const { TenCLB, NgayThanhLap, MoTa } = req.body;

    const reqDb = pool.request();
    reqDb.input('MaCLB', sql.Char(5), MaCLB);
    const exists = await reqDb.query(`SELECT MaCLB FROM CLB WHERE MaCLB = @MaCLB`);
    if (!exists.recordset.length) {
      return res.status(404).json({ error: 'Không tìm thấy CLB' });
    }

    const reqUpdate = pool.request();
    reqUpdate.input('MaCLB', sql.Char(5), MaCLB);
    const fields = [];
    if (TenCLB !== undefined) {
      fields.push('TenCLB = @TenCLB');
      reqUpdate.input('TenCLB', sql.NVarChar(100), TenCLB);
    }
    if (NgayThanhLap !== undefined) {
      fields.push('NgayThanhLap = @NgayThanhLap');
      reqUpdate.input('NgayThanhLap', sql.Date, NgayThanhLap || null);
    }
    if (MoTa !== undefined) {
      fields.push('MoTa = @MoTa');
      reqUpdate.input('MoTa', sql.NVarChar(200), MoTa || null);
    }
    if (!fields.length) {
      return res.status(400).json({ error: 'Không có trường cần cập nhật' });
    }
    await reqUpdate.query(`UPDATE CLB SET ${fields.join(', ')} WHERE MaCLB = @MaCLB`);
    res.json({ message: 'Cập nhật CLB thành công', MaCLB });
  } catch (error) {
    console.error('Lỗi cập nhật CLB:', error);
    if (error.number === 2627) {
      return res.status(400).json({ error: 'TenCLB đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi server khi cập nhật CLB' });
  }
});

// Xóa CLB (chỉ Admin, QLCLB)
router.delete('/:MaCLB', authorizeCLBDelete, async (req, res) => {
  const transaction = new sql.Transaction(await getPool());
  try {
    await transaction.begin();
    const { MaCLB } = req.params;

    const reqCheck = new sql.Request(transaction);
    reqCheck.input('MaCLB', sql.Char(5), MaCLB);
    const exists = await reqCheck.query(`SELECT MaCLB FROM CLB WHERE MaCLB = @MaCLB`);
    if (!exists.recordset.length) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Không tìm thấy CLB' });
    }

    // Xóa bảng phụ: đội nhóm, thông báo, sự kiện nếu cần
    const reqDelDoi = new sql.Request(transaction);
    reqDelDoi.input('MaCLB', sql.Char(5), MaCLB);
    await reqDelDoi.query(`DELETE FROM DoiNhom WHERE MaCLB = @MaCLB`);

    const reqDel = new sql.Request(transaction);
    reqDel.input('MaCLB', sql.Char(5), MaCLB);
    await reqDel.query(`DELETE FROM CLB WHERE MaCLB = @MaCLB`);

    await transaction.commit();
    res.json({ message: 'Xóa CLB thành công', MaCLB });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi xóa CLB:', error);
    res.status(500).json({ error: 'Lỗi server khi xóa CLB' });
  }
});

// ============================================================
// ENDPOINTS CHO CÁC CẤU TRÚC SQL CỦA QUẢN LÝ CLB
// ============================================================

// 1. Thống kê CLB và số lượng đội nhóm (Procedure)
router.get('/thongke/tatca', authorizeCLB, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('sp_QLCLB_ThongKeCLB');
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi thống kê CLB:', error);
    res.status(500).json({ error: 'Lỗi server khi thống kê CLB' });
  }
});

// 2. Số lượng đội nhóm của một CLB (Function)
router.get('/:MaCLB/soluong-doinhom', authorizeCLB, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB } = req.params;
    const request = pool.request();
    request.input('MaCLB', sql.Char(5), MaCLB);
    const result = await request.query(`
      SELECT dbo.fn_QLCLB_SoLuongDoiNhom(@MaCLB) AS SoLuongDoiNhom
    `);
    res.json({
      MaCLB,
      SoLuongDoiNhom: result.recordset[0].SoLuongDoiNhom
    });
  } catch (error) {
    console.error('Lỗi tính số lượng đội nhóm:', error);
    res.status(500).json({ error: 'Lỗi server khi tính số lượng đội nhóm' });
  }
});

// 3. Báo cáo tổng hợp CLB (Cursor - Procedure)
router.get('/baocao/tonghop', authorizeCLB, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('sp_QLCLB_BaoCaoTongHop');
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi tạo báo cáo:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo báo cáo' });
  }
});

// 4. Demo Transaction với BEGIN TRAN / COMMIT / ROLLBACK
router.post('/demo-transaction', authorizeCLBWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB, TenCLBMoi, MoTaMoi } = req.body;

    if (!MaCLB) {
      return res.status(400).json({ error: 'MaCLB là bắt buộc' });
    }

    const request = pool.request();
    request.input('MaCLB', sql.Char(5), MaCLB);
    request.input('TenCLBMoi', sql.NVarChar(100), TenCLBMoi || null);
    request.input('MoTaMoi', sql.NVarChar(200), MoTaMoi || null);

    const result = await request.execute('sp_QLCLB_DemoTransaction');
    const output = result.recordset[0];

    if (output.Status === 'Error') {
      return res.status(400).json({ error: output.Message });
    }

    res.json({
      message: 'Demo transaction thành công',
      ...output
    });
  } catch (error) {
    console.error('Lỗi demo transaction:', error);
    res.status(500).json({ error: 'Lỗi server khi demo transaction' });
  }
});

// 5. Tạo CLB mới kèm đội nhóm ban đầu (Transaction - Procedure)
router.post('/tao-voi-doinhom', authorizeCLBWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { 
      MaCLB, 
      TenCLB, 
      NgayThanhLap, 
      MoTa,
      MaDoiBanDau,
      TenDoiBanDau,
      MoTaDoi
    } = req.body;

    if (!MaCLB || !TenCLB) {
      return res.status(400).json({ error: 'MaCLB và TenCLB là bắt buộc' });
    }

    const request = pool.request();
    request.input('MaCLB', sql.Char(5), MaCLB);
    request.input('TenCLB', sql.NVarChar(100), TenCLB);
    request.input('NgayThanhLap', sql.Date, NgayThanhLap || null);
    request.input('MoTa', sql.NVarChar(200), MoTa || null);
    request.input('MaDoiBanDau', sql.Char(5), MaDoiBanDau || null);
    request.input('TenDoiBanDau', sql.NVarChar(100), TenDoiBanDau || null);
    request.input('MoTaDoi', sql.NVarChar(200), MoTaDoi || null);

    const result = await request.execute('sp_QLCLB_TaoCLBVoiDoiNhom');
    const output = result.recordset[0];

    if (output.Status === 'Error') {
      return res.status(400).json({ error: output.Message });
    }

    res.status(201).json({
      message: 'Tạo CLB thành công',
      ...output
    });
  } catch (error) {
    console.error('Lỗi tạo CLB với đội nhóm:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo CLB' });
  }
});

module.exports = router;


