-- ===================== BẢNG CLB =====================
CREATE TABLE CLB (
    MaCLB CHAR(5) PRIMARY KEY,
    TenCLB NVARCHAR(100) UNIQUE,
    NgayThanhLap DATE DEFAULT GETDATE(),
    MoTa NVARCHAR(200)
);

-- ===================== BẢNG ĐỘI NHÓM =====================
CREATE TABLE DoiNhom (
    MaDoi CHAR(5) PRIMARY KEY,
    TenDoi NVARCHAR(100),
    MaCLB CHAR(5) FOREIGN KEY REFERENCES CLB(MaCLB),
    MoTa NVARCHAR(200)
);

-- ===================== BẢNG THÀNH VIÊN =====================
CREATE TABLE ThanhVien (
    MaSV CHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(100),
    NgaySinh DATE,
    Lop NVARCHAR(20),
    Email NVARCHAR(100) UNIQUE,
    SDT CHAR(10) CHECK (LEN(SDT) = 10)
);

-- ===================== BẢNG THAM GIA CLB =====================
CREATE TABLE ThamGiaCLB (
    MaSV CHAR(10) FOREIGN KEY REFERENCES ThanhVien(MaSV),
    MaCLB CHAR(5) FOREIGN KEY REFERENCES CLB(MaCLB),
    TenVaiTro NVARCHAR(50),
    NgayThamGia DATE DEFAULT GETDATE(),
    PRIMARY KEY (MaSV, MaCLB)
);

-- ===================== BẢNG SỰ KIỆN =====================
CREATE TABLE SuKien (
    MaSK CHAR(5) PRIMARY KEY,
    TenSK NVARCHAR(100),
    NgayToChuc DATE,
    DiaDiem NVARCHAR(100),
    MaCLB CHAR(5) FOREIGN KEY REFERENCES CLB(MaCLB),
    MoTa NVARCHAR(200)
);

-- ===================== BẢNG THAM DỰ SỰ KIỆN =====================
CREATE TABLE ThamDuSuKien (
    MaSV CHAR(10) FOREIGN KEY REFERENCES ThanhVien(MaSV),
    MaSK CHAR(5) FOREIGN KEY REFERENCES SuKien(MaSK),
    VaiTroTrongSuKien NVARCHAR(50),
    PRIMARY KEY (MaSV, MaSK)
);

-- ===================== BẢNG TÀI KHOẢN NGƯỜI DÙNG =====================
CREATE TABLE TaiKhoanNguoiDung (
    TenDangNhap NVARCHAR(50) PRIMARY KEY,
    MatKhau NVARCHAR(50) NOT NULL,
    QuyenHan NVARCHAR(20) CHECK (QuyenHan IN ('Admin','QuanLy','ThanhVien')),
    MaSV CHAR(10) FOREIGN KEY REFERENCES ThanhVien(MaSV)
);

-- ===================== BẢNG NHÀ TÀI TRỢ =====================
CREATE TABLE NhaTaiTro (
    MaNTT CHAR(5) PRIMARY KEY,
    TenNTT NVARCHAR(100),
    DiaChi NVARCHAR(200),
    SDT CHAR(10),
    Email NVARCHAR(100)
);

-- ===================== BẢNG TÀI TRỢ SỰ KIỆN =====================
CREATE TABLE TaiTroSuKien (
    MaNTT CHAR(5) FOREIGN KEY REFERENCES NhaTaiTro(MaNTT),
    MaSK CHAR(5) FOREIGN KEY REFERENCES SuKien(MaSK),
    SoTienTaiTro DECIMAL(18,2) CHECK (SoTienTaiTro >= 0),
    PRIMARY KEY (MaNTT, MaSK)
);

-- ===================== BẢNG THÔNG BÁO =====================
CREATE TABLE ThongBao (
    MaTB CHAR(5) PRIMARY KEY,
    TieuDe NVARCHAR(200),
    NoiDung NVARCHAR(MAX),
    NgayDang DATE DEFAULT GETDATE(),
    MaCLB CHAR(5) FOREIGN KEY REFERENCES CLB(MaCLB)
);

-- ===================== BẢNG BÌNH LUẬN THÔNG BÁO (Đã sửa) =====================
CREATE TABLE BinhLuanThongBao (
    MaBL CHAR(5) PRIMARY KEY,
    MaTB CHAR(5) FOREIGN KEY REFERENCES ThongBao(MaTB),
    MaSV CHAR(10) FOREIGN KEY REFERENCES ThanhVien(MaSV),
    NoiDung NVARCHAR(200),

NgayBinhLuan DATE DEFAULT GETDATE()
);

