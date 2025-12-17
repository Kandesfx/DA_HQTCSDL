# HƯỚNG DẪN TEST KẾT NỐI SQL SERVER

## Cách 1: Test cấu hình hiện tại (Chi tiết)

Chạy script test với cấu hình trong file `.env`:

```bash
cd backend
npm run test:connection
```

Hoặc:

```bash
node test-connection.js
```

Script này sẽ:
- ✅ Hiển thị cấu hình hiện tại
- ✅ Test kết nối
- ✅ Test query đơn giản
- ✅ Kiểm tra bảng SuKien và CLB có tồn tại không
- ✅ Đếm số lượng dữ liệu

## Cách 2: Test nhiều cấu hình khác nhau (Tự động)

Chạy script test tất cả các cấu hình có thể:

```bash
cd backend
npm run test:all
```

Hoặc:

```bash
node test-connection-simple.js
```

Script này sẽ test:
1. Cấu hình hiện tại trong `.env`
2. `localhost\SQLEXPRESS` với SQL Auth
3. `127.0.0.1\SQLEXPRESS` với SQL Auth
4. `localhost` (không có instance) với SQL Auth

## Kết quả mong đợi

### ✅ Thành công:
```
✅ KẾT NỐI THÀNH CÔNG!
✅ Query thành công!
✅ Bảng SuKien tồn tại
   Số lượng sự kiện: 5
✅ Bảng CLB tồn tại
   Số lượng CLB: 5
🎉 TẤT CẢ CÁC TEST ĐỀU THÀNH CÔNG!
```

### ❌ Thất bại:
```
❌ LỖI KẾT NỐI:
   Code: ETIMEOUT
   Message: Failed to connect to ...
   
💡 Gợi ý khắc phục:
   1. Kiểm tra SQL Server đang chạy
   2. Kiểm tra TCP/IP đã được bật
   ...
```

## Lưu ý

- Đảm bảo file `.env` đã được tạo trong thư mục `backend/`
- Nếu test tất cả cấu hình, script sẽ tự động tìm cấu hình nào hoạt động
- Nếu tất cả đều thất bại, kiểm tra lại SQL Server Configuration Manager

## Troubleshooting

### Nếu tất cả test đều thất bại:

1. **Kiểm tra SQL Server đang chạy:**
   - Mở Services (services.msc)
   - Tìm "SQL Server (SQLEXPRESS)" → phải là "Running"

2. **Kiểm tra TCP/IP:**
   - Mở SQL Server Configuration Manager
   - SQL Server Network Configuration → Protocols for SQLEXPRESS
   - TCP/IP phải là "Enabled"

3. **Kiểm tra cổng:**
   - Nhấp đúp TCP/IP → IP Addresses tab
   - IPAll → TCP Port = 1433

4. **Kiểm tra Authentication:**
   - SSMS → Server Properties → Security
   - Phải chọn "SQL Server and Windows Authentication mode"

5. **Kiểm tra Firewall:**
   - Windows Firewall có thể chặn cổng 1433
   - Thêm exception cho SQL Server

