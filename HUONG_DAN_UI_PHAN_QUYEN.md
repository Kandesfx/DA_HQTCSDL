# HƯỚNG DẪN SỬ DỤNG UI VỚI PHÂN QUYỀN

## Tổng quan

UI đã được tích hợp đầy đủ hệ thống phân quyền với:
- Trang đăng nhập
- Protected routes (bảo vệ các trang)
- Hiển thị/ẩn các nút dựa trên quyền
- Header hiển thị thông tin user và nút đăng xuất
- Tự động redirect khi chưa đăng nhập

## Các tính năng đã triển khai

### 1. Authentication Context (`contexts/AuthContext.js`)
- Quản lý state đăng nhập
- Lưu token và user info vào localStorage
- Tự động kiểm tra token khi app khởi động
- Cung cấp các hàm: `login`, `logout`, `isAuthenticated`

### 2. Trang Đăng nhập (`pages/Login.js`)
- Form đăng nhập với username/password
- Hiển thị thông tin đăng nhập mẫu
- Tự động redirect sau khi đăng nhập thành công
- Hiển thị lỗi nếu đăng nhập thất bại

### 3. Protected Route (`components/ProtectedRoute.js`)
- Bảo vệ các route cần đăng nhập
- Kiểm tra quyền truy cập dựa trên role
- Tự động redirect đến trang login nếu chưa đăng nhập
- Hiển thị thông báo nếu không có quyền

### 4. Header (`components/Header.js`)
- Hiển thị thông tin user (username và role)
- Nút đăng xuất
- Ẩn header nếu chưa đăng nhập
- Ẩn nút "Thêm CLB" nếu không có quyền

### 5. API Service (`services/api.js`)
- Tự động thêm token vào mọi request
- Tự động xử lý lỗi 401 (unauthorized)
- Tự động redirect đến login nếu token hết hạn

### 6. Các trang đã cập nhật
- **DanhSachCLB**: Ẩn/hiện nút Thêm, Sửa, Xóa dựa trên quyền
- **ChiTietCLB**: Ẩn/hiện nút Sửa CLB, Thêm/Sửa/Xóa đội nhóm dựa trên quyền

## Cách sử dụng

### Bước 1: Khởi động ứng dụng

```bash
cd frontend
npm start
```

### Bước 2: Đăng nhập

1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Tự động redirect đến trang `/login`
3. Nhập thông tin đăng nhập:
   - **Admin**: `admin` / `123456`
   - **QLCLB**: `hai` / `123`
   - **QLSuKien**: `thuan` / `123`
   - **HoTro**: `chi` / `123`
   - **ThongKe**: `van` / `123`

### Bước 3: Sử dụng ứng dụng

Sau khi đăng nhập, bạn sẽ thấy:
- Header hiển thị username và role
- Các nút và chức năng được hiển thị/ẩn dựa trên quyền của bạn
- Token được lưu tự động và sử dụng cho mọi request

## Phân quyền UI

### Admin
- ✅ Xem tất cả
- ✅ Thêm/Sửa/Xóa CLB
- ✅ Thêm/Sửa/Xóa Đội nhóm
- ✅ Thêm/Sửa/Xóa Sự kiện

### QLCLB (Quản lý CLB)
- ✅ Xem CLB và Đội nhóm
- ✅ Thêm/Sửa/Xóa CLB
- ✅ Thêm/Sửa/Xóa Đội nhóm
- ❌ Không thể quản lý Sự kiện

### QLSuKien (Quản lý Sự kiện)
- ✅ Xem Sự kiện
- ✅ Thêm/Sửa/Xóa Sự kiện
- ❌ Không thể quản lý CLB và Đội nhóm

### HoTro (Hỗ trợ)
- ✅ Xem CLB và Đội nhóm
- ✅ Thêm/Sửa CLB (không xóa)
- ✅ Thêm/Sửa Đội nhóm (không xóa)
- ✅ Xem Sự kiện (chỉ đọc)

### ThongKe (Thống kê)
- ✅ Xem CLB (chỉ đọc)
- ✅ Xem Đội nhóm (chỉ đọc)
- ✅ Xem Sự kiện (chỉ đọc)
- ❌ Không thể thêm/sửa/xóa

## Cấu trúc file

```
frontend/src/
├── contexts/
│   └── AuthContext.js          # Context quản lý authentication
├── components/
│   ├── Header.js               # Header với user info
│   ├── Header.css
│   └── ProtectedRoute.js       # Component bảo vệ routes
├── pages/
│   ├── Login.js                # Trang đăng nhập
│   ├── Login.css
│   ├── DanhSachCLB.js          # Đã cập nhật với phân quyền
│   └── ChiTietCLB.js           # Đã cập nhật với phân quyền
├── services/
│   └── api.js                  # API service với token interceptor
└── App.js                      # Đã cập nhật với AuthProvider và ProtectedRoute
```

## Các tính năng bảo mật

1. **Token Storage**: Token được lưu trong localStorage
2. **Auto Logout**: Tự động đăng xuất nếu token hết hạn
3. **Route Protection**: Tất cả routes được bảo vệ
4. **Permission Check**: Kiểm tra quyền ở cả client và server
5. **UI Permissions**: Ẩn các nút không có quyền

## Xử lý lỗi

### Token hết hạn
- Tự động xóa token và redirect đến login
- Hiển thị thông báo lỗi nếu có

### Không có quyền
- Hiển thị trang "Không có quyền truy cập"
- Hiển thị role hiện tại và role yêu cầu

### Lỗi đăng nhập
- Hiển thị toast error với thông báo lỗi
- Không redirect nếu đăng nhập thất bại

## Testing

### Test với các role khác nhau

1. **Đăng nhập với role ThongKe**:
   - Chỉ thấy nút "Xem"
   - Không thấy nút "Thêm", "Sửa", "Xóa"

2. **Đăng nhập với role QLCLB**:
   - Thấy đầy đủ nút cho CLB và Đội nhóm
   - Không thấy menu/quản lý Sự kiện

3. **Đăng nhập với role Admin**:
   - Thấy tất cả các nút và chức năng

## Lưu ý

1. **Token Expiry**: Token có thời hạn 24 giờ (có thể điều chỉnh trong backend)
2. **Refresh Token**: Hiện tại chưa có refresh token, cần đăng nhập lại khi token hết hạn
3. **Password Security**: Password hiện tại lưu plain text, nên hash trong production
4. **HTTPS**: Nên sử dụng HTTPS trong production để bảo mật token

## Troubleshooting

### Không thể đăng nhập
- Kiểm tra backend có đang chạy không
- Kiểm tra API endpoint trong `.env`
- Kiểm tra console để xem lỗi

### Token không được gửi
- Kiểm tra localStorage có token không
- Kiểm tra interceptor trong `api.js`

### Redirect loop
- Xóa localStorage và thử lại
- Kiểm tra logic trong `ProtectedRoute`

