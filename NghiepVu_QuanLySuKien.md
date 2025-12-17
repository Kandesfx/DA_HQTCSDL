# NGHIỆP VỤ QUẢN LÝ SỰ KIỆN

## 1. TỔNG QUAN

### 1.1. Mục đích
Hệ thống quản lý sự kiện cho phép các Câu lạc bộ (CLB) trong trường học tổ chức, quản lý và theo dõi các sự kiện một cách hiệu quả. Hệ thống hỗ trợ toàn bộ vòng đời của sự kiện từ lúc tạo mới đến khi kết thúc.

### 1.2. Đối tượng sử dụng
- **Quản lý Sự kiện (Role_QLSuKien)**: Có quyền CRUD đầy đủ trên bảng SuKien
- **Quản trị viên**: Toàn quyền hệ thống
- **Thành viên CLB**: Xem thông tin sự kiện, đăng ký tham gia

## 2. CẤU TRÚC DỮ LIỆU SỰ KIỆN

### 2.1. Bảng SuKien

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|--------|--------------|-----------|-------|
| MaSK | CHAR(5) | PRIMARY KEY | Mã sự kiện (duy nhất) |
| TenSK | NVARCHAR(100) | NOT NULL | Tên sự kiện |
| NgayToChuc | DATE | NOT NULL | Ngày tổ chức sự kiện |
| DiaDiem | NVARCHAR(100) | NOT NULL | Địa điểm tổ chức |
| MaCLB | CHAR(5) | FOREIGN KEY → CLB(MaCLB) | Mã CLB tổ chức sự kiện |
| MoTa | NVARCHAR(200) | NULL | Mô tả chi tiết sự kiện |
| TongTaiTro | DECIMAL(18,2) | DEFAULT 0 | Tổng tiền tài trợ (nếu có) |

### 2.2. Quan hệ dữ liệu
- Mỗi sự kiện **thuộc về** một CLB (quan hệ nhiều-một)
- Một CLB có thể tổ chức **nhiều sự kiện**
- Sự kiện có thể có **nhiều nhà tài trợ** (qua bảng TaiTroSuKien)
- Sự kiện có thể có **nhiều người tham dự** (qua bảng ThamDuSuKien)

## 3. CÁC NGHIỆP VỤ CHÍNH

### 3.1. Tạo mới sự kiện (CREATE)

**Mô tả**: Quản lý sự kiện tạo một sự kiện mới cho CLB của mình.

**Quy trình**:
1. Nhập thông tin sự kiện:
   - Mã sự kiện (MaSK): Format SK## (ví dụ: SK01, SK06)
   - Tên sự kiện (TenSK): Bắt buộc, tối đa 100 ký tự
   - Ngày tổ chức (NgayToChuc): Phải là ngày trong tương lai hoặc hiện tại
   - Địa điểm (DiaDiem): Bắt buộc
   - Mã CLB (MaCLB): Phải tồn tại trong bảng CLB
   - Mô tả (MoTa): Tùy chọn

2. Kiểm tra ràng buộc:
   - MaCLB phải tồn tại trong bảng CLB
   - Ngày tổ chức không được là quá khứ (có thể cho phép ngày hiện tại)

3. Lưu vào database

**Stored Procedure sử dụng**: `ThongKe_ThemSuKienMoi` (nếu có)

### 3.2. Xem danh sách sự kiện (READ)

**Mô tả**: Hiển thị danh sách tất cả sự kiện hoặc lọc theo CLB.

**Quy trình**:
1. Lấy danh sách sự kiện từ bảng SuKien
2. Join với bảng CLB để hiển thị tên CLB
3. Có thể lọc theo:
   - Mã CLB
   - Ngày tổ chức (từ ngày - đến ngày)
   - Tên sự kiện (tìm kiếm)

4. Sắp xếp theo ngày tổ chức (mặc định: mới nhất trước)

**Function sử dụng**: Có thể dùng function để đếm số sự kiện của một CLB

### 3.3. Xem chi tiết sự kiện (READ)

**Mô tả**: Hiển thị thông tin chi tiết của một sự kiện.

**Thông tin hiển thị**:
- Thông tin cơ bản: Mã, Tên, Ngày, Địa điểm, Mô tả
- Thông tin CLB tổ chức
- Danh sách nhà tài trợ (nếu có)
- Tổng tiền tài trợ
- Danh sách người tham dự (nếu có)

**Function sử dụng**: `fn_TongTaiTroSuKien(@MaSK)` để tính tổng tài trợ

### 3.4. Cập nhật sự kiện (UPDATE)

**Mô tả**: Chỉnh sửa thông tin sự kiện (chỉ trước ngày tổ chức).

**Quy trình**:
1. Kiểm tra sự kiện có tồn tại không
2. Kiểm tra ngày tổ chức: Chỉ cho phép sửa nếu chưa diễn ra
3. Cập nhật các trường được phép:
   - Tên sự kiện
   - Ngày tổ chức (phải >= ngày hiện tại)
   - Địa điểm
   - Mô tả
   - Mã CLB (nếu cần chuyển CLB khác)

4. Lưu thay đổi

