BỘ CÔNG THƯƠNG
TRƯỜNG ĐẠI HỌC CÔNG THƯƠNG THÀNH PHỐ HCM 
KHOA CÔNG NGHỆ THÔNG TIN
---------------------------




QUẢN LÝ CÂU LẠC BỘ -ĐỘI NHÓM
BÁO CÁO ĐỒ ÁN MÔN HỌC
HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU
	

	SINH VIÊN THỰC HIỆN: 
Nhóm trưởng :   1.2001230575- Hoàng Trung Nguyên- 14DHTH15 
	2.2001230208-Lê Vũ Hải-14DHTH02
	3.2001230947-Lâm Phước Thuận-14DHTH02
	4.2001231031-Bùi Thị Vấn-14DHTH03
	5.2001232085-Nguyễn Ngọc Lan Chi-14DHTH15
	             GVHD: Trần Quàng Bình 


TP. HỒ CHÍ MINH, tháng 09. năm 2025 
MỤC LỤC
1	CHƯƠNG 1: XÂY DỰNG CƠ SỞ DỮ LIỆU	10
1.Tạo và mô tả các thành phần của CSDL.	10
2. Tạo cơ sở dữ liệu và thiết lập khóa chính, khóa ngoại	10
3.Thiết lập các ràng buộc CHECK, UNIQUE, DEFAULT	11
4.Tạo lược đồ Digram	12
6. Nhập dữ liệu mẫu (phù hợp với thực tế)	13
CHƯƠNG 2: CÀI ĐẶT YÊU CẦU XỬ LÝ	14
CHƯƠNG 3: QUẢN TRỊ HỆ THỐNG	15
CHƯƠNG 4: XÂY DỰNG ỨNG DỤNG	15











 
GIỚI THIỆU ĐỀ TÀI

QUẢN LÝ CÂU LẠC BỘ – ĐỘI NHÓM

Trong môi trường giáo dục đại học hiện nay, các Câu lạc bộ (CLB) và Đội nhóm đóng vai trò quan trọng trong việc rèn luyện kỹ năng mềm, nâng cao tinh thần học tập, kết nối sinh viên và tạo ra môi trường hoạt động năng động. Tuy nhiên, việc quản lý số lượng lớn CLB, thành viên, sự kiện, thông báo hay hoạt động tài trợ vẫn còn được thực hiện thủ công tại nhiều đơn vị, dẫn đến tình trạng khó kiểm soát, thiếu minh bạch và tốn nhiều thời gian của ban chủ nhiệm.

Từ thực tế đó, nhóm quyết định thực hiện đề tài “Hệ thống Quản lý Câu lạc bộ – Đội nhóm” nhằm xây dựng một cơ sở dữ liệu hoàn chỉnh và hệ thống xử lý dữ liệu giúp tự động hóa các nghiệp vụ như quản lý thành viên, quản lý CLB, tổ chức sự kiện, đăng thông báo, theo dõi tài trợ và quản lý tài khoản người dùng. Hệ thống được thiết kế dựa trên mô hình quan hệ, áp dụng các ràng buộc toàn vẹn, khóa chính – khóa ngoại, thủ tục, hàm, trigger và các cơ chế quản trị nhằm đảm bảo dữ liệu được lưu trữ chính xác, nhất quán và an toàn.

1. TÊN ĐỀ TÀI

“Xây dựng hệ thống cơ sở dữ liệu và ứng dụng Quản lý Câu Lạc Bộ – Đội Nhóm trong trường học”

2. MỤC TIÊU CỦA ĐỀ TÀI

Đề tài hướng đến các mục tiêu chính:
Xây dựng cơ sở dữ liệu hoàn chỉnh:
Thiết kế 12 bảng dữ liệu với quan hệ chặt chẽ.
Thiết lập khóa chính, khóa ngoại, ràng buộc CHECK, UNIQUE, DEFAULT.
Đảm bảo tính toàn vẹn và đồng nhất của dữ liệu.

