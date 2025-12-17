# HƯỚNG DẪN CHẠY DEMO TRANSACTION

## Tổng quan

Demo Transaction minh họa cách sử dụng **BEGIN TRAN**, **COMMIT TRAN**, và **ROLLBACK TRAN** trong SQL Server để đảm bảo tính toàn vẹn dữ liệu.

## Procedure: `sp_QLCLB_DemoTransaction`

### Chức năng
Cập nhật thông tin CLB và tất cả đội nhóm của CLB đó trong một transaction duy nhất. Nếu có lỗi ở bất kỳ bước nào, toàn bộ transaction sẽ được **ROLLBACK**.

### Transaction Flow

1. **BEGIN TRAN** - Bắt đầu transaction
2. Cập nhật thông tin CLB (tên, mô tả)
3. Cập nhật mô tả cho tất cả đội nhóm của CLB
4. Kiểm tra tính hợp lệ dữ liệu
5. **COMMIT TRAN** - Nếu tất cả thành công
6. **ROLLBACK TRAN** - Nếu có lỗi ở bất kỳ bước nào

## Cách 1: Chạy qua UI (Khuyến nghị)

### Bước 1: Đăng nhập
- Đăng nhập với tài khoản có quyền **QLCLB** hoặc **Admin**
  - Ví dụ: `Hai` / `Hai@123` (QLCLB)
  - Hoặc: `Nguyen` / `Nguyen@123` (Admin)

### Bước 2: Truy cập trang Demo Transaction

**Cách A: Từ Danh Sách CLB**
1. Vào trang "Danh Sách CLB" (`/`)
2. Click nút **"🔄 Demo Transaction"** (màu vàng) ở góc trên bên phải

**Cách B: Truy cập trực tiếp**
- URL: `http://localhost:3000/clb/demo-transaction`
- Hoặc click vào link trong menu (nếu có)

### Bước 3: Điền thông tin

Form sẽ có các trường:

1. **Mã CLB** (bắt buộc) *
   - Nhập mã CLB muốn cập nhật
   - Ví dụ: `CLB01`, `CLB02`, `CLB03`
   - Tự động chuyển sang chữ hoa

2. **Tên CLB Mới** (tùy chọn)
   - Nhập tên mới cho CLB
   - Để trống nếu không muốn đổi tên
   - Ví dụ: `CLB Đã Cập Nhật`

3. **Mô tả Mới** (tùy chọn)
   - Nhập mô tả mới cho CLB
   - Để trống nếu không muốn đổi mô tả
   - Ví dụ: `Mô tả mới sau khi cập nhật`

### Bước 4: Chạy Transaction

1. Click nút **"Chạy Demo Transaction"**
2. Đợi xử lý (sẽ hiển thị "Đang xử lý transaction...")
3. Xem kết quả:

**Nếu thành công:**
- Hiển thị hộp màu xanh: **"✓ Transaction thành công!"**
- Thông tin:
  - Status: `Success`
  - Message: `Cập nhật thành công`
  - Số lượng đội nhóm đã cập nhật: `X`

**Nếu có lỗi (Rollback):**
- Hiển thị hộp màu đỏ: **"✗ Transaction đã rollback!"**
- Thông tin:
  - Status: `Error`
  - Message: Chi tiết lỗi (ví dụ: "Không tìm thấy CLB với mã: CLB99")

### Ví dụ Demo

#### Ví dụ 1: Transaction thành công
```
Mã CLB: CLB01
Tên CLB Mới: CLB Đã Cập Nhật
Mô tả Mới: Mô tả mới sau khi cập nhật
```
→ **Kết quả:** Success, tất cả thay đổi đã được COMMIT

#### Ví dụ 2: Transaction rollback (CLB không tồn tại)
```
Mã CLB: CLB99
Tên CLB Mới: CLB Không Tồn Tại
```
→ **Kết quả:** Error, transaction đã ROLLBACK vì không tìm thấy CLB

## Cách 2: Chạy qua SQL Server Management Studio

### Bước 1: Mở SQL Server Management Studio
- Kết nối với database `QL_CLBvaDoiNhom`
- Đảm bảo đã chạy script `QLCLB_Demo_Transaction_Locking.sql` để tạo procedure

### Bước 2: Chạy Procedure

**Cú pháp:**
```sql
EXEC sp_QLCLB_DemoTransaction 
    @MaCLB = 'CLB01',
    @TenCLBMoi = N'CLB Đã Cập Nhật',
    @MoTaMoi = N'Mô tả mới';
```

**Ví dụ:**
```sql
-- Cập nhật cả tên và mô tả
EXEC sp_QLCLB_DemoTransaction 
    @MaCLB = 'CLB01',
    @TenCLBMoi = N'CLB Đã Cập Nhật',
    @MoTaMoi = N'Mô tả mới sau khi cập nhật';

-- Chỉ cập nhật tên
EXEC sp_QLCLB_DemoTransaction 
    @MaCLB = 'CLB02',
    @TenCLBMoi = N'CLB Mới';

-- Chỉ cập nhật mô tả
EXEC sp_QLCLB_DemoTransaction 
    @MaCLB = 'CLB03',
    @MoTaMoi = N'Chỉ cập nhật mô tả';
```

### Bước 3: Xem kết quả

