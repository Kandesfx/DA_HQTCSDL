# HỆ THỐNG QUẢN LÝ SỰ KIỆN CLB

Hệ thống quản lý sự kiện cho Câu lạc bộ và Đội nhóm trong trường học, được xây dựng bằng React và Node.js/Express với SQL Server.

## 📋 Mô Tả

Hệ thống cho phép quản lý toàn bộ vòng đời của sự kiện từ tạo mới, xem danh sách, cập nhật và xóa sự kiện. Hệ thống tích hợp với SQL Server và sử dụng các stored procedure, function, trigger và transaction để đảm bảo tính toàn vẹn dữ liệu.

## 🚀 Tính Năng

### CRUD Câu Lạc Bộ (CLB) & Đội Nhóm
- ✅ **CLB**: Thêm / Xem / Sửa / Xóa CLB
- ✅ **Đội Nhóm**: Thêm / Xem / Sửa / Xóa đội nhóm theo CLB
- ✅ Kiểm tra ràng buộc: không xóa CLB khi còn đội nhóm (đã xóa cascade trong API)

### CRUD Sự Kiện
- ✅ **Tạo mới sự kiện**: Thêm sự kiện mới với đầy đủ thông tin
- ✅ **Xem danh sách**: Hiển thị danh sách sự kiện với bộ lọc và tìm kiếm
- ✅ **Xem chi tiết**: Xem thông tin chi tiết sự kiện, nhà tài trợ và người tham dự
- ✅ **Cập nhật**: Sửa thông tin sự kiện (chỉ trước ngày tổ chức)
- ✅ **Xóa**: Xóa sự kiện kèm các bản ghi liên quan (sử dụng transaction)

### Tính Năng Khác
- 🔍 Tìm kiếm và lọc sự kiện theo CLB, ngày, tên
- 📊 Hiển thị tổng tiền tài trợ (tính trực tiếp từ `TaiTroSuKien`)
- 🔐 Validation dữ liệu đầy đủ
- 💾 Sử dụng stored procedure khi tạo mới (nếu có)
- 🔄 Transaction khi xóa để đảm bảo tính toàn vẹn

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- React 18
- React Router DOM
- Axios
- React DatePicker
- React Toastify

### Backend
- Node.js
- Express.js
- mssql (SQL Server driver)
- CORS
- dotenv

### Database
- SQL Server
- Stored Procedures
- Functions
- Triggers
- Transactions

## 📦 Cài Đặt

### Yêu Cầu
- Node.js (v14 trở lên)
- SQL Server
- Database `QL_CLBvaDoiNhom` đã được tạo và có dữ liệu

### Bước 1: Clone và cài đặt dependencies

```bash
# Cài đặt dependencies cho root (nếu cần)
npm install

# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install
```

### Bước 2: Cấu hình Database

1. Tạo file `.env` trong thư mục `backend` từ `.env.example`:

```bash
cd backend
cp .env.example .env
```

2. Chỉnh sửa file `.env` với thông tin SQL Server của bạn:

```env
DB_SERVER=localhost
DB_DATABASE=QL_CLBvaDoiNhom
DB_USER=sa
DB_PASSWORD=your_password
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true

PORT=5000
NODE_ENV=development
```

### Bước 3: Chạy ứng dụng

#### Chạy riêng lẻ:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

#### Chạy đồng thời (từ root):

```bash
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Cấu Trúc Thư Mục

```
.
├── backend/
│   ├── config/
│   │   └── db.js              # Cấu hình kết nối SQL Server
│   ├── routes/
│   │   └── sukien.js           # API routes cho sự kiện
│   ├── server.js               # Server chính
│   ├── package.json
│   └── .env                    # Cấu hình database
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.js        # Component header
│   │   ├── pages/
│   │   │   ├── DanhSachSuKien.js
│   │   │   ├── ChiTietSuKien.js
│   │   │   ├── ThemSuKien.js
│   │   │   └── SuaSuKien.js
│   │   ├── services/
│   │   │   └── api.js          # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── NghiepVu_QuanLySuKien.md    # Tài liệu nghiệp vụ
└── README.md
```

## 🔌 API Endpoints

### Sự Kiện

- `GET /api/sukien` - Lấy danh sách sự kiện (có query params: MaCLB, search, fromDate, toDate)
- `GET /api/sukien/:MaSK` - Lấy chi tiết sự kiện
- `POST /api/sukien` - Tạo mới sự kiện
- `PUT /api/sukien/:MaSK` - Cập nhật sự kiện
- `DELETE /api/sukien/:MaSK` - Xóa sự kiện
- `GET /api/sukien/clb/list` - Lấy danh sách CLB

## 🗄️ Database

### Bảng SuKien

```sql
CREATE TABLE SuKien (
    MaSK CHAR(5) PRIMARY KEY,
    TenSK NVARCHAR(100),
    NgayToChuc DATE,
    DiaDiem NVARCHAR(100),
    MaCLB CHAR(5) FOREIGN KEY REFERENCES CLB(MaCLB),
    MoTa NVARCHAR(200),
    TongTaiTro DECIMAL(18,2) DEFAULT 0
);
```

### Stored Procedures và Functions được sử dụng:

1. **ThongKe_ThemSuKienMoi** - Thêm sự kiện mới (nếu có)
2. **fn_TongTaiTroSuKien** - Tính tổng tiền tài trợ của sự kiện
3. **Transaction** - Xóa sự kiện kèm các bản ghi liên quan

## 📝 Nghiệp Vụ

Xem file `NghiepVu_QuanLySuKien.md` để biết chi tiết về nghiệp vụ quản lý sự kiện.

## 🐛 Xử Lý Lỗi

Hệ thống có xử lý lỗi đầy đủ:
- Validation dữ liệu đầu vào
- Kiểm tra ràng buộc database
- Thông báo lỗi rõ ràng cho người dùng
- Transaction rollback khi có lỗi

## 📄 License

Dự án này được tạo cho mục đích học tập.

## 👥 Tác Giả

Nhóm sinh viên - Đại học Công Thương TP.HCM

