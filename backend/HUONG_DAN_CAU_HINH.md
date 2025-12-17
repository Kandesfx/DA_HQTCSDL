# HƯỚNG DẪN CẤU HÌNH DATABASE

## Thông tin SQL Server của bạn:

- **Server name**: `2E6B64B1A9C3931\SQLEXPRESS`
- **Authentication**: Windows Authentication
- **Encryption**: Mandatory
- **Trust server certificate**: ✓ Checked

## Cách cấu hình:

### Bước 1: Tạo file `.env`

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
# SQL Server Configuration
DB_SERVER=2E6B64B1A9C3931\SQLEXPRESS
DB_DATABASE=QL_CLBvaDoiNhom

# Windows Authentication - để trống user và password
DB_USER=
DB_PASSWORD=

DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true
DB_USE_WINDOWS_AUTH=true

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Bước 2: Kiểm tra kết nối

Chạy backend và kiểm tra xem có kết nối được không:

```bash
cd backend
npm run dev
```

Nếu thấy dòng "Đã kết nối SQL Server thành công!" thì đã cấu hình đúng.

### Lưu ý về Windows Authentication:

Nếu gặp lỗi với Windows Authentication, bạn có thể:

1. **Cài đặt package hỗ trợ Windows Auth** (nếu cần):
```bash
npm install mssql/msnodesqlv8
```

2. **Hoặc chuyển sang SQL Server Authentication**:
   - Trong SQL Server Management Studio, tạo login mới
   - Cập nhật `.env`:
   ```env
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_USE_WINDOWS_AUTH=false
   ```

### Troubleshooting:

- **Lỗi "Login failed"**: Kiểm tra lại server name và đảm bảo SQL Server đang chạy
- **Lỗi "Cannot connect"**: Kiểm tra firewall và đảm bảo SQL Server cho phép kết nối từ xa
- **Lỗi "Encryption"**: Đảm bảo `DB_TRUST_CERTIFICATE=true` khi dùng encryption