-- =========================================================
-- ===================== DỮ LIỆU MẪU ======================
-- =========================================================

-- CLB
INSERT INTO CLB (MaCLB, TenCLB, NgayThanhLap, MoTa) VALUES
('CLB01', N'CLB Tin học', '2020-01-15', N'Học tập và nghiên cứu CNTT'),
('CLB02', N'CLB Bóng đá', '2019-05-10', N'Luyện tập và thi đấu bóng đá'),
('CLB03', N'CLB Văn nghệ', '2018-03-20', N'Trình diễn và giao lưu âm nhạc'),
('CLB04', N'CLB Kinh doanh', '2021-07-05', N'Khởi nghiệp và kỹ năng kinh doanh'),
('CLB05', N'CLB Tiếng Anh', '2022-09-01', N'Luyện tập kỹ năng tiếng Anh');

-- Đội nhóm
INSERT INTO DoiNhom (MaDoi, TenDoi, MaCLB, MoTa) VALUES
('DN01', N'Nhóm Lập trình Web', 'CLB01', N'Tập trung học web'),
('DN02', N'Nhóm Bóng đá nam', 'CLB02', N'Tập luyện bóng đá nam'),
('DN03', N'Nhóm Múa', 'CLB03', N'Tập luyện biểu diễn múa'),
('DN04', N'Nhóm Marketing', 'CLB04', N'Nghiên cứu thị trường'),
('DN05', N'Nhóm Speaking', 'CLB05', N'Luyện nói tiếng Anh');

-- Thành viên
INSERT INTO ThanhVien (MaSV, HoTen, NgaySinh, Lop, Email, SDT) VALUES
('SV001', N'Nguyễn Văn An', '2002-05-01', '20DHTH5', 'an@example.com', '0912345678'),
('SV002', N'Lê Thị Hoa', '2001-11-20', '20DHTH3', 'hoa@example.com', '0987654321'),
('SV003', N'Trần Minh Quân', '2003-07-15', '21DHTH1', 'quan@example.com', '0901234567'),
('SV004', N'Phạm Thị Mai', '2002-08-25', '20DHTH4', 'mai@example.com', '0934567890'),
('SV005', N'Hoàng Văn Bình', '2001-10-10', '19DHTH2', 'binh@example.com', '0976543210');

-- Tham gia CLB
INSERT INTO ThamGiaCLB (MaSV, MaCLB, TenVaiTro, NgayThamGia) VALUES
('SV001', 'CLB01', N'Chủ nhiệm', '2020-02-01'),
('SV002', 'CLB01', N'Thành viên', '2020-02-05'),
('SV003', 'CLB02', N'Thành viên', '2021-03-01'),
('SV004', 'CLB03', N'Phó chủ nhiệm', '2021-04-15'),
('SV005', 'CLB04', N'Chủ nhiệm', '2022-01-20');

-- Sự kiện
INSERT INTO SuKien (MaSK, TenSK, NgayToChuc, DiaDiem, MaCLB, MoTa) VALUES
('SK01', N'Hội thảo AI', '2023-12-20', N'Hội trường A', 'CLB01', N'Tìm hiểu về trí tuệ nhân tạo'),
('SK02', N'Giải bóng đá khoa', '2023-11-10', N'Sân vận động', 'CLB02', N'Thi đấu bóng đá giữa các lớp'),
('SK03', N'Đêm nhạc hội', '2023-10-05', N'Hội trường B', 'CLB03', N'Giao lưu âm nhạc sinh viên'),
('SK04', N'Hội thảo khởi nghiệp', '2023-09-12', N'Hội trường A2', 'CLB04', N'Chia sẻ ý tưởng kinh doanh'),
('SK05', N'Tiếng Anh Debate', '2023-08-18', N'Phòng 101', 'CLB05', N'Thi tranh biện tiếng Anh');

-- Tham dự sự kiện
INSERT INTO ThamDuSuKien (MaSV, MaSK, VaiTroTrongSuKien) VALUES
('SV001', 'SK01', N'Báo cáo viên'),
('SV002', 'SK01', N'Người tham dự'),
('SV003', 'SK02', N'Cầu thủ'),
('SV004', 'SK03', N'Tiết mục múa'),

('SV005', 'SK04', N'Ban tổ chức');

