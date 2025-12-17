# HƯỚNG DẪN SỬ DỤNG CÁC CẤU TRÚC SQL CHO QUẢN LÝ CLB

## Tổng quan

Đã tạo 5 cấu trúc SQL phục vụ vai trò **Quản lý CLB** (Lê Vũ Hải) với nhiệm vụ CRUD bảng CLB và đội nhóm:

1. **Procedure**: Thống kê CLB và số lượng đội nhóm
2. **Function**: Tính số lượng đội nhóm của một CLB
3. **Trigger**: Tự động cập nhật số lượng đội nhóm
4. **Cursor**: Tạo báo cáo tổng hợp CLB
5. **Transaction**: Tạo CLB mới kèm đội nhóm ban đầu

## 1. STORED PROCEDURE: sp_QLCLB_ThongKeCLB

### Mục đích
Thống kê tất cả CLB kèm số lượng đội nhóm và trạng thái (Nhiều/Trung bình/Ít/Chưa có)

### Cách sử dụng

**SQL:**
```sql
EXEC sp_QLCLB_ThongKeCLB;
```

**API:**
```
GET /api/clb/thongke/tatca
```

**UI:**
- Vào trang "Danh Sách CLB"
- Click nút "📊 Thống Kê"
- Hoặc truy cập: `/clb/thongke`

### Kết quả
- Mã CLB, Tên CLB, Ngày thành lập, Mô tả
- Số lượng đội nhóm
- Trạng thái: "Nhiều đội nhóm", "Trung bình", "Ít đội nhóm", "Chưa có đội nhóm"

## 2. FUNCTION: fn_QLCLB_SoLuongDoiNhom

### Mục đích
Tính số lượng đội nhóm của một CLB cụ thể - dùng để hiển thị trong UI

### Cách sử dụng

**SQL:**
```sql
SELECT dbo.fn_QLCLB_SoLuongDoiNhom('CLB01') AS SoDoiNhom;
```

**API:**
```
GET /api/clb/:MaCLB/soluong-doinhom
```

**UI:**
- Vào trang chi tiết CLB (`/clb/:MaCLB`)
- Số lượng đội nhóm được hiển thị tự động trong card thông tin

### Kết quả
- Số lượng đội nhóm (INT)

## 3. TRIGGER: trg_QLCLB_UpdateSoLuongDoiNhom

### Mục đích
Tự động cập nhật cột `SoLuongDoiNhom` trong bảng CLB khi thêm/xóa đội nhóm

### Cách hoạt động
- **Khi INSERT đội nhóm**: Tự động tăng `SoLuongDoiNhom` lên 1
- **Khi DELETE đội nhóm**: Tự động giảm `SoLuongDoiNhom` xuống 1

### Cách sử dụng
Trigger tự động chạy, không cần gọi trực tiếp.

**Test:**
```sql
-- Xem số lượng hiện tại
SELECT MaCLB, TenCLB, SoLuongDoiNhom FROM CLB WHERE MaCLB = 'CLB01';

-- Thêm đội nhóm mới
INSERT INTO DoiNhom (MaDoi, TenDoi, MaCLB) VALUES ('TEST1', N'Test', 'CLB01');

-- Kiểm tra lại (số lượng đã tăng)
SELECT MaCLB, TenCLB, SoLuongDoiNhom FROM CLB WHERE MaCLB = 'CLB01';

-- Xóa đội nhóm
DELETE FROM DoiNhom WHERE MaDoi = 'TEST1';

-- Kiểm tra lại (số lượng đã giảm)
SELECT MaCLB, TenCLB, SoLuongDoiNhom FROM CLB WHERE MaCLB = 'CLB01';
```

## 4. CURSOR: sp_QLCLB_BaoCaoTongHop

### Mục đích
Duyệt qua từng CLB để tạo báo cáo chi tiết kèm danh sách đội nhóm

### Cách sử dụng

**SQL:**
```sql
EXEC sp_QLCLB_BaoCaoTongHop;
```

