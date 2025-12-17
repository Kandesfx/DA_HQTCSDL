# HƯỚNG DẪN ĐĂNG NHẬP BẰNG SQL SERVER LOGIN

## Thay đổi

Hệ thống đã được cập nhật để đăng nhập trực tiếp bằng **SQL Server Login** thay vì bảng AppUsers.

## Cách hoạt động

1. User nhập **SQL Server login name** và **password**
2. Backend thử kết nối trực tiếp với SQL Server bằng thông tin đó
3. Nếu kết nối thành công → Lấy role từ database
4. Tạo JWT token và trả về cho client

## Thông tin đăng nhập

Sử dụng **SQL Server Login** đã được tạo trong database:

| Vai trò | SQL Login Name | Password | SQL User | Role |
|---------|---------------|----------|----------|------|
| Admin | `Nguyen` | `Nguyen@123` | NguyenUser | Admin |
| QLCLB | `Hai` | `Hai@123` | HaiUser | QLCLB |
| QLSuKien | `Thuan` | `Thuan@123` | ThuanUser | QLSuKien |
| HoTro | `Chi` | `Chi@123` | ChiUser | HoTro |
| ThongKe | `Van` | `Van@123` | VanUser | ThongKe |

## Cách sử dụng

### Trên UI

1. Mở trang đăng nhập
2. Nhập **SQL Login Name** (ví dụ: `Hai`)
3. Nhập **Password** (ví dụ: `Hai@123`)
4. Click "Đăng Nhập"

### API

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "Hai",
  "password": "Hai@123"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "Hai",
    "sqlUser": "HaiUser",
    "role": "QLCLB"
  }
}
```

## Lưu ý quan trọng

1. **Không cần bảng AppUsers nữa** - Hệ thống tự động lấy role từ database roles
2. **Username là SQL Login Name** - Không phải username trong AppUsers
3. **Password là SQL Server Password** - Password của SQL Server login
4. **Role được lấy tự động** - Từ `sys.database_role_members` trong database

## Cấu hình Database

Đảm bảo các SQL Server Login đã được tạo:

```sql
-- Trong master database
CREATE LOGIN Nguyen WITH PASSWORD = 'Nguyen@123', CHECK_POLICY = ON;
CREATE LOGIN Hai    WITH PASSWORD = 'Hai@123',    CHECK_POLICY = ON;
CREATE LOGIN Thuan  WITH PASSWORD = 'Thuan@123',  CHECK_POLICY = ON;
CREATE LOGIN Chi    WITH PASSWORD = 'Chi@123',    CHECK_POLICY = ON;
CREATE LOGIN Van    WITH PASSWORD = 'Van@123',    CHECK_POLICY = ON;
```

Và các User đã được tạo trong database `QL_CLBvaDoiNhom`:

```sql
-- Trong QL_CLBvaDoiNhom database
CREATE USER NguyenUser FOR LOGIN Nguyen;
CREATE USER HaiUser    FOR LOGIN Hai;
CREATE USER ThuanUser  FOR LOGIN Thuan;
CREATE USER ChiUser    FOR LOGIN Chi;
CREATE USER VanUser    FOR LOGIN Van;
```

Và đã được gán vào các role:

```sql
EXEC sp_addrolemember 'Role_QLCLB', 'HaiUser';
EXEC sp_addrolemember 'Role_QLSuKien', 'ThuanUser';
EXEC sp_addrolemember 'Role_HoTro', 'ChiUser';
EXEC sp_addrolemember 'Role_ThongKe', 'VanUser';
-- Admin có db_owner hoặc Role_Admin
```

## Troubleshooting

### Lỗi "Tên đăng nhập hoặc mật khẩu không đúng"
- Kiểm tra SQL Login name có đúng không (phân biệt hoa thường)
- Kiểm tra password có đúng không
- Kiểm tra SQL Server có đang chạy không
- Kiểm tra SQL Server có cho phép SQL Authentication không

### Lỗi "User không có quyền truy cập hệ thống"
- User chưa được gán vào bất kỳ role nào
- Kiểm tra trong SQL Server Management Studio:
  ```sql
  SELECT dp.name AS UserName, rp.name AS RoleName
  FROM sys.database_role_members drm
  JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
  JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
  WHERE dp.name = 'HaiUser';  -- Thay bằng user name của bạn
  ```

### Lỗi "Cannot connect to database"
- Kiểm tra DB_SERVER trong .env có đúng không
- Kiểm tra SQL Server có cho phép remote connections không
- Kiểm tra firewall

## Ưu điểm

1. **Bảo mật hơn** - Sử dụng SQL Server authentication trực tiếp
2. **Đơn giản hơn** - Không cần quản lý bảng AppUsers
3. **Đồng bộ với database** - Role được lấy trực tiếp từ database roles
4. **Phù hợp với LAN** - Dễ dàng kết nối đến database của người khác