-- Tài khoản
INSERT INTO TaiKhoanNguoiDung (TenDangNhap, MatKhau, QuyenHan, MaSV) VALUES
('an123', '123456', 'Admin', 'SV001'),
('hoa456', '123456', 'ThanhVien', 'SV002'),
('quan789', '123456', 'ThanhVien', 'SV003'),
('mai999', '123456', 'QuanLy', 'SV004'),
('binh555', '123456', 'ThanhVien', 'SV005');

-- Nhà tài trợ
INSERT INTO NhaTaiTro (MaNTT, TenNTT, DiaChi, SDT, Email) VALUES
('NTT01', N'Công ty FPT', N'Hà Nội', '0241234567', 'fpt@fpt.com'),
('NTT02', N'Công ty Viettel', N'Hà Nội', '0247654321', 'viettel@viettel.com'),
('NTT03', N'Công ty Vinamilk', N'TP.HCM', '0282222333', 'milk@vinamilk.com'),
('NTT04', N'Ngân hàng BIDV', N'Hải Phòng', '0225556666', 'bidv@bidv.com'),
('NTT05', N'Tập đoàn VNG', N'TP.HCM', '0281231234', 'vng@vng.com');

-- Tài trợ sự kiện
INSERT INTO TaiTroSuKien (MaNTT, MaSK, SoTienTaiTro) VALUES
('NTT01', 'SK01', 5000000),
('NTT02', 'SK02', 3000000),
('NTT03', 'SK03', 7000000),
('NTT04', 'SK04', 4000000),
('NTT05', 'SK05', 2000000);

-- Thông báo
INSERT INTO ThongBao (MaTB, TieuDe, NoiDung, NgayDang, MaCLB) VALUES
('TB01', N'Lịch họp CLB Tin học', N'Họp CLB tuần tới tại phòng 201', '2023-09-01', 'CLB01'),
('TB02', N'Lịch thi đấu bóng đá', N'Thi đấu vào ngày 10/11', '2023-09-05', 'CLB02'),
('TB03', N'Đêm nhạc hội', N'Chuẩn bị cho chương trình văn nghệ', '2023-09-10', 'CLB03'),
('TB04', N'Hội thảo khởi nghiệp', N'Tham gia buổi hội thảo chia sẻ ý tưởng', '2023-09-15', 'CLB04'),
('TB05', N'Debate Contest', N'Tham gia cuộc thi tiếng Anh tranh biện', '2023-09-20', 'CLB05');

-- Bình luận thông báo
INSERT INTO BinhLuanThongBao (MaBL, MaTB, MaSV, NoiDung, NgayBinhLuan) VALUES
('BL01', 'TB01', 'SV001', N'Ok, mình sẽ tham gia', '2023-09-02'),
('BL02', 'TB01', 'SV002', N'Mình bận hôm đó', '2023-09-02'),
('BL03', 'TB02', 'SV003', N'Sẵn sàng thi đấu!', '2023-09-06'),
('BL04', 'TB03', 'SV004', N'Rất háo hức!', '2023-09-11'),
('BL05', 'TB05', 'SV005', N'Mình đăng ký tham gia', '2023-09-21');


-- =========================================================
-- Kiểm tra dữ liệu
SELECT * FROM CLB;
SELECT * FROM DoiNhom;
SELECT * FROM ThanhVien;
SELECT * FROM ThamGiaCLB;
SELECT * FROM SuKien;
SELECT * FROM ThamDuSuKien;
SELECT * FROM TaiKhoanNguoiDung;
SELECT * FROM NhaTaiTro;
SELECT * FROM TaiTroSuKien;
SELECT * FROM ThongBao;
SELECT * FROM BinhLuanThongBao;

Select * from AppUsers
--======================NGUYỄN NGỌC LAN CHI=========================
--proceduce
--Liet ke su kien 1 sv tham gia
create proc selectThanhVien 
	@MaSV char(10) 
with recompile
as
select sk.*
from ThanhVien tv, SuKien sk,ThamDuSuKien t
where tv.MaSV=t.MaSV and
t.MaSK=sk.MaSK and
tv.MaSV= @MaSV
go 

exec selectThanhVien 'SV001'
drop Proc selectThanhVien


--function
--tra ve vai tro cua sinh vien trong clb
create function VaiTro (@MaSV char(10))
returns nvarchar(50)
as 
begin 
	declare @Vaitro nvarchar(50)
	set @Vaitro= (select TenVaiTro from ThamGiaCLB where MaSV= @MaSV)
	return @Vaitro