Hỗ trợ quản lý hoạt động CLB – Đội nhóm:
Quản lý danh sách CLB, đội nhóm, thành viên.
Theo dõi quá trình tham gia của sinh viên.
Quản lý sự kiện, nhà tài trợ, thông báo và bình luận.
Cài đặt các xử lý phức tạp:
Xây dựng các stored procedure, function, trigger, cursor, transaction.
Tự động hóa các nghiệp vụ thực tế: cập nhật tài trợ, kiểm tra dữ liệu, xử lý khi xóa, chuyển CLB...
Hỗ trợ xây dựng ứng dụng giao diện (Windows Form hoặc Web):
Giao diện truy vấn và hiển thị dữ liệu thuận tiện cho sinh viên và quản trị viên.
3. LÝ DO CHỌN ĐỀ TÀI
Nhóm chọn đề tài này vì:
Hoạt động CLB trong trường đại học ngày càng phát triển nhưng thiếu hệ thống quản lý tập trung.
Việc theo dõi thành viên, sự kiện, tài trợ và thông báo thường thủ công, gây mất thời gian và dễ sai sót.
Đây là một bài toán thực tế, phù hợp để vận dụng kiến thức của môn Hệ quản trị CSDL.
Đề tài giúp sinh viên rèn luyện kỹ năng:
Thiết kế CSDL theo chuẩn.
Cài đặt xử lý dữ liệu phức tạp.
Hiểu rõ ứng dụng của cơ sở dữ liệu trong hệ thống phần mềm.
Có thể mở rộng thành hệ thống thật cho khoa hoặc trường sử dụng.

4. PHẠM VI ỨNG DỤNG

Phạm vi áp dụng:
Các trường đại học, cao đẳng.
Các tổ chức giáo dục có nhiều CLB hoạt động.
Các trung tâm, đoàn thể có nhiều sự kiện và đội nhóm.
Phạm vi nghiệp vụ của đề tài bao gồm:
Quản lý CLB và đội nhóm.
Quản lý thành viên và vai trò.
Quản lý sự kiện và sự tham gia.
Quản lý tài khoản người dùng.
Quản lý tài trợ, thông báo, bình luận.
Không bao gồm:
Chấm công sinh viên.
Quản lý tài chính chi tiết ngoài tài trợ.
Hệ thống chat hoặc tương tác thời gian thực.

5. ĐỐI TƯỢNG SỬ DỤNG
Hệ thống hướng đến các đối tượng:
Ban chủ nhiệm CLB / quản lý Đội nhóm: Tạo thông tin CLB, đăng thông báo, quản lý sự kiện.
Sinh viên: Tham gia CLB, sự kiện, xem thông báo, bình luận.
Quản trị viên hệ thống: Quản lý tài khoản, phân quyền, kiểm soát toàn bộ dữ liệu.
Nhà tài trợ (gián tiếp): Thông tin tài trợ được lưu trữ để báo cáo minh bạch.


6. VAI TRÒ CỦA CƠ SỞ DỮ LIỆU TRONG TOÀN BỘ HỆ THỐNG

Cơ sở dữ liệu đóng vai trò trung tâm, quyết định sự ổn định và chính xác của toàn bộ hệ thống:
Lưu trữ dữ liệu tập trung: Mọi thông tin về CLB, thành viên, sự kiện, tài trợ… đều được lưu vào CSDL, đảm bảo thống nhất.
Đảm bảo tính toàn vẹn dữ liệu: Nhờ các cơ chế Khóa chính, khóa ngoại, ràng buộc CHECK, UNIQUE và Trigger → Ngăn chặn trùng dữ liệu, sai lệch, vi phạm quan hệ.
Hỗ trợ truy vấn và xử lý nghiệp vụ: Các stored procedure, function, cursor… → Tự động hóa quy trình như: cập nhật tài trợ, kiểm tra thông tin, xử lý khi xóa.
Hỗ trợ phân quyền người dùng: CSDL giúp kiểm soát quyền truy cập: Admin – Quản lý – Thành viên.
Là nền tảng cho ứng dụng giao diện: Dữ liệu được lưu tập trung giúp phần mềm Windows Form hoặc Web App dễ dàng kết nối và hiển thị 

CHƯƠNG 1: XÂY DỰNG CƠ SỞ DỮ LIỆU


1.Tạo và mô tả các thành phần của CSDL.
Giới thiệu:
Hệ cơ sở dữ liệu Quản lý Câu lạc bộ và Đội nhóm được xây dựng nhằm hỗ trợ việc quản lý toàn diện các hoạt động của CLB trong trường học. Hệ thống giúp lưu trữ và xử lý thông tin về CLB, đội nhóm, thành viên, sự kiện, tài trợ, thông báo, bình luận và tài khoản người dùng. Nhờ đó, quá trình tổ chức, theo dõi và vận hành CLB trở nên thuận tiện, minh bạch và hiệu quả hơn.

