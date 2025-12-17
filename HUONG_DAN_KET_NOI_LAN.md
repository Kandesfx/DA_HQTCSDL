# HƯỚNG DẪN KẾT NỐI DATABASE QUA LAN

## Lỗi thường gặp

### Lỗi: `getaddrinfo ENOTFOUND 26.193.92.193,1433`

**Nguyên nhân:** Cấu hình `DB_SERVER` trong file `.env` sai format.

**Giải pháp:** Sửa lại file `.env` theo hướng dẫn bên dưới.

## Cấu hình file .env

### Cách 1: Dùng IP Address (Khuyến nghị cho LAN)

Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
# SQL Server Configuration
# IP của máy chủ database (KHÔNG có dấu phẩy, KHÔNG có port ở đây)
DB_SERVER=26.193.92.193\SQLEXPRESS
# Hoặc nếu không có instance name:
# DB_SERVER=26.193.92.193

# Database name
DB_DATABASE=QL_CLBvaDoiNhom

# SQL Server Authentication (BẮT BUỘC khi kết nối qua LAN)
DB_USER=Hai
DB_PASSWORD=Hai@123

# Port (set riêng, KHÔNG đưa vào DB_SERVER)
DB_PORT=1433

# Encryption
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true

# BẮT BUỘC phải false khi kết nối qua LAN (không dùng Windows Auth)
DB_USE_WINDOWS_AUTH=false

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=your-secret-key-change-in-production
```

### Cách 2: Dùng Computer Name

Nếu biết tên máy tính của máy chủ database:

```env
DB_SERVER=COMPUTER_NAME\SQLEXPRESS
# Ví dụ: DESKTOP-ABC123\SQLEXPRESS
```

### ⚠️ LƯU Ý QUAN TRỌNG

1. **KHÔNG đưa port vào DB_SERVER:**
   - ❌ SAI: `DB_SERVER=26.193.92.193,1433`
   - ✅ ĐÚNG: `DB_SERVER=26.193.92.193` hoặc `DB_SERVER=26.193.92.193\SQLEXPRESS`
   - Port được set riêng: `DB_PORT=1433`

2. **KHÔNG dùng Windows Authentication khi kết nối qua LAN:**
   - ❌ SAI: `DB_USE_WINDOWS_AUTH=true`
   - ✅ ĐÚNG: `DB_USE_WINDOWS_AUTH=false`
   - Phải dùng SQL Server Authentication với `DB_USER` và `DB_PASSWORD`

3. **Instance name (nếu có):**
   - Nếu SQL Server có instance name (ví dụ: SQLEXPRESS):
     - Format: `IP\INSTANCE` hoặc `COMPUTER_NAME\INSTANCE`
     - Ví dụ: `26.193.92.193\SQLEXPRESS`
   - Nếu không có instance (default instance):
     - Chỉ cần IP: `26.193.92.193`

## Các bước cấu hình

### Bước 1: Lấy thông tin từ máy chủ database

**Trên máy chủ database:**

1. **Lấy IP Address:**
   ```cmd
   ipconfig
   ```
   Tìm `IPv4 Address` (ví dụ: `192.168.1.100`)

2. **Lấy Server Name:**
   - Mở SQL Server Management Studio
   - Xem server name ở thanh kết nối
   - Hoặc chạy query:
     ```sql
     SELECT @@SERVERNAME AS ServerName;
     ```

3. **Lấy Instance Name:**
   - Xem trong SQL Server Configuration Manager
   - Hoặc từ server name (ví dụ: `DESKTOP-ABC\SQLEXPRESS` → instance là `SQLEXPRESS`)

### Bước 2: Cấu hình SQL Server để cho phép kết nối từ xa

**Trên máy chủ database, thực hiện:**

1. **Bật TCP/IP Protocol:**
   - Mở SQL Server Configuration Manager
   - SQL Server Network Configuration → Protocols for SQLEXPRESS
   - Right-click TCP/IP → Enable
   - Restart SQL Server service

2. **Cấu hình Firewall:**
   - Mở Windows Firewall
   - Inbound Rules → New Rule
   - Port → TCP → 1433
   - Allow the connection
   - Áp dụng cho Domain, Private, Public

3. **Bật SQL Server Browser (nếu dùng instance name):**
   - SQL Server Configuration Manager
   - SQL Server Services
   - SQL Server Browser → Start

4. **Cho phép Remote Connections:**
   - SQL Server Management Studio
   - Right-click server → Properties
   - Connections → Check "Allow remote connections to this server"
   - Restart SQL Server

### Bước 3: Tạo file .env

**Trên máy client (máy của bạn):**

1. Vào thư mục `backend/`
2. Tạo file `.env` (copy từ `env.example.txt` nếu có)
3. Điền thông tin theo format ở trên

### Bước 4: Test kết nối

**Cách 1: Test từ backend**
```bash
cd backend
npm run dev
```

Kiểm tra console log:
- ✅ Thành công: `Đã kết nối SQL Server thành công!`
- ❌ Lỗi: Xem thông báo lỗi chi tiết

**Cách 2: Test từ SQL Server Management Studio**
1. Mở SSMS
2. Server name: `26.193.92.193\SQLEXPRESS` (thay bằng IP thực tế)
3. Authentication: SQL Server Authentication
4. Login: `Hai` (hoặc user khác)
5. Password: `Hai@123`
6. Connect

**Cách 3: Test từ Command Prompt**
```cmd
sqlcmd -S 26.193.92.193\SQLEXPRESS -U Hai -P Hai@123
```

## Ví dụ cấu hình cụ thể

### Ví dụ 1: IP với instance name
```env
DB_SERVER=192.168.1.100\SQLEXPRESS
DB_DATABASE=QL_CLBvaDoiNhom
DB_USER=Hai
DB_PASSWORD=Hai@123
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true
DB_USE_WINDOWS_AUTH=false
```

### Ví dụ 2: IP không có instance (default instance)
```env
DB_SERVER=192.168.1.100
DB_DATABASE=QL_CLBvaDoiNhom
DB_USER=Hai
DB_PASSWORD=Hai@123
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true
DB_USE_WINDOWS_AUTH=false
```

### Ví dụ 3: Computer name
```env
DB_SERVER=DESKTOP-ABC123\SQLEXPRESS
DB_DATABASE=QL_CLBvaDoiNhom
DB_USER=Hai
DB_PASSWORD=Hai@123
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true
DB_USE_WINDOWS_AUTH=false
```

## Troubleshooting

### Lỗi: `getaddrinfo ENOTFOUND`

**Nguyên nhân:**
- Format `DB_SERVER` sai (có dấu phẩy hoặc port)
- IP address không đúng
- Không thể resolve hostname

**Giải pháp:**
1. Kiểm tra `DB_SERVER` không có dấu phẩy
2. Kiểm tra IP address có đúng không
3. Thử ping IP: `ping 26.193.92.193`

### Lỗi: `Connection timeout`

**Nguyên nhân:**
- Firewall chặn port 1433
- SQL Server không cho phép remote connections
- SQL Server không đang chạy

**Giải pháp:**
1. Kiểm tra firewall đã mở port 1433 chưa
2. Kiểm tra SQL Server có cho phép remote connections không
3. Kiểm tra SQL Server service có đang chạy không

### Lỗi: `Login failed`

**Nguyên nhân:**
- Username/password sai
- User chưa được tạo trong SQL Server
- User không có quyền truy cập database

**Giải pháp:**
1. Kiểm tra username/password có đúng không
2. Đảm bảo user đã được tạo trong SQL Server
3. Kiểm tra user có quyền truy cập database `QL_CLBvaDoiNhom` không

### Lỗi: `Server does not exist or access denied`

**Nguyên nhân:**
- Instance name sai
- SQL Server Browser không chạy (nếu dùng instance name)

**Giải pháp:**
1. Kiểm tra instance name có đúng không
2. Thử không dùng instance name (nếu là default instance)
3. Bật SQL Server Browser service

## Checklist

Trước khi kết nối, đảm bảo:

- [ ] File `.env` đã được tạo trong `backend/`
- [ ] `DB_SERVER` đúng format (không có dấu phẩy, không có port)
- [ ] `DB_PORT` được set riêng
- [ ] `DB_USE_WINDOWS_AUTH=false` (khi kết nối qua LAN)
- [ ] `DB_USER` và `DB_PASSWORD` đã điền
- [ ] SQL Server đã bật TCP/IP protocol
- [ ] Firewall đã mở port 1433
- [ ] SQL Server đã cho phép remote connections
- [ ] SQL Server Browser đang chạy (nếu dùng instance name)
- [ ] Có thể ping được IP của máy chủ database

## Sau khi cấu hình xong

1. **Khởi động lại backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Kiểm tra log:**
   - Nếu thấy: `Đã kết nối SQL Server thành công!` → ✅ Thành công
   - Nếu có lỗi → Xem phần Troubleshooting ở trên

3. **Test đăng nhập:**
   - Mở frontend
   - Đăng nhập với SQL Server login (ví dụ: `Hai` / `Hai@123`)
   - Nếu đăng nhập thành công → ✅ Hoàn tất

## Lưu ý bảo mật

1. **Không commit file `.env` lên Git:**
   - Đảm bảo `.env` có trong `.gitignore`
   - File `.env` chứa thông tin nhạy cảm (password)

2. **Sử dụng mật khẩu mạnh:**
   - SQL Server password nên có độ dài tối thiểu 8 ký tự
   - Nên có chữ hoa, chữ thường, số, ký tự đặc biệt

3. **Giới hạn quyền truy cập:**
   - Chỉ cho phép các IP cần thiết kết nối
   - Sử dụng firewall để giới hạn