end

declare @Vaitro nvarchar(50)
set @Vaitro= dbo.VaiTro ('SV001')
print N'Vai trò cua sinh vien là: ' + @Vaitro

drop function VaiTro

--trigger
--khi them hoac cap nhat ngay tham gia clb, ngay khong duoc lon hon ngay thanh lap 
create trigger ngayTgTl on ThamGiaCLB
for insert
as
	if (select NgayThamGia from inserted) > (select NgayThanhLap from inserted i, CLB c where i.MaCLB=c.MaCLB)
		commit tran
	else
	begin
		print ('Ngay tham gia clb khong duoc lon hon ngay thanh lap clb')
		rollback tran
	end

INSERT INTO ThamGiaCLB (MaSV, MaCLB, TenVaiTro, NgayThamGia) VALUES
('SV001', 'CLB03', N'Thành viên', '2017-02-01');

drop trigger ngayTgTl

--cusor
--duyet qua tung thong bao roi in ra binh luan tuong ung

declare duyet cursor for
select t.MaTB, b.NoiDung from ThongBao t, BinhLuanThongBao b
where t.MaTB=b.MaTB  

open duyet

declare @matb char(5), @nd nvarchar(200);

fetch next from duyet into @matb, @nd

while @@FETCH_STATUS =0
begin
	print @matb + @nd
	fetch next from duyet into @matb, @nd
end

close duyet

deallocate duyet

--transaction
-- khi tài trợ cho 1 sự kiện, in ra tong so tien da tai tro cho tat ca su kien
begin tran
	insert into TaiTroSuKien 
	values ('NTT01','SK02', 3000000)

	select sum(SoTienTaiTRo) as N'Tổng số tiền tài trợ' from TaiTroSuKien where MaNTT= 'NTT01'
commit tran

delete from TaiTroSuKien where MaNTT='NTT01' and MaSK = 'SK02'




--=======================BÙI THỊ VẤN===============================
1.Stored Procedure:Thêm Sự Kiện Mới và Gán Tự Động Quyền Thống Kê (CRUD)
CREATE PROCEDURE ThongKe_ThemSuKienMoi
    @MaSK CHAR(5),
    @TenSK NVARCHAR(100),
    @NgayToChuc DATE,
    @DiaDiem NVARCHAR(100),
    @MaCLB CHAR(5)
AS
BEGIN
    -- Kiểm tra MaCLB tồn tại trước khi chèn (tính toàn vẹn)
    IF EXISTS (SELECT 1 FROM CLB WHERE MaCLB = @MaCLB)
    BEGIN
        -- Thực hiện INSERT (VanUser có quyền này trên SuKien)
        INSERT INTO SuKien (MaSK, TenSK, NgayToChuc, DiaDiem, MaCLB)
        VALUES (@MaSK, @TenSK, @NgayToChuc, @DiaDiem, @MaCLB);
        
        PRINT N'Đã thêm sự kiện thành công: ' + @TenSK;
        
        -- Gán quyền SELECT trên bảng SuKien cho chính Role_ThongKe 
        -- (Chỉ mang tính chất ví dụ quản lý quyền trong Procedure)
        GRANT SELECT ON SuKien TO Role_ThongKe;
    END
    ELSE
    BEGIN
        RAISERROR(N'Mã CLB không tồn tại. Không thể thêm sự kiện.', 16, 1);
        RETURN;
    END
END;
GO

-- Cấp quyền thực thi Procedure cho Role_ThongKe
GRANT EXECUTE ON ThongKe_ThemSuKienMoi TO Role_ThongKe;
GO

-- THỰC THI BỞI BÙI THỊ VẤN (VanUser)
EXEC ThongKe_ThemSuKienMoi 
    @MaSK = 'SK06', 
    @TenSK = N'Hội thảo bảo mật', 
    @NgayToChuc = '2025-12-30', 
    @DiaDiem = N'Hội trường C', 
    @MaCLB = 'CLB01';

-- KIỂM TRA (VanUser)
SELECT * FROM SuKien WHERE MaSK = 'SK06';