1. CLB(MaCLB, TenCLB, NgayThanhLap, MoTa) 
2. DoiNhom(MaDoi, TenDoi, MaCLB, MoTa) 
3. ThanhVien(MaSV, HoTen, NgaySinh, Lop, Email, SDT) 
4. ThamGiaCLB(MaSV, MaCLB, MaVaiTro, NgayThamGia, VaiTro) 
5. SuKien(MaSK, TenSK, NgayToChuc, DiaDiem, MaCLB, MoTa)
6. ThamDuSuKien(MaSV, MaSK, VaiTroTrongSuKien) 
7. TaiKhoanNguoiDung(TenDangNhap, MatKhau, QuyenHan, MaSV) 
8. NhaTaiTro(MaNTT, TenNTT, DiaChi, SDT, Email) 
9. TaiTroSuKien(MaNTT, MaSK, SoTienTaiTro) 
10. ThongBao(MaTB, TieuDe, NoiDung, NgayDang, MaCLB,DoUuTien)
11. BinhLuanThongBao(MaBL, MaTB, MaSV, NoiDung, NgayBinhLuan)


Mô tả hệ cơ sở dữ liệu:
 • Quản lý CLB và Đội nhóm: Mỗi CLB có nhiều đội/nhóm trực thuộc, với đầy đủ thông tin về tên, ngày thành lập, mô tả.
 • Quản lý Thành viên: Lưu thông tin sinh viên tham gia CLB; một thành viên có thể tham gia nhiều CLB với vai trò khác nhau (qua bảng ThamGiaCLB).
 • Quản lý Sự kiện: CLB có thể tổ chức nhiều sự kiện, trong đó thành viên tham gia với các vai trò khác nhau (qua bảng ThamDuSuKien).
 • Quản lý Nhà tài trợ: Mỗi sự kiện có thể nhận tài trợ từ nhiều nhà tài trợ khác nhau, kèm theo số tiền tài trợ.
 • Quản lý Thông báo và Bình luận: CLB đăng thông báo, thành viên có thể bình luận, trao đổi thông tin.
 • Quản lý Tài khoản: Mỗi thành viên có tài khoản riêng để đăng nhập hệ thống, với phân quyền như Quản trị viên, Quản lý hay Thành viên.






2. Tạo cơ sở dữ liệu và thiết lập khóa chính, khóa ngoại
Cơ sở dữ liệu Quản lý Câu lạc bộ và Đội nhóm được thiết kế với 12 bảng chính. Trong đó, mỗi bảng đều có khóa chính (Primary Key) để định danh duy nhất từng bản ghi, đồng thời thiết lập khóa ngoại (Foreign Key) để liên kết dữ liệu giữa các bảng, đảm bảo tính toàn vẹn và logic của hệ thống.
· Bảng CLB: có khóa chính là MaCLB. Bảng này liên kết với các bảng DoiNhom, SuKien, ThongBao và ThamGiaCLB thông qua khóa ngoại MaCLB.
· Bảng DoiNhom: có khóa chính là MaDoi. Mỗi đội nhóm thuộc về một câu lạc bộ, vì vậy MaCLB trong bảng này là khóa ngoại tham chiếu đến bảng CLB.
· Bảng ThanhVien: có khóa chính là MaSV. Đây là bảng lưu thông tin sinh viên và sẽ được liên kết với nhiều bảng khác như ThamGiaCLB, ThamDuSuKien, TaiKhoanNguoiDung, BinhLuanThongBao.
· Bảng ThamGiaCLB: có khóa chính là cặp (MaSV, MaCLB). Bảng này thể hiện mối quan hệ nhiều-nhiều giữa ThanhVien và CLB, đồng thời có khóa ngoại MaVaiTro tham chiếu đến bảng VaiTro.
· Bảng SuKien: có khóa chính là MaSK. Mỗi sự kiện do một câu lạc bộ tổ chức, vì vậy MaCLB trong bảng này là khóa ngoại liên kết đến CLB.
· Bảng ThamDuSuKien: có khóa chính là cặp (MaSV, MaSK). Đây là bảng trung gian mô tả quan hệ nhiều-nhiều giữa ThanhVien và SuKien.
· Bảng TaiKhoanNguoiDung: có khóa chính là TenDangNhap. Khóa ngoại MaSV liên kết đến bảng ThanhVien, giúp mỗi tài khoản gắn với một sinh viên cụ thể.
· Bảng NhaTaiTro: có khóa chính là MaNTT. Lưu thông tin các đơn vị tài trợ cho sự kiện.
· Bảng TaiTroSuKien: có khóa chính là cặp (MaNTT, MaSK). Bảng này mô tả mối quan hệ nhiều-nhiều giữa NhaTaiTro và SuKien.
· Bảng ThongBao: có khóa chính là MaTB. Mỗi thông báo được một CLB đăng tải, vì vậy có khóa ngoại MaCLB liên kết đến bảng CLB.
· Bảng BinhLuanThongBao: có khóa chính là MaBL. Bảng này có hai khóa ngoại: MaTB tham chiếu đến ThongBao và MaSV tham chiếu đến ThanhVien, thể hiện bình luận của sinh viên về thông báo.
Việc thiết lập khóa chính và khóa ngoại như trên giúp hệ thống quản lý thông tin chặt chẽ, tránh dữ liệu rời rạc, đồng thời hỗ trợ tốt cho các truy vấn phức tạp trong quá trình sử dụng.