**API:**
```
GET /api/clb/baocao/tonghop
```

**UI:**
- Vào trang "Thống Kê CLB" (`/clb/thongke`)
- Click tab "📋 Báo Cáo Tổng Hợp (Cursor)"

### Kết quả
- Mã CLB, Tên CLB
- Số lượng đội nhóm
- Danh sách tên các đội nhóm (ngăn cách bởi dấu phẩy)

## 5. TRANSACTION: sp_QLCLB_TaoCLBVoiDoiNhom

### Mục đích
Tạo CLB mới kèm đội nhóm ban đầu trong một transaction - đảm bảo tính toàn vẹn dữ liệu

### Cách sử dụng

**SQL:**
```sql
EXEC sp_QLCLB_TaoCLBVoiDoiNhom
    @MaCLB = 'CLB06',
    @TenCLB = N'CLB Mới',
    @NgayThanhLap = '2024-01-01',
    @MoTa = N'Mô tả CLB',
    @MaDoiBanDau = 'DN01',
    @TenDoiBanDau = N'Đội Ban Đầu',
    @MoTaDoi = N'Mô tả đội';
```

**API:**
```
POST /api/clb/tao-voi-doinhom
Body: {
  "MaCLB": "CLB06",
  "TenCLB": "CLB Mới",
  "NgayThanhLap": "2024-01-01",
  "MoTa": "Mô tả CLB",
  "MaDoiBanDau": "DN01",
  "TenDoiBanDau": "Đội Ban Đầu",
  "MoTaDoi": "Mô tả đội"
}
```

**UI:**
- Vào trang "Thêm CLB" (`/clb/them`)
- Tích vào checkbox "💡 Tạo CLB kèm đội nhóm ban đầu (Transaction)"
- Nhập thông tin CLB và đội nhóm ban đầu
- Click "Lưu"

### Tính năng
- Sử dụng **BEGIN TRAN** / **COMMIT TRAN** / **ROLLBACK TRAN** (theo yêu cầu chấm điểm)
- Nếu tạo CLB thành công nhưng tạo đội nhóm thất bại → **ROLLBACK** toàn bộ
- Nếu cả hai thành công → **COMMIT** transaction
- Đảm bảo tính toàn vẹn dữ liệu

## 6. DEMO TRANSACTION: sp_QLCLB_DemoTransaction

### Mục đích
Minh họa rõ ràng BEGIN TRAN, COMMIT, ROLLBACK với nhiều bước xử lý

### Cách sử dụng

**SQL:**
```sql
EXEC sp_QLCLB_DemoTransaction 
    @MaCLB = 'CLB01',
    @TenCLBMoi = N'CLB Đã Cập Nhật',
    @MoTaMoi = N'Mô tả mới';
```

**API:**
```
POST /api/clb/demo-transaction
Body: {
  "MaCLB": "CLB01",
  "TenCLBMoi": "CLB Đã Cập Nhật",
  "MoTaMoi": "Mô tả mới"
}
```

**UI:**
- Vào trang "Danh Sách CLB"
- Click nút "🔄 Demo Transaction"
- Hoặc truy cập: `/clb/demo-transaction`
- Nhập mã CLB và thông tin cập nhật
- Click "Chạy Demo Transaction"

### Tính năng
- **BEGIN TRAN** - Bắt đầu transaction
- Cập nhật CLB
- Cập nhật tất cả đội nhóm của CLB
- Kiểm tra tính hợp lệ
- **COMMIT TRAN** nếu thành công
- **ROLLBACK TRAN** nếu có lỗi
- Hiển thị kết quả rõ ràng trên UI

## 7. DEMO LOCKING: sp_QLCLB_DemoLocking

### Mục đích
Minh họa locking và isolation levels (READ COMMITTED, SERIALIZABLE)

### Cách sử dụng