--2. Function: Đếm Số Đội Nhóm của một CLB (READ)
-- Cần chạy dưới quyền Admin (NguyenUser) để tạo Function
CREATE FUNCTION ThongKe_DemDoiNhom (@MaCLB CHAR(5))
RETURNS INT
AS
BEGIN
    DECLARE @SoLuong INT;
    
    -- Thực hiện SELECT (VanUser có quyền này trên DoiNhom)
    SELECT @SoLuong = COUNT(MaDoi) 
    FROM DoiNhom 
    WHERE MaCLB = @MaCLB;
    
    RETURN @SoLuong;
END;
GO

-- Cấp quyền thực thi Function cho Role_ThongKe
GRANT EXECUTE ON ThongKe_DemDoiNhom TO Role_ThongKe;
GO

-- THỰC THI BỞI BÙI THỊ VẤN (VanUser)
SELECT dbo.ThongKe_DemDoiNhom('CLB01') AS SoDoiNhomCLB01;
SELECT dbo.ThongKe_DemDoiNhom('CLB02') AS SoDoiNhomCLB02;


--3. Trigger: Kiểm Soát Sửa Đổi Tên CLB (UPDATE)

-- Tạo bảng lịch sử (cần quyền CREATE TABLE, thường là Admin)
CREATE TABLE LichSu_SuaCLB (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    MaCLB_Cu CHAR(5),
    TenCLB_Cu NVARCHAR(100),
    TenCLB_Moi NVARCHAR(100),
    ThoiGianSua DATETIME DEFAULT GETDATE(),
    NguoiSua NVARCHAR(50) DEFAULT SUSER_NAME()
);

-- Trigger kiểm soát UPDATE trên bảng CLB
CREATE TRIGGER ThongKe_GhiNhanSuaCLB
ON CLB
AFTER UPDATE
AS
BEGIN
    -- Kiểm tra xem trường TenCLB có bị thay đổi không
    IF UPDATE(TenCLB)
    BEGIN
        -- Ghi lại thông tin cũ và mới vào bảng LichSu_SuaCLB
        INSERT INTO LichSu_SuaCLB (MaCLB_Cu, TenCLB_Cu, TenCLB_Moi)
        SELECT d.MaCLB, d.TenCLB, i.TenCLB
        FROM deleted d
        INNER JOIN inserted i ON d.MaCLB = i.MaCLB;
    END
END;
GO

-- VanUser thực hiện UPDATE
UPDATE CLB 
SET TenCLB = N'CLB Công nghệ thông tin' 
WHERE MaCLB = 'CLB01';
-- GRANT SELECT ON LichSu_SuaCLB TO Role_ThongKe;
SELECT * FROM LichSu_SuaCLB;

--4. Cursor: Duyệt Danh Sách CLB để Tạo Báo Cáo Thống Kê (READ)

CREATE PROCEDURE ThongKe_BaoCaoCLB
AS
BEGIN
    DECLARE @TenCLB NVARCHAR(100);
    
    -- Khai báo CURSOR (sử dụng quyền SELECT trên CLB)
    DECLARE CLB_Cursor CURSOR FOR 
        SELECT TenCLB 
        FROM CLB 
        ORDER BY TenCLB;

    OPEN CLB_Cursor;
    FETCH NEXT FROM CLB_Cursor INTO @TenCLB;

    PRINT N'--- BÁO CÁO TỔNG HỢP CÁC CLB ---';
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- In ra thông tin CLB
        PRINT N'  - ' + @TenCLB;

        FETCH NEXT FROM CLB_Cursor INTO @TenCLB;
    END

    CLOSE CLB_Cursor;
    DEALLOCATE CLB_Cursor;
    
    PRINT N'--- KẾT THÚC BÁO CÁO ---';
END;
GO

-- Cấp quyền thực thi Procedure chứa Cursor cho Role_ThongKe
GRANT EXECUTE ON ThongKe_BaoCaoCLB TO Role_ThongKe;
GO

EXEC ThongKe_BaoCaoCLB;


--5. Transaction: Cập Nhật Sự Kiện và CLB (UPDATE & DELETE)

CREATE PROCEDURE ThongKe_CapNhatVaXoaSuKien
    @MaSK CHAR(5),
    @MaCLB CHAR(5),
    @MoTaMoi NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- 1. Cập nhật Mô tả CLB (VanUser có quyền UPDATE trên CLB)
        UPDATE CLB
        SET MoTa = @MoTaMoi
        WHERE MaCLB = @MaCLB;
        
        -- 2. Xóa Sự kiện (VanUser có quyền DELETE trên SuKien)
        DELETE FROM SuKien 
        WHERE MaSK = @MaSK;
        
        -- Nếu cả hai thao tác thành công, cam kết giao dịch
        COMMIT TRANSACTION;
        PRINT N'Giao dịch thành công: Đã cập nhật CLB và xóa Sự kiện.';
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi xảy ra, hủy bỏ mọi thay đổi
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        PRINT N'Giao dịch thất bại: Đã xảy ra lỗi.';
        -- Có thể dùng RAISERROR để thông báo lỗi chi tiết
        THROW;
    END CATCH
