const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../config/db');
const authenticate = require('../middleware/auth');
const { authorizeDoiNhom, authorizeDoiNhomWrite, authorizeDoiNhomDelete } = require('../middleware/authorize');

// Tất cả routes đều cần authentication
router.use(authenticate);

// Lấy danh sách đội nhóm (tất cả role có thể xem)
router.get('/', authorizeDoiNhom, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaCLB } = req.query;

    let query = `
      SELECT dn.MaDoi, dn.TenDoi, dn.MaCLB, dn.MoTa, c.TenCLB
      FROM DoiNhom dn
      LEFT JOIN CLB c ON dn.MaCLB = c.MaCLB
      WHERE 1=1
    `;
    const params = [];
    if (MaCLB) {
      query += ' AND dn.MaCLB = @MaCLB';
      params.push({ name: 'MaCLB', type: sql.Char(5), value: MaCLB });
    }
    query += ' ORDER BY dn.TenDoi';

    const reqDb = pool.request();
    params.forEach(p => reqDb.input(p.name, p.type, p.value));
    const result = await reqDb.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi lấy danh sách đội nhóm:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách đội nhóm' });
  }
});

// Lấy chi tiết 1 đội nhóm (tất cả role có thể xem)
router.get('/:MaDoi', authorizeDoiNhom, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaDoi } = req.params;
    const reqDb = pool.request();
    reqDb.input('MaDoi', sql.Char(5), MaDoi);
    const result = await reqDb.query(`
      SELECT dn.MaDoi, dn.TenDoi, dn.MaCLB, dn.MoTa, c.TenCLB
      FROM DoiNhom dn
      LEFT JOIN CLB c ON dn.MaCLB = c.MaCLB
      WHERE dn.MaDoi = @MaDoi
    `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Không tìm thấy đội nhóm' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Lỗi lấy chi tiết đội nhóm:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết đội nhóm' });
  }
});

// Tạo mới đội nhóm (chỉ Admin, QLCLB, HoTro)
router.post('/', authorizeDoiNhomWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaDoi, TenDoi, MaCLB, MoTa } = req.body;
    if (!MaDoi || !TenDoi || !MaCLB) {
      return res.status(400).json({ error: 'MaDoi, TenDoi, MaCLB là bắt buộc' });
    }

    const reqDb = pool.request();
    reqDb.input('MaDoi', sql.Char(5), MaDoi);
    reqDb.input('TenDoi', sql.NVarChar(100), TenDoi);
    reqDb.input('MaCLB', sql.Char(5), MaCLB);
    reqDb.input('MoTa', sql.NVarChar(200), MoTa || null);

    await reqDb.query(`
      INSERT INTO DoiNhom (MaDoi, TenDoi, MaCLB, MoTa)
      VALUES (@MaDoi, @TenDoi, @MaCLB, @MoTa)
    `);

    res.status(201).json({ message: 'Tạo đội nhóm thành công', MaDoi });
  } catch (error) {
    console.error('Lỗi tạo đội nhóm:', error);
    if (error.number === 2627) {
      return res.status(400).json({ error: `Mã đội nhóm "${req.body.MaDoi}" đã tồn tại. Vui lòng chọn mã khác.` });
    }
    if (error.number === 547) {
      return res.status(400).json({ error: `Mã CLB "${req.body.MaCLB}" không tồn tại. Vui lòng chọn CLB hợp lệ.` });
    }
    res.status(500).json({ error: 'Lỗi server khi tạo đội nhóm' });
  }
});

// Cập nhật đội nhóm (chỉ Admin, QLCLB, HoTro)
router.put('/:MaDoi', authorizeDoiNhomWrite, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaDoi } = req.params;
    const { TenDoi, MaCLB, MoTa } = req.body;

    const reqCheck = pool.request();
    reqCheck.input('MaDoi', sql.Char(5), MaDoi);
    const exists = await reqCheck.query(`SELECT MaDoi FROM DoiNhom WHERE MaDoi = @MaDoi`);
    if (!exists.recordset.length) {
      return res.status(404).json({ error: 'Không tìm thấy đội nhóm' });
    }

    const reqDb = pool.request();
    reqDb.input('MaDoi', sql.Char(5), MaDoi);
    const fields = [];
    if (TenDoi !== undefined) {
      fields.push('TenDoi = @TenDoi');
      reqDb.input('TenDoi', sql.NVarChar(100), TenDoi);
    }
    if (MaCLB !== undefined) {
      fields.push('MaCLB = @MaCLB');
      reqDb.input('MaCLB', sql.Char(5), MaCLB);
    }
    if (MoTa !== undefined) {
      fields.push('MoTa = @MoTa');
      reqDb.input('MoTa', sql.NVarChar(200), MoTa || null);
    }
    if (!fields.length) {
      return res.status(400).json({ error: 'Không có trường cần cập nhật' });
    }

    await reqDb.query(`UPDATE DoiNhom SET ${fields.join(', ')} WHERE MaDoi = @MaDoi`);
    res.json({ message: 'Cập nhật đội nhóm thành công', MaDoi });
  } catch (error) {
    console.error('Lỗi cập nhật đội nhóm:', error);
    if (error.number === 547) {
      return res.status(400).json({ error: 'MaCLB không tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi server khi cập nhật đội nhóm' });
  }
});

// Xóa đội nhóm (chỉ Admin, QLCLB)
router.delete('/:MaDoi', authorizeDoiNhomDelete, async (req, res) => {
  try {
    const pool = await getPool();
    const { MaDoi } = req.params;

    const reqCheck = pool.request();
    reqCheck.input('MaDoi', sql.Char(5), MaDoi);
    const exists = await reqCheck.query(`SELECT MaDoi FROM DoiNhom WHERE MaDoi = @MaDoi`);
    if (!exists.recordset.length) {
      return res.status(404).json({ error: 'Không tìm thấy đội nhóm' });
    }

    const reqDel = pool.request();
    reqDel.input('MaDoi', sql.Char(5), MaDoi);
    await reqDel.query(`DELETE FROM DoiNhom WHERE MaDoi = @MaDoi`);

    res.json({ message: 'Xóa đội nhóm thành công', MaDoi });
  } catch (error) {
    console.error('Lỗi xóa đội nhóm:', error);
    res.status(500).json({ error: 'Lỗi server khi xóa đội nhóm' });
  }
});

module.exports = router;