3.Thiết lập các ràng buộc CHECK, UNIQUE, DEFAULT
Trong cơ sở dữ liệu, ngoài việc thiết lập khóa chính và khóa ngoại, việc xây dựng các ràng buộc khác như CHECK, UNIQUE, DEFAULT là rất cần thiết để đảm bảo tính toàn vẹn dữ liệu.
-	Ràng buộc UNIQUE: được sử dụng để đảm bảo rằng giá trị trong một cột hoặc một nhóm cột là duy nhất, không trùng lặp.
 Mỗi tên Câu lạc bộ (TenCLB) chỉ xuất hiện một lần trong bảng CLB.
TenCLB NVARCHAR(100) UNIQUE, -- tên CLB không trùng nhau
o Mỗi địa chỉ email (Email) của sinh viên trong bảng ThanhVien phải là duy nhất.
Email NVARCHAR(100) UNIQUE -- email sinh viên duy nhất
· Ràng buộc CHECK: được sử dụng để kiểm tra điều kiện hợp lệ khi nhập dữ liệu. Ví dụ:
o Số điện thoại (SDT) phải đủ 10 chữ số.
SDT CHAR(10) CHECK (LEN(SDT) = 10),
o Số tiền tài trợ (SoTienTaiTro) phải lớn hơn hoặc bằng 0.
SoTienTaiTro DECIMAL(18,2) CHECK (SoTienTaiTro >= 0),
o Quyền hạn (QuyenHan) trong bảng TaiKhoanNguoiDung chỉ nhận các giá trị: Admin, QuanLy, ThanhVien.
QuyenHan NVARCHAR(20) CHECK (QuyenHan IN ('Admin','QuanLy','ThanhVien'))
· Ràng buộc DEFAULT: được sử dụng để gán giá trị mặc định cho một cột nếu người dùng không nhập dữ liệu. Ví dụ:
o Ngày tham gia (NgayThamGia) trong bảng ThamGiaCLB mặc định là ngày hiện tại.NgayThamGia DATE DEFAULT GETDATE(),Ngày đăng (NgayDang) trong bảng ThongBao và BinhLuanThongBao mặc định là ngày hiện tại.
NgayDang DATE DEFAULT GETDATE()
Việc áp dụng các ràng buộc trên giúp hệ thống quản lý Câu lạc bộ và Đội nhóm hoạt động chính xác, dữ liệu hợp lệ và tránh được lỗi trùng lặp hoặc sai định dạng.
4.Tạo lược đồ Digram
 

5. Nhập dữ liệu mẫu (phù hợp với thực tế)
Sau khi thiết kế các bảng, nhóm tiến hành nhập dữ liệu thử nghiệm để kiểm tra hoạt động của hệ thống. Dữ liệu được xây dựng phù hợp với tình huống thực tế quản lý câu lạc bộ và đội nhóm trong trường học.
 Bảng CLB: bao gồm các câu lạc bộ tiêu biểu trong trường như CLB Tin học, CLB Bóng đá, CLB Văn nghệ, CLB Kinh doanh, CLB Tiếng Anh. Mỗi câu lạc bộ có thông tin về ngày thành lập và mô tả chức năng hoạt động.