END;
GO


GRANT EXECUTE ON ThongKe_CapNhatVaXoaSuKien TO Role_ThongKe;
GO

-- Kiểm tra dữ liệu hiện tại
SELECT * FROM SuKien WHERE MaSK = 'SK05';
SELECT MoTa FROM CLB WHERE MaCLB = 'CLB05';

-- Thực thi Transaction (Xóa SK05 và Cập nhật CLB05)
EXEC ThongKe_CapNhatVaXoaSuKien 
    @MaSK = 'SK05', 
    @MaCLB = 'CLB05', 
    @MoTaMoi = N'CLB Tiếng Anh đã hoàn thành sự kiện cũ.';

-- Kiểm tra kết quả (SK05 sẽ bị xóa, MoTa CLB05 sẽ được cập nhật)
SELECT * FROM SuKien WHERE MaSK = 'SK05';
SELECT MoTa FROM CLB WHERE MaCLB = 'CLB05';



--=======================HOÀNG TRUNG NGUYÊN=========================


--=====================================HOÀNG TRUNG NGUYÊN=====================================

---1 Thêm nhà tài trợ vào sự kiện, cập nhật tổng tiền tài trợ
ALTER TABLE SuKien ADD TongTaiTro DECIMAL(18,2) DEFAULT 0;
GO

CREATE PROCEDURE sp_ThemTaiTroSuKien
    @MaNTT CHAR(5),
    @MaSK CHAR(5),
    @SoTien DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO TaiTroSuKien(MaNTT, MaSK, SoTienTaiTro)
        VALUES (@MaNTT, @MaSK, @SoTien);

        UPDATE SuKien
        SET TongTaiTro = TongTaiTro + @SoTien
        WHERE MaSK = @MaSK;

        COMMIT;
        PRINT N'Thêm tài trợ thành công!';
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT N'Lỗi khi thêm tài trợ!';
    END CATCH
END;

-- 1.1: Gọi proc thêm tài trợ (chọn cặp MaNTT/MaSK chưa tồn tại trong TaiTroSuKien)
EXEC sp_ThemTaiTroSuKien @MaNTT='NTT01', @MaSK='SK02', @SoTien=1500000.00;

---- 1.2: Kiểm tra
--SELECT * FROM TaiTroSuKien WHERE MaSK='SK02';
--SELECT MaSK, TongTaiTro FROM SuKien WHERE MaSK='SK02';
--SELECT dbo.fn_TongTaiTroSuKien('SK02') AS TongTinhToan;



-----2 Tính tổng số tiền tài trợ của một sự kiện
go
CREATE FUNCTION fn_TongTaiTroSuKien(@MaSK CHAR(5))
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Tong DECIMAL(18,2);
    SELECT @Tong = SUM(SoTienTaiTro)
    FROM TaiTroSuKien
    WHERE MaSK = @MaSK;
    RETURN ISNULL(@Tong,0);
END;

-- Gọi trực tiếp
SELECT dbo.fn_TongTaiTroSuKien('SK01') AS TongSK01;




----3  Khi thêm thành viên vào CLB, nếu số lượng thành viên vượt quá giới hạn (ví dụ 100) thì rollback
go
CREATE TRIGGER trg_GioiHanThanhVienCLB
ON ThamGiaCLB
AFTER INSERT
AS
BEGIN
    DECLARE @MaCLB CHAR(5);
    SELECT @MaCLB = MaCLB FROM Inserted;

    IF (SELECT COUNT(*) FROM ThamGiaCLB WHERE MaCLB = @MaCLB) > 100
    BEGIN
        ROLLBACK;
        PRINT N'Không thể thêm: CLB đã đủ 100 thành viên!';
    END
END;
-- 3.1: Chèn nhiều người vào CLB01 (nhiều hàng) để vượt quá 100
INSERT INTO ThamGiaCLB (MaSV, MaCLB, TenVaiTro)
SELECT MaSV, 'CLB01', N'Thành viên'
FROM ThanhVien
WHERE MaSV >= 'SV006' AND MaSV <= 'SV110';