**Trong Messages tab:**
```
=== DEMO TRANSACTION ===
Bắt đầu transaction với BEGIN TRAN
Bước 1: Cập nhật thông tin CLB...
✓ Cập nhật CLB thành công
Bước 2: Cập nhật mô tả cho tất cả đội nhóm...
✓ Cập nhật 3 đội nhóm thành công
✓ Tất cả các bước thành công
Thực hiện COMMIT TRAN...
✓ Transaction đã được COMMIT thành công
```

**Trong Results tab:**
```
Status    | Message              | MaCLB | SoLuongDoiNhom
----------|----------------------|-------|----------------
Success   | Cập nhật thành công | CLB01 | 3
```

## Cách 3: Chạy qua API

### Endpoint
```
POST /api/clb/demo-transaction
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body
```json
{
  "MaCLB": "CLB01",
  "TenCLBMoi": "CLB Đã Cập Nhật",
  "MoTaMoi": "Mô tả mới"
}
```

### Response (Success)
```json
{
  "Status": "Success",
  "Message": "Cập nhật thành công",
  "MaCLB": "CLB01",
  "SoLuongDoiNhom": 3
}
```

### Response (Error)
```json
{
  "Status": "Error",
  "Message": "Không tìm thấy CLB với mã: CLB99",
  "MaCLB": "CLB99"
}
```

### Ví dụ với cURL
```bash
curl -X POST http://localhost:5000/api/clb/demo-transaction \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "MaCLB": "CLB01",
    "TenCLBMoi": "CLB Đã Cập Nhật",
    "MoTaMoi": "Mô tả mới"
  }'
```

## Kiểm tra kết quả

### Sau khi transaction thành công

1. **Kiểm tra CLB đã được cập nhật:**
```sql
SELECT MaCLB, TenCLB, MoTa 
FROM CLB 
WHERE MaCLB = 'CLB01';
```

2. **Kiểm tra đội nhóm đã được cập nhật:**
```sql
SELECT MaDoi, TenDoi, MoTa 
FROM DoiNhom 
WHERE MaCLB = 'CLB01';
```
→ Mô tả của tất cả đội nhóm sẽ có dạng: `Đã được cập nhật bởi transaction - 2025-12-17 11:30:00`

### Sau khi transaction rollback

1. **Kiểm tra dữ liệu không thay đổi:**
```sql
SELECT MaCLB, TenCLB, MoTa 
FROM CLB 
WHERE MaCLB = 'CLB01';
```
→ Dữ liệu vẫn giữ nguyên như trước khi chạy transaction

## Các trường hợp test

### Test 1: Transaction thành công
- Mã CLB hợp lệ (ví dụ: `CLB01`)
- CLB có ít nhất 1 đội nhóm
- Tất cả dữ liệu hợp lệ
→ **Kết quả:** COMMIT, dữ liệu được cập nhật

### Test 2: CLB không tồn tại
- Mã CLB không tồn tại (ví dụ: `CLB99`)
→ **Kết quả:** ROLLBACK, báo lỗi "Không tìm thấy CLB"

### Test 3: CLB không có đội nhóm
- Mã CLB hợp lệ nhưng không có đội nhóm
→ **Kết quả:** COMMIT, CLB được cập nhật, không có đội nhóm nào được cập nhật

### Test 4: Dữ liệu không hợp lệ
- Nếu có validation check (ví dụ: số lượng đội nhóm < 0)
→ **Kết quả:** ROLLBACK, báo lỗi validation

## Lưu ý quan trọng

1. **Transaction đảm bảo tính toàn vẹn:**
   - Nếu có lỗi ở bất kỳ bước nào, **TẤT CẢ** thay đổi sẽ được ROLLBACK
   - Không có trường hợp "một phần thành công"

2. **Quyền truy cập:**
   - Cần quyền **QLCLB** hoặc **Admin** để chạy demo
   - User **ThongKe** và **HoTro** không thể chạy (chỉ xem)

3. **Dữ liệu test:**
   - Đảm bảo có ít nhất 1 CLB trong database
   - Nên test với CLB có nhiều đội nhóm để thấy rõ hiệu ứng

4. **Logging:**
   - Xem console log của backend để thấy chi tiết từng bước
   - Xem Messages tab trong SSMS để thấy PRINT statements

## Troubleshooting

### Lỗi "Không có quyền"
- Đảm bảo đã đăng nhập với role **QLCLB** hoặc **Admin**
- Kiểm tra JWT token còn hợp lệ không

### Lỗi "Procedure không tồn tại"
- Chạy script `backend/sql/QLCLB_Demo_Transaction_Locking.sql` để tạo procedure
- Đảm bảo đang ở database `QL_CLBvaDoiNhom`

### Lỗi "Không tìm thấy CLB"
- Kiểm tra mã CLB có đúng không
- Kiểm tra CLB có tồn tại trong database không:
  ```sql
  SELECT * FROM CLB WHERE MaCLB = 'CLB01';
  ```

### Transaction không rollback
- Kiểm tra có lỗi trong procedure không
- Xem log backend để biết chi tiết

## Tóm tắt

✅ **Cách nhanh nhất:** Vào UI → Click "🔄 Demo Transaction" → Điền form → Click "Chạy Demo Transaction"

✅ **Để hiểu rõ hơn:** Chạy qua SQL Server Management Studio và xem Messages tab

✅ **Để tích hợp:** Sử dụng API endpoint `/api/clb/demo-transaction`