**Lưu ý**: Không cho phép sửa sự kiện đã diễn ra

### 3.5. Xóa sự kiện (DELETE)

**Mô tả**: Xóa sự kiện khỏi hệ thống.

**Quy trình**:
1. Kiểm tra sự kiện có tồn tại không
2. Kiểm tra ràng buộc:
   - Sự kiện chưa có người tham dự (hoặc cho phép xóa kèm theo)
   - Sự kiện chưa có tài trợ (hoặc xóa kèm theo)
3. Xóa các bản ghi liên quan:
   - ThamDuSuKien
   - TaiTroSuKien
4. Xóa sự kiện

**Stored Procedure sử dụng**: `ThongKe_CapNhatVaXoaSuKien` (nếu cần xóa kèm cập nhật CLB)

**Transaction**: Sử dụng transaction để đảm bảo tính toàn vẹn

## 4. CÁC NGHIỆP VỤ MỞ RỘNG

### 4.1. Thêm tài trợ cho sự kiện

**Mô tả**: Ghi nhận nhà tài trợ và số tiền tài trợ cho sự kiện.

**Stored Procedure**: `sp_ThemTaiTroSuKien`
- Thêm vào bảng TaiTroSuKien
- Tự động cập nhật TongTaiTro trong bảng SuKien
- Sử dụng Transaction để đảm bảo tính nhất quán

### 4.2. Đăng ký tham dự sự kiện

**Mô tả**: Sinh viên đăng ký tham dự sự kiện với vai trò cụ thể.

**Stored Procedure**: `sp_DangKyNhieuSVSuKien`
- Cho phép đăng ký nhiều sinh viên cùng lúc
- Sử dụng Transaction: Nếu một người lỗi thì rollback toàn bộ

### 4.3. Thống kê sự kiện

**Mô tả**: Các báo cáo thống kê về sự kiện.

**Các thống kê**:
- Số lượng sự kiện theo CLB
- Số lượng sự kiện theo tháng/năm
- Tổng tiền tài trợ theo sự kiện
- Số lượng người tham dự theo sự kiện

## 5. RÀNG BUỘC NGHIỆP VỤ

### 5.1. Ràng buộc dữ liệu
- MaSK: Duy nhất, format SK##
- MaCLB: Phải tồn tại trong bảng CLB
- NgayToChuc: Không được là quá khứ khi tạo mới
- TenSK: Bắt buộc, không được để trống

### 5.2. Ràng buộc nghiệp vụ
- Không cho phép xóa sự kiện đã có người tham dự (hoặc xóa kèm theo)
- Không cho phép sửa sự kiện đã diễn ra
- Khi xóa sự kiện, phải xóa các bản ghi liên quan (ThamDuSuKien, TaiTroSuKien)

## 6. PHÂN QUYỀN

### 6.1. Role_QLSuKien (Quản lý Sự kiện)
- **SELECT**: Xem danh sách và chi tiết sự kiện
- **INSERT**: Tạo mới sự kiện
- **UPDATE**: Cập nhật sự kiện
- **DELETE**: Xóa sự kiện

### 6.2. Role_ThongKe (Nhân viên thống kê)
- **SELECT**: Chỉ xem, không được sửa/xóa
- **VIEW DEFINITION**: Xem cấu trúc bảng

### 6.3. Role_HoTro (Nhân viên hỗ trợ)
- **SELECT**: Xem danh sách sự kiện
- Không có quyền INSERT/UPDATE/DELETE trên SuKien

## 7. GIAO DIỆN NGƯỜI DÙNG

### 7.1. Trang danh sách sự kiện
- Hiển thị bảng danh sách với các cột: Mã, Tên, Ngày tổ chức, Địa điểm, CLB
- Có nút: Thêm mới, Xem chi tiết, Sửa, Xóa
- Có bộ lọc: Theo CLB, Theo ngày
- Có tìm kiếm: Theo tên sự kiện

### 7.2. Trang thêm/sửa sự kiện
- Form nhập liệu với các trường:
  - Mã sự kiện (tự động hoặc nhập thủ công)
  - Tên sự kiện (bắt buộc)
  - Ngày tổ chức (date picker, bắt buộc)
  - Địa điểm (bắt buộc)
  - CLB (dropdown, bắt buộc)
  - Mô tả (textarea, tùy chọn)
- Nút: Lưu, Hủy
- Validation: Kiểm tra dữ liệu trước khi lưu

### 7.3. Trang chi tiết sự kiện
- Hiển thị đầy đủ thông tin sự kiện
- Danh sách nhà tài trợ (nếu có)
- Danh sách người tham dự (nếu có)
- Nút: Sửa, Xóa, Quay lại

## 8. XỬ LÝ LỖI VÀ THÔNG BÁO

### 8.1. Lỗi thường gặp
- Mã sự kiện đã tồn tại
- Mã CLB không tồn tại
- Ngày tổ chức là quá khứ
- Xóa sự kiện có người tham dự
- Sửa sự kiện đã diễn ra

### 8.2. Thông báo thành công
- Tạo mới thành công
- Cập nhật thành công
- Xóa thành công