---4  Duyệt qua từng CLB để tìm ra CLB có số thành viên nhiều nhất.
go
DECLARE @MaCLB CHAR(5), @TenCLB NVARCHAR(100), @SoLuong INT;
DECLARE @MaxCLB NVARCHAR(100), @MaxSoLuong INT = 0;

DECLARE curCLB CURSOR FOR
    SELECT MaCLB, TenCLB FROM CLB;

OPEN curCLB;
FETCH NEXT FROM curCLB INTO @MaCLB, @TenCLB;

WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @SoLuong = COUNT(*) 
    FROM ThamGiaCLB 
    WHERE MaCLB = @MaCLB;

    IF @SoLuong > @MaxSoLuong
    BEGIN
        SET @MaxSoLuong = @SoLuong;
        SET @MaxCLB = @TenCLB;
    END

    FETCH NEXT FROM curCLB INTO @MaCLB, @TenCLB;
END

CLOSE curCLB;
DEALLOCATE curCLB;

PRINT N'CLB có nhiều thành viên nhất: ' + @MaxCLB 
      + N' với ' + CAST(@MaxSoLuong AS NVARCHAR) + N' thành viên';

-- Set-based (khuyến nghị)
SELECT TOP(1) c.MaCLB, c.TenCLB, COUNT(t.MaSV) AS SoLuong
FROM CLB c
LEFT JOIN ThamGiaCLB t ON c.MaCLB = t.MaCLB
GROUP BY c.MaCLB, c.TenCLB
ORDER BY SoLuong DESC;



---5  Khi đăng ký nhiều sinh viên tham dự một sự kiện (batch insert), nếu có 1 người bị lỗi thì rollback hết.
go
CREATE PROCEDURE sp_DangKyNhieuSVSuKien
    @MaSK CHAR(5)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Ví dụ: thêm nhiều SV cố định (có thể thay bằng table parameter)
        INSERT INTO ThamDuSuKien(MaSV, MaSK, VaiTroTrongSuKien)
        VALUES ('SV001', @MaSK, N'Tham gia'),
               ('SV002', @MaSK, N'Tham gia'),
               ('SV003', @MaSK, N'Tham gia');

        COMMIT;
        PRINT N'Đăng ký thành công cho nhiều sinh viên!';
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT N'Lỗi! Toàn bộ batch bị hủy.';
    END CATCH
END;
-- Gọi proc (lưu ý: proc chèn SV001/SV002/SV003 với MaSK truyền vào)
EXEC sp_DangKyNhieuSVSuKien @MaSK='SK03';

-- Kiểm tra
SELECT * FROM ThamDuSuKien WHERE MaSK='SK03';








---===================TẠO USER VÀ CẤP QUYỀN===============================

USE QL_CLBvaDoiNhom;
GO

-- ==================== TẠO LOGIN Ở MASTER DATABASE ====================
USE master;
GO

-- Xóa login nếu đã tồn tại (để có thể chạy lại script)
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'Nguyen')
    DROP LOGIN Nguyen;
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'Hai')
    DROP LOGIN Hai;
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'Thuan')
    DROP LOGIN Thuan;
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'Chi')
    DROP LOGIN Chi;
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'Van')
    DROP LOGIN Van;
GO

CREATE LOGIN Nguyen WITH PASSWORD = 'Nguyen@123', CHECK_POLICY = ON;
CREATE LOGIN Hai    WITH PASSWORD = 'Hai@123',    CHECK_POLICY = ON;
CREATE LOGIN Thuan  WITH PASSWORD = 'Thuan@123',  CHECK_POLICY = ON;
CREATE LOGIN Chi    WITH PASSWORD = 'Chi@123',    CHECK_POLICY = ON;
CREATE LOGIN Van    WITH PASSWORD = 'Van@123',    CHECK_POLICY = ON;
GO

-- ==================== TẠO USER TRONG DATABASE QL_CLBvaDoiNhom ====================
USE QL_CLBvaDoiNhom;
GO

-- Xóa user nếu đã tồn tại
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'NguyenUser')
    DROP USER NguyenUser;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'HaiUser')
    DROP USER HaiUser;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'ThuanUser')
    DROP USER ThuanUser;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'ChiUser')
    DROP USER ChiUser;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'VanUser')
    DROP USER VanUser;
GO