· Bảng Đội nhóm: trong mỗi câu lạc bộ sẽ có nhiều đội nhóm nhỏ. Ví dụ: CLB Tin học có nhóm Lập trình Web, CLB Bóng đá có đội bóng đá nam, CLB Văn nghệ có nhóm Múa, CLB Tiếng Anh có nhóm Speaking.
· Bảng Thành viên: lưu thông tin các sinh viên tham gia, như Nguyễn Văn An (lớp 20DHTH5), Lê Thị Hoa (20DHTH3), Trần Minh Quân (21DHTH1), Phạm Thị Mai (20DHTH4), Hoàng Văn Bình (19DHTH2). Mỗi thành viên có ngày sinh, email và số điện thoại hợp lệ.
· Bảng Vai trò: bao gồm các vai trò điển hình như Chủ nhiệm, Phó chủ nhiệm, Thành viên, Cố vấn, Ban tổ chức.
· Bảng ThamGiaCLB: thể hiện mối quan hệ thành viên – CLB. Ví dụ: Nguyễn Văn An tham gia CLB Tin học với vai trò Chủ nhiệm, Lê Thị Hoa tham gia CLB Tin học với vai trò Thành viên, Phạm Thị Mai là Phó chủ nhiệm CLB Văn nghệ.
· Bảng Sự kiện: chứa các sự kiện do CLB tổ chức, như: Hội thảo AI (CLB Tin học), Giải bóng đá khoa (CLB Bóng đá), Đêm nhạc hội (CLB Văn nghệ), Hội thảo khởi nghiệp (CLB Kinh doanh), Cuộc thi Debate Contest (CLB Tiếng Anh).
· Bảng ThamDuSuKien: ghi nhận sự tham dự sự kiện của các thành viên, kèm vai trò cụ thể. Ví dụ: Nguyễn Văn An tham gia Hội thảo AI với tư cách Báo cáo viên, Trần Minh Quân tham gia Giải bóng đá với vai trò cầu thủ, Phạm Thị Mai tham gia Đêm nhạc hội với tiết mục múa.
· Bảng TaiKhoanNguoiDung: lưu thông tin tài khoản đăng nhập của sinh viên. Ví dụ: an123 (Admin) gắn với Nguyễn Văn An, hoa456 (Thành viên) gắn với Lê Thị Hoa, mai999 (Quản lý) gắn với Phạm Thị Mai.
· Bảng NhaTaiTro: chứa thông tin nhà tài trợ cho các sự kiện, như Công ty FPT, Công ty Viettel, Công ty Vinamilk, Ngân hàng BIDV, Tập đoàn VNG.
· Bảng TaiTroSuKien: thể hiện số tiền tài trợ cho từng sự kiện. Ví dụ: Công ty FPT tài trợ 5 triệu cho Hội thảo AI, Viettel tài trợ 3 triệu cho Giải bóng đá, Vinamilk tài trợ 7 triệu cho Đêm nhạc hội.
· Bảng ThongBao: lưu các thông báo được đăng tải bởi CLB, ví dụ: Lịch họp CLB Tin học, Lịch thi đấu bóng đá, Thông báo đêm nhạc hội, Thông báo hội thảo khởi nghiệp, Thông báo cuộc thi Debate Contest.
· Bảng BinhLuanThongBao: lưu bình luận của sinh viên về các thông báo. Ví dụ: Nguyễn Văn An bình luận “Ok, mình sẽ tham gia” vào thông báo họp CLB, Trần Minh Quân bình luận “Sẵn sàng thi đấu!” vào thông báo giải bóng đá, Phạm Thị Mai bình luận “Rất háo hức!” vào đêm nhạc hội.
Những dữ liệu mẫu này giúp kiểm tra tính đúng đắn của mô hình, đồng thời phản ánh được tình huống thực tế trong quản lý câu lạc bộ và đội nhóm của sinh viên.







CHƯƠNG 2: CÀI ĐẶT YÊU CẦU XỬ LÝ
(Mỗi sv tự đưa ra cài đặt tối thiểu 5 cấu trúc khác nhau. Mỗi cấu trúc cài đặt phải đủ hàm lượng phức tạp xử lý)
- Mô tả các yêu cầu cài đặt hệ thống và cài đặt các procedure, function, trigger, cursor, transaction tương ứng để xử lý.





















CHƯƠNG 3: QUẢN TRỊ HỆ THỐNG

3.1. Giới thiệu chương
Chương này trình bày các hoạt động quản trị hệ thống trong cơ sở dữ liệu của đề tài, bao gồm: quản lý người dùng, phân quyền truy cập dựa trên mô hình RBAC (Role-Based Access Control), thiết lập các tài khoản đăng nhập, tạo role, cấp quyền CRUD cho từng người dùng, và triển khai cơ chế sao lưu – khôi phục nhằm đảm bảo an toàn dữ liệu. Các nhiệm vụ quản trị đảm bảo hệ thống vận hành ổn định, bảo mật và đáp ứng đúng nhu cầu sử dụng của từng thành viên.