**SQL:**
```sql
-- Demo READ COMMITTED
EXEC sp_QLCLB_DemoLocking @IsolationLevel = 'READ COMMITTED';

-- Demo SERIALIZABLE
EXEC sp_QLCLB_DemoLocking @IsolationLevel = 'SERIALIZABLE';
```

### Hướng dẫn demo locking

1. **Mở 2 cửa sổ SQL Server Management Studio**
2. **Cửa sổ 1**: Chạy `EXEC sp_QLCLB_DemoLocking @IsolationLevel = 'READ COMMITTED';`
3. **Cửa sổ 2**: Trong khi cửa sổ 1 đang chạy, thử:
   ```sql
   UPDATE CLB SET MoTa = 'Test' WHERE MaCLB = 'CLB01';
   ```
4. **Kết quả**: Cửa sổ 2 sẽ phải đợi cửa sổ 1 commit mới được thực hiện

### Xem locks hiện tại
```sql
SELECT 
    request_session_id,
    resource_type,
    resource_database_id,
    request_mode,
    request_status
FROM sys.dm_tran_locks
WHERE resource_database_id = DB_ID('QL_CLBvaDoiNhom');
```

## Cài đặt

### Bước 1: Chạy SQL Scripts

1. Chạy file `backend/sql/QLCLB_Structures.sql` trong SQL Server Management Studio
2. Chạy file `backend/sql/QLCLB_Demo_Transaction_Locking.sql` để có thêm demo transaction và locking

Script sẽ:
1. Tạo tất cả các cấu trúc SQL
2. Cấp quyền cho Role_QLCLB
3. Thêm cột `SoLuongDoiNhom` vào bảng CLB (nếu chưa có)
4. Cập nhật giá trị ban đầu

### Bước 2: Khởi động Backend

```bash
cd backend
npm run dev
```

### Bước 3: Test trên UI

1. Đăng nhập với role **QLCLB** (`hai` / `123`)
2. Vào trang "Danh Sách CLB"
3. Click "📊 Thống Kê" để xem Procedure và Cursor
4. Vào chi tiết CLB để xem Function
5. Thêm CLB mới với checkbox Transaction để test Transaction

## Phân quyền

| Cấu trúc | Admin | QLCLB | HoTro | ThongKe |
|----------|-------|-------|-------|---------|
| Procedure (Thống kê) | ✅ | ✅ | ✅ | ✅ |
| Function (Số lượng) | ✅ | ✅ | ✅ | ✅ |
| Trigger (Auto update) | ✅ | ✅ | ✅ | ✅ |
| Cursor (Báo cáo) | ✅ | ✅ | ✅ | ✅ |
| Transaction (Tạo CLB) | ✅ | ✅ | ✅ | ❌ |

## Lưu ý

1. **Trigger tự động chạy**: Không cần gọi, tự động cập nhật khi thêm/xóa đội nhóm
2. **Transaction đảm bảo tính toàn vẹn**: Nếu một phần thất bại, toàn bộ sẽ rollback
3. **Function có thể dùng trong SELECT**: Có thể dùng trong các query khác
4. **Procedure trả về kết quả**: Có thể dùng trong ứng dụng hoặc SQL trực tiếp

## Troubleshooting

### Lỗi "Invalid object name"
- Đảm bảo đã chạy script `QLCLB_Structures.sql`
- Kiểm tra database name có đúng `QL_CLBvaDoiNhom` không

### Lỗi "Permission denied"
- Đảm bảo user có quyền EXECUTE trên các procedure
- Kiểm tra role có được gán đúng không

### Trigger không hoạt động
- Kiểm tra trigger có được tạo thành công không: `SELECT * FROM sys.triggers WHERE name = 'trg_QLCLB_UpdateSoLuongDoiNhom'`
- Kiểm tra cột `SoLuongDoiNhom` có tồn tại không

### Transaction rollback
- Kiểm tra dữ liệu đầu vào có hợp lệ không
- Kiểm tra constraint (PRIMARY KEY, FOREIGN KEY)
- Xem error message trong response