CREATE USER NguyenUser FOR LOGIN Nguyen;
CREATE USER HaiUser    FOR LOGIN Hai;
CREATE USER ThuanUser  FOR LOGIN Thuan;
CREATE USER ChiUser    FOR LOGIN Chi;
CREATE USER VanUser    FOR LOGIN Van;
GO

-- ==================== TẠO CÁC ROLE ====================
-- Xóa role nếu đã tồn tại
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'Role_Admin' AND type = 'R')
    DROP ROLE Role_Admin;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'Role_QLCLB' AND type = 'R')
    DROP ROLE Role_QLCLB;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'Role_QLSuKien' AND type = 'R')
    DROP ROLE Role_QLSuKien;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'Role_HoTro' AND type = 'R')
    DROP ROLE Role_HoTro;
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'Role_ThongKe' AND type = 'R')
    DROP ROLE Role_ThongKe;
GO

CREATE ROLE Role_Admin;
CREATE ROLE Role_QLCLB;
CREATE ROLE Role_QLSuKien;
CREATE ROLE Role_HoTro;
CREATE ROLE Role_ThongKe;
GO

-- ==================== GÁN QUYỀN CHO CÁC ROLE ====================

-- Role_Admin – Full quyền (db_owner)
ALTER ROLE db_owner ADD MEMBER NguyenUser;
-- Hoặc có thể dùng: GRANT CONTROL ON DATABASE::QL_CLBvaDoiNhom TO Role_Admin;
-- ALTER ROLE Role_Admin ADD MEMBER NguyenUser;
GO

-- Role_QLCLB – CRUD CLB và đội nhóm (Hải)
GRANT SELECT, INSERT, UPDATE, DELETE ON CLB     TO Role_QLCLB;
GRANT SELECT, INSERT, UPDATE, DELETE ON DoiNhom TO Role_QLCLB;
GO

-- Role_QLSuKien – CRUD sự kiện (Thuận)
GRANT SELECT, INSERT, UPDATE, DELETE ON SuKien TO Role_QLSuKien;
GO

-- Role_HoTro – CRUD CLB và đội nhóm, chỉ đọc sự kiện (Chi)
GRANT SELECT, INSERT, UPDATE ON CLB     TO Role_HoTro;
GRANT SELECT, INSERT, UPDATE ON DoiNhom TO Role_HoTro;
GRANT SELECT ON SuKien TO Role_HoTro;
GO

-- Role_ThongKe – Chỉ đọc + xem cấu trúc (Vân)
GRANT SELECT ON CLB     TO Role_ThongKe;
GRANT SELECT ON DoiNhom TO Role_ThongKe;
GRANT SELECT ON SuKien  TO Role_ThongKe;
GRANT VIEW DEFINITION TO Role_ThongKe;
GO

-- ==================== THÊM USER VÀO ROLE ====================
EXEC sp_addrolemember 'Role_QLCLB',      'HaiUser';
EXEC sp_addrolemember 'Role_QLSuKien',   'ThuanUser';
EXEC sp_addrolemember 'Role_HoTro',      'ChiUser';
EXEC sp_addrolemember 'Role_ThongKe',    'VanUser';
GO

-- Kiểm tra phân quyền
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






-- Gỡ db_owner
ALTER ROLE db_owner DROP MEMBER NguyenUser;

-- Gỡ khỏi các role custom
EXEC sp_droprolemember 'Role_Admin', 'NguyenUser';
EXEC sp_droprolemember 'Role_QLCLB', 'HaiUser';
EXEC sp_droprolemember 'Role_QLSuKien', 'ThuanUser';
EXEC sp_droprolemember 'Role_HoTro', 'ChiUser';
EXEC sp_droprolemember 'Role_ThongKe', 'VanUser';
GO


--drop role
USE QL_CLBvaDoiNhom;
GO
DROP ROLE Role_Admin;
DROP ROLE Role_QLCLB;
DROP ROLE Role_QLSuKien;
DROP ROLE Role_HoTro;
DROP ROLE Role_ThongKe;
GO

---- drop user
USE QL_CLBvaDoiNhom;
GO
DROP USER NguyenUser;
DROP USER HaiUser;
DROP USER ThuanUser;
DROP USER ChiUser;
DROP USER VanUser;
GO
--- Xóa login
USE master;
GO
DROP LOGIN Nguyen;
DROP LOGIN Hai;
DROP LOGIN Thuan;
DROP LOGIN Chi;
DROP LOGIN Van;
GO


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
ORDER BY dp.name;