3.2. Giải pháp quản trị người dùng
3.2.1. Mô hình quản trị người dùng
Hệ thống áp dụng mô hình RBAC – Role-Based Access Control, nghĩa là quyền không cấp trực tiếp cho từng cá nhân, mà gán theo vai trò. Mỗi người dùng sẽ truy cập và thao tác trên dữ liệu trong đúng phạm vi trách nhiệm của họ.
Mô hình này giúp:
Dễ quản lý, dễ mở rộng.
Tránh cấp thừa quyền, đảm bảo tính “ít quyền nhất” (Least Privilege).
Nâng cao bảo mật.
Giảm sai sót khi thêm hoặc thay đổi thành viên.








3.2.2. Danh sách 5 thành viên và nhiệm vụ

STT	Họ tên	Vai trò	Nhiệm vụ chính
1	Hoàng Trung Nguyên	Quản trị viên	Toàn quyền hệ thống
2	Lê Vũ Hải	Quản lý CLB	CRUD bảng CLB và đội nhóm
3	Lâm Phước Thuận	Qaunr lý Sự Kiện	CRUD bảng sự kiện
4	Nguyễn Ngọc Lan Chi	Nhân viên hỗ trợ	CRUD toàn bộ dữ liệu,không có quyền quản trị
5	Bùi thị Vấn	Nhân viên thống kê	CRUD toàn bộ dữ liệu,xem cấu trúc bảng


3.3. Tạo login, user và role trong SQL Server
3.3.1. Tạo Login cho 5 thành viên
CREATE LOGIN Nguyen WITH PASSWORD = 'Nguyen@123';
CREATE LOGIN Hai WITH PASSWORD = 'Hai@123';
CREATE LOGIN Thuan WITH PASSWORD = 'Thuan@123';
CREATE LOGIN Chi WITH PASSWORD = 'Chi@123';
CREATE LOGIN Van WITH PASSWORD = 'Van@123';

3.3.2. Tạo User trong database
CREATE USER NguyenUser FOR LOGIN Nguyen;
CREATE USER HaiUser FOR LOGIN Hai;
CREATE USER ThuanUser FOR LOGIN Thuan;
CREATE USER ChiUser FOR LOGIN Chi;
CREATE USER VanUser FOR LOGIN Van;

3.3.3. Tạo các Role đại diện cho từng nhóm quyền
CREATE ROLE Role_Admin;
CREATE ROLE Role_QLCLB;
CREATE ROLE Role_QLSuKien;
CREATE ROLE Role_HoTro;
CREATE ROLE Role_ThongKe;

3.4. Phân quyền cho từng Role (CRUD đầy đủ)
3.4.1. Role_Admin – Full quyền
GRANT CONTROL ON DATABASE::CLB_DN TO Role_Admin;


3.4.2. Role_QLCLB – CRUD CLB và đội nhóm
GRANT SELECT, INSERT, UPDATE, DELETE ON CLB TO Role_QLCLB;
GRANT SELECT, INSERT, UPDATE, DELETE ON DoiNhom TO Role_QLCLB;

3.4.3. Role_QLSuKien – CRUD sự kiện
GRANT SELECT, INSERT, UPDATE, DELETE ON SuKien TO Role_QLSuKien;

3.4.4. Role_HoTro – CRUD tất cả bảng (không có quyền quản trị)
GRANT SELECT, INSERT, UPDATE, DELETE ON CLB TO Role_HoTro;
GRANT SELECT, INSERT, UPDATE, DELETE ON DoiNhom TO Role_HoTro;
CHƯƠNG 4: XÂY DỰNG ỨNG DỤNG
(Mỗi sv cài đặt ít nhất một chức năng của hệ thống trên nền tảng windows form/web/mobile)
- Cài đặt kết nối từ ứng dụng đến SQL Server
- Với các chức năng cài đặt, bắt buộc trong code có gọi thực thi/xử lý ít nhất một cấu trúc như procedure/function/trigger/cursor/Transaction.

DANH MỤC TÀI LIỆU THAM KHẢO
 	SÁCH
 	NGUỒN TỪ INTERNET VÀ WEBSITE


