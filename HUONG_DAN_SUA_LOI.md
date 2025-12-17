# HƯỚNG DẪN SỬA LỖI "Invalid column name 'Role' và 'SQLUser'"

## Nguyên nhân

Lỗi xảy ra vì bảng `AppUsers` trong database chưa có các cột `Role` và `SQLUser` mà code backend đang cố gắng truy vấn.

## Cách sửa

Có 3 cách để sửa lỗi này:

### Cách 1: Chạy script Node.js (Khuyến nghị - Tự động)

```bash
cd backend
npm run fix:appusers
```

Script này sẽ:
- Tự động kiểm tra các cột hiện có
- Thêm các cột còn thiếu
- Cập nhật dữ liệu cho các user
- Hiển thị kết quả

### Cách 2: Chạy SQL Script (Nhanh - Xóa và tạo lại)

1. Mở SQL Server Management Studio
2. Kết nối đến database `QL_CLBvaDoiNhom`
3. Mở file `backend/sql/fix_appusers_table.sql`
4. Chạy script (F5)

Script này sẽ xóa và tạo lại bảng `AppUsers` với đầy đủ cột.

### Cách 3: Chạy Migration Script (An toàn - Chỉ thêm cột)

1. Mở SQL Server Management Studio
2. Kết nối đến database `QL_CLBvaDoiNhom`
3. Mở file `backend/sql/migration_add_role_columns.sql`
4. Chạy script (F5)

Script này sẽ:
- Chỉ thêm các cột còn thiếu (không xóa dữ liệu)
- Cập nhật dữ liệu cho các user hiện có
- An toàn hơn nếu bạn đã có dữ liệu trong bảng

## Kiểm tra kết quả

Sau khi chạy script, kiểm tra bằng cách:

```sql
SELECT * FROM AppUsers;
```

Kết quả mong đợi:
- Có 5 cột: `UserId`, `Username`, `Password`, `Role`, `SQLUser`
- Có 5 dòng dữ liệu với các role tương ứng

## Sau khi sửa

1. Khởi động lại backend server:
```bash
cd backend
npm run dev
```

2. Thử đăng nhập lại từ frontend hoặc Postman

3. Nếu vẫn còn lỗi, kiểm tra:
   - Database connection string trong `.env`
   - Tên database có đúng là `QL_CLBvaDoiNhom` không
   - Có quyền ALTER TABLE không

## Lưu ý

- **Cách 1** (Node.js script) là cách dễ nhất và tự động nhất
- **Cách 2** (SQL script) nhanh nhưng sẽ xóa toàn bộ dữ liệu trong bảng AppUsers
- **Cách 3** (Migration script) an toàn nhất, giữ nguyên dữ liệu hiện có

## Troubleshooting

### Lỗi "Cannot connect to database"
- Kiểm tra file `.env` trong thư mục `backend`
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string

### Lỗi "Permission denied"
- Đảm bảo user có quyền ALTER TABLE
- Thử chạy với quyền sysadmin hoặc db_owner

### Vẫn còn lỗi sau khi chạy script
- Kiểm tra lại cấu trúc bảng: `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'AppUsers'`
- Xóa cache và khởi động lại server
- Kiểm tra log trong console để xem lỗi chi tiết

