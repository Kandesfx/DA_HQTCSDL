# HƯỚNG DẪN SỬA LỖI "KHÔNG CÓ QUYỀN TRUY CẬP HỆ THỐNG"

## Vấn đề

Khi đăng nhập với tài khoản SQL Server (ví dụ: `Hai`), hệ thống báo lỗi:
```
User không có quyền truy cập hệ thống
User "HaiUser" không được gán vào bất kỳ role nào
```

## Nguyên nhân

User chưa được gán vào database role tương ứng trong SQL Server.

## Cách sửa

### Bước 1: Kiểm tra quyền hiện tại

Chạy script SQL sau trong SQL Server Management Studio:

```sql
USE QL_CLBvaDoiNhom;
GO

-- Kiểm tra các user và role
SELECT 
    dp.name AS UserName,
    rp.name AS RoleName
FROM sys.database_role_members drm
JOIN sys.database_principals rp 
    ON drm.role_principal_id = rp.principal_id
JOIN sys.database_principals dp 
    ON drm.member_principal_id = dp.principal_id
WHERE dp.name IN ('NguyenUser', 'HaiUser', 'ThuanUser', 'ChiUser', 'VanUser')
ORDER BY dp.name, rp.name;
GO
```

### Bước 2: Sửa quyền tự động

Chạy script `backend/sql/check_user_roles.sql` trong SQL Server Management Studio:

1. Mở SQL Server Management Studio
2. Kết nối với database server
3. Mở file `backend/sql/check_user_roles.sql`
4. Chạy script (F5)

Script này sẽ:
- Kiểm tra quyền của tất cả user
- Tự động thêm user vào role nếu thiếu
- Hiển thị kết quả sau khi sửa

### Bước 3: Sửa quyền thủ công (nếu cần)

Nếu script tự động không chạy được, sửa thủ công:

```sql
USE QL_CLBvaDoiNhom;
GO

-- Thêm HaiUser vào Role_QLCLB
EXEC sp_addrolemember 'Role_QLCLB', 'HaiUser';
GO

-- Thêm ThuanUser vào Role_QLSuKien
EXEC sp_addrolemember 'Role_QLSuKien', 'ThuanUser';
GO

-- Thêm ChiUser vào Role_HoTro
EXEC sp_addrolemember 'Role_HoTro', 'ChiUser';
GO

-- Thêm VanUser vào Role_ThongKe
EXEC sp_addrolemember 'Role_ThongKe', 'VanUser';
GO

-- Kiểm tra lại
SELECT 
    dp.name AS UserName,
    rp.name AS RoleName
FROM sys.database_role_members drm
JOIN sys.database_principals rp 
    ON drm.role_principal_id = rp.principal_id
JOIN sys.database_principals dp 
    ON drm.member_principal_id = dp.principal_id
WHERE dp.name = 'HaiUser';
GO
```

## Mapping User - Role

| SQL Login | SQL User | Database Role | Application Role |
|-----------|----------|---------------|-----------------|
| Nguyen | NguyenUser | db_owner hoặc Role_Admin | Admin |
| Hai | HaiUser | Role_QLCLB | QLCLB |
| Thuan | ThuanUser | Role_QLSuKien | QLSuKien |
| Chi | ChiUser | Role_HoTro | HoTro |
| Van | VanUser | Role_ThongKe | ThongKe |

## Kiểm tra sau khi sửa

1. Đăng nhập lại với tài khoản SQL Server
2. Kiểm tra console log của backend để xem:
   - SQL User name có đúng không
   - Role có được lấy thành công không

Ví dụ log:
```
[Login] SQL User name: HaiUser
[getUserRole] Đang lấy role cho user: HaiUser
[getUserRole] Tìm thấy 1 role cho HaiUser
[getUserRole] Role database: Role_QLCLB
[getUserRole] Role mapped: QLCLB
[Login] Role: QLCLB
```

## Troubleshooting

### Lỗi "Cannot find the user"
- Kiểm tra user đã được tạo trong database chưa:
  ```sql
  SELECT name FROM sys.database_principals WHERE name = 'HaiUser';
  ```
- Nếu chưa có, tạo user:
  ```sql
  CREATE USER HaiUser FOR LOGIN Hai;
  ```

### Lỗi "Cannot find the role"
- Kiểm tra role đã được tạo chưa:
  ```sql
  SELECT name FROM sys.database_principals WHERE name = 'Role_QLCLB' AND type = 'R';
  ```
- Nếu chưa có, tạo role (xem trong QL_CLBvaDoiNhom.sql)

### Vẫn không hoạt động
1. Kiểm tra log backend để xem chi tiết lỗi
2. Thử đăng nhập với tài khoản khác (ví dụ: Nguyen)
3. Kiểm tra SQL Server có đang chạy không
4. Kiểm tra kết nối database trong .env

