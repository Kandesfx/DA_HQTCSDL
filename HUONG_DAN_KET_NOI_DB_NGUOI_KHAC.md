# Hướng Dẫn Kết Nối Tới Database Của Người Khác

## Vấn Đề

Khi kết nối tới database của người khác, user chỉ có quyền CRUD trên 2 bảng và quyền sử dụng 5 cấu trúc (procedure/function/trigger/cursor/transaction) của chính mình. Khi đăng nhập, hệ thống không tìm thấy role và trả về lỗi "không có quyền truy cập hệ thống".

## Nguyên Nhân

Hệ thống xác định role của user theo thứ tự ưu tiên:
1. **IS_MEMBER()** - Kiểm tra user có trong role nào không (cách an toàn nhất)
2. **Bảng AppUsers** - Lấy role từ bảng mapping (nếu có quyền đọc)
3. **sys.database_role_members** - Query system tables (yêu cầu quyền đọc system tables)
4. **Suy luận từ quyền trực tiếp** - Kiểm tra quyền trên các đối tượng cụ thể

Nếu user không được gán vào role cụ thể (như `Role_QLCLB`), hệ thống sẽ không tìm thấy role.

## Giải Pháp

### Cách 1: Admin Gán User Vào Role (Khuyến Nghị)

Admin của database cần gán user vào role tương ứng:

```sql
-- Ví dụ: Gán user "HaiUser" vào role "Role_QLCLB"
ALTER ROLE Role_QLCLB ADD MEMBER HaiUser;
```

Sau đó, hệ thống sẽ tự động nhận diện role qua `IS_MEMBER()`.

### Cách 2: Tạo Bảng Mapping Trong Database

Nếu không thể gán role, admin có thể tạo bảng mapping:

```sql
-- Tạo bảng mapping (nếu chưa có)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AppUsers')
BEGIN
    CREATE TABLE AppUsers (
        Username NVARCHAR(50) PRIMARY KEY,
        SQLUser NVARCHAR(50) NOT NULL,
        Role NVARCHAR(50) NOT NULL
    );
END

-- Thêm mapping cho user
INSERT INTO AppUsers (Username, SQLUser, Role)
VALUES ('Hai', 'HaiUser', 'QLCLB')
ON DUPLICATE KEY UPDATE Role = 'QLCLB';
```

Sau đó, cấp quyền SELECT cho user:

```sql
GRANT SELECT ON AppUsers TO HaiUser;
```

### Cách 3: Sử Dụng Quyền Trực Tiếp (Tự Động)

Hệ thống sẽ tự động suy luận role dựa trên quyền trực tiếp trên các đối tượng:
- Nếu có quyền đầy đủ (SELECT/INSERT/UPDATE/DELETE) trên bảng `CLB` và `DoiNhom` → Role: `QLCLB`
- Nếu có quyền đầy đủ trên bảng `SuKien` → Role: `QLSuKien`

**Lưu ý**: Cách này chỉ hoạt động nếu user có quyền sử dụng `HAS_PERMS_BY_NAME()`.

## Kiểm Tra Role Hiện Tại

Để kiểm tra user có role nào, chạy query sau (với quyền của chính user đó):

```sql
-- Kiểm tra role bằng IS_MEMBER()
SELECT 
    IS_MEMBER('Role_Admin') AS IsAdmin,
    IS_MEMBER('Role_QLCLB') AS IsQLCLB,
    IS_MEMBER('Role_QLSuKien') AS IsQLSuKien,
    IS_MEMBER('Role_HoTro') AS IsHoTro,
    IS_MEMBER('Role_ThongKe') AS IsThongKe,
    IS_MEMBER('db_owner') AS IsDbOwner;

-- Kiểm tra quyền trên các bảng
SELECT 
    HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'SELECT') AS CLB_Select,
    HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'INSERT') AS CLB_Insert,
    HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'UPDATE') AS CLB_Update,
    HAS_PERMS_BY_NAME('dbo.CLB', 'OBJECT', 'DELETE') AS CLB_Delete,
    HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'SELECT') AS DoiNhom_Select,
    HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'INSERT') AS DoiNhom_Insert,
    HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'UPDATE') AS DoiNhom_Update,
    HAS_PERMS_BY_NAME('dbo.DoiNhom', 'OBJECT', 'DELETE') AS DoiNhom_Delete;
```

## Debug

Nếu vẫn gặp vấn đề, kiểm tra log trong backend:

```bash
# Xem log khi đăng nhập
# Log sẽ hiển thị:
# [getUserRole] Đang lấy role cho user: HaiUser
# [getUserRole] Tìm thấy role bằng IS_MEMBER('Role_QLCLB'): QLCLB
# [Login] Role: QLCLB
```

Nếu log hiển thị "Không tìm thấy role", có nghĩa là:
- User chưa được gán vào role
- User không có quyền đọc bảng AppUsers
- User không có quyền sử dụng HAS_PERMS_BY_NAME()

## Khuyến Nghị

**Cách tốt nhất**: Yêu cầu admin của database gán user vào role tương ứng bằng lệnh `ALTER ROLE`. Đây là cách chuẩn và an toàn nhất.

