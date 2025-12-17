# HƯỚNG DẪN HỆ THỐNG PHÂN QUYỀN

## Tổng quan

Hệ thống đã được tích hợp phân quyền dựa trên role với các chức năng:
- Đăng nhập với username/password
- JWT token để xác thực
- Middleware kiểm tra quyền dựa trên role
- Phân quyền chi tiết cho từng endpoint

## Các Role và Quyền hạn

### 1. Admin (Nguyen)
- **Quyền**: Toàn quyền hệ thống
- **Username**: `admin`
- **Password**: `123456`
- **SQL User**: `NguyenUser` (db_owner)

### 2. QLCLB - Quản lý CLB (Hai)
- **Quyền**: 
  - CRUD bảng CLB
  - CRUD bảng DoiNhom
- **Username**: `hai`
- **Password**: `123`
- **SQL User**: `HaiUser` (Role_QLCLB)

### 3. QLSuKien - Quản lý Sự kiện (Thuận)
- **Quyền**: 
  - CRUD bảng SuKien
- **Username**: `thuan`
- **Password**: `123`
- **SQL User**: `ThuanUser` (Role_QLSuKien)

### 4. HoTro - Hỗ trợ (Chi)
- **Quyền**: 
  - SELECT, INSERT, UPDATE bảng CLB
  - SELECT, INSERT, UPDATE bảng DoiNhom
  - SELECT bảng SuKien (chỉ đọc)
- **Username**: `chi`
- **Password**: `123`
- **SQL User**: `ChiUser` (Role_HoTro)

### 5. ThongKe - Thống kê (Van)
- **Quyền**: 
  - SELECT tất cả bảng (chỉ đọc)
  - VIEW DEFINITION (xem cấu trúc bảng)
- **Username**: `van`
- **Password**: `123`
- **SQL User**: `VanUser` (Role_ThongKe)

## Cài đặt Database

### Bước 1: Chạy SQL Script

Chạy file `QL_CLBvaDoiNhom.sql` trong SQL Server Management Studio. Script sẽ:
1. Tạo bảng `AppUsers` để quản lý đăng nhập ứng dụng
2. Tạo các LOGIN ở master database
3. Tạo các USER trong database QL_CLBvaDoiNhom
4. Tạo các ROLE
5. Gán quyền cho từng ROLE
6. Thêm USER vào ROLE tương ứng

### Bước 2: Kiểm tra phân quyền

Chạy query sau để kiểm tra:

```sql
USE QL_CLBvaDoiNhom;
GO

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
```

## Sử dụng API

### 1. Đăng nhập

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "hai",
  "password": "123"
}
```

**Response**:
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 2,
    "username": "hai",
    "role": "QLCLB"
  }
}
```

### 2. Sử dụng Token

Sau khi đăng nhập, lưu token và gửi kèm trong header của mọi request:

```
Authorization: Bearer <token>
```

### 3. Kiểm tra thông tin user hiện tại

**Endpoint**: `GET /api/auth/me`

**Headers**: 
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "userId": 2,
  "username": "hai",
  "role": "QLCLB"
}
```

### 4. Đăng xuất

**Endpoint**: `POST /api/auth/logout`

Chỉ cần xóa token ở phía client.

## Phân quyền các Endpoint

### CLB (Câu lạc bộ)

| Method | Endpoint | Admin | QLCLB | HoTro | ThongKe | QLSuKien |
|--------|----------|-------|-------|-------|---------|----------|
| GET | `/api/clb` | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET | `/api/clb/:MaCLB` | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST | `/api/clb` | ✅ | ✅ | ✅ | ❌ | ❌ |
| PUT | `/api/clb/:MaCLB` | ✅ | ✅ | ✅ | ❌ | ❌ |
| DELETE | `/api/clb/:MaCLB` | ✅ | ✅ | ❌ | ❌ | ❌ |

### Đội nhóm

| Method | Endpoint | Admin | QLCLB | HoTro | ThongKe | QLSuKien |
|--------|----------|-------|-------|-------|---------|----------|
| GET | `/api/doinhom` | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET | `/api/doinhom/:MaDoi` | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST | `/api/doinhom` | ✅ | ✅ | ✅ | ❌ | ❌ |
| PUT | `/api/doinhom/:MaDoi` | ✅ | ✅ | ✅ | ❌ | ❌ |
| DELETE | `/api/doinhom/:MaDoi` | ✅ | ✅ | ❌ | ❌ | ❌ |

### Sự kiện

| Method | Endpoint | Admin | QLSuKien | HoTro | ThongKe | QLCLB |
|--------|----------|--------|----------|-------|---------|-------|
| GET | `/api/sukien` | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET | `/api/sukien/:MaSK` | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST | `/api/sukien` | ✅ | ✅ | ❌ | ❌ | ❌ |
| PUT | `/api/sukien/:MaSK` | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELETE | `/api/sukien/:MaSK` | ✅ | ✅ | ❌ | ❌ | ❌ |

## Cấu hình Backend

### File `.env`

Thêm vào file `.env` trong thư mục `backend`:

```env
JWT_SECRET=your-secret-key-change-in-production
```

**Lưu ý**: Thay đổi `JWT_SECRET` thành một chuỗi ngẫu nhiên mạnh trong môi trường production.

## Các vấn đề đã được sửa

### 1. SQL Script
- ✅ Đã thêm bước tạo USER trong database QL_CLBvaDoiNhom
- ✅ Đã tạo các ROLE trước khi gán quyền
- ✅ Đã sửa thứ tự: Login → User → Role → Grant → Add Member
- ✅ Đã cập nhật bảng AppUsers với cột Role và SQLUser

### 2. Backend
- ✅ Đã tạo authentication system với JWT
- ✅ Đã tạo middleware kiểm tra quyền
- ✅ Đã tích hợp middleware vào tất cả routes
- ✅ Đã phân quyền chi tiết cho từng endpoint

## Testing

### Test với Postman hoặc curl

1. **Đăng nhập**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hai","password":"123"}'
```

2. **Lấy danh sách CLB** (với token):
```bash
curl -X GET http://localhost:5000/api/clb \
  -H "Authorization: Bearer <token>"
```

3. **Tạo CLB mới** (với token):
```bash
curl -X POST http://localhost:5000/api/clb \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"MaCLB":"CLB01","TenCLB":"CLB Test"}'
```

## Lưu ý

1. **Bảo mật**: 
   - Trong production, nên hash password bằng bcrypt
   - Sử dụng HTTPS
   - Đặt JWT_SECRET mạnh và bảo mật

2. **SQL Server Permissions**:
   - Các quyền đã được gán ở database level
   - Khi kết nối trực tiếp với SQL Server bằng user cụ thể, quyền sẽ được áp dụng
   - Trong ứng dụng web, quyền được kiểm tra ở application level

3. **Token Expiry**:
   - Token hiện tại có thời hạn 24 giờ
   - Có thể điều chỉnh trong file `backend/routes/auth.js`

## Troubleshooting

### Lỗi "Token không hợp lệ"
- Kiểm tra xem token có được gửi đúng format: `Bearer <token>`
- Kiểm tra token có hết hạn chưa

### Lỗi "Bạn không có quyền thực hiện thao tác này"
- Kiểm tra role của user đang đăng nhập
- Xem bảng phân quyền ở trên

### Lỗi SQL khi chạy script
- Đảm bảo đang chạy với quyền sysadmin hoặc có quyền tạo login/user
- Kiểm tra database QL_CLBvaDoiNhom đã tồn tại chưa
- Xóa các login/user/role cũ nếu đã tồn tại

