-- ============================================================
-- CÁC CẤU TRÚC SQL CHO VAI TRÒ QUẢN LÝ CLB (Lê Vũ Hải)
-- Nhiệm vụ: CRUD bảng CLB và đội nhóm
-- ============================================================

USE QL_CLBvaDoiNhom;
GO

-- ============================================================
-- 1. STORED PROCEDURE: Thống kê CLB và số lượng đội nhóm
-- Mục đích: Quản lý CLB cần xem tổng quan tất cả CLB và số đội nhóm
-- ============================================================
IF OBJECT_ID('sp_QLCLB_ThongKeCLB', 'P') IS NOT NULL
    DROP PROCEDURE sp_QLCLB_ThongKeCLB;
GO

CREATE PROCEDURE sp_QLCLB_ThongKeCLB
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.MaCLB,
        c.TenCLB,
        c.NgayThanhLap,
        c.MoTa,
        COUNT(d.MaDoi) AS SoLuongDoiNhom,
        CASE 
            WHEN COUNT(d.MaDoi) = 0 THEN N'Chưa có đội nhóm'
            WHEN COUNT(d.MaDoi) < 3 THEN N'Ít đội nhóm'
            WHEN COUNT(d.MaDoi) >= 3 AND COUNT(d.MaDoi) < 5 THEN N'Trung bình'
            ELSE N'Nhiều đội nhóm'
        END AS TrangThai
    FROM CLB c
    LEFT JOIN DoiNhom d ON c.MaCLB = d.MaCLB
    GROUP BY c.MaCLB, c.TenCLB, c.NgayThanhLap, c.MoTa
    ORDER BY SoLuongDoiNhom DESC, c.TenCLB;
END;
GO

-- Cấp quyền cho Role_QLCLB
GRANT EXECUTE ON sp_QLCLB_ThongKeCLB TO Role_QLCLB;
GO

-- Test
-- EXEC sp_QLCLB_ThongKeCLB;
-- GO

-- ============================================================
-- 2. FUNCTION: Tính số lượng đội nhóm của một CLB
-- Mục đích: Dùng để hiển thị số lượng đội nhóm trong UI
-- ============================================================
IF OBJECT_ID('fn_QLCLB_SoLuongDoiNhom', 'FN') IS NOT NULL
    DROP FUNCTION fn_QLCLB_SoLuongDoiNhom;
GO

CREATE FUNCTION fn_QLCLB_SoLuongDoiNhom(@MaCLB CHAR(5))
RETURNS INT
AS
BEGIN
    DECLARE @SoLuong INT;
    
    SELECT @SoLuong = COUNT(*)
    FROM DoiNhom
    WHERE MaCLB = @MaCLB;
    
    RETURN ISNULL(@SoLuong, 0);
END;
GO

-- Cấp quyền cho Role_QLCLB
GRANT EXECUTE ON fn_QLCLB_SoLuongDoiNhom TO Role_QLCLB;
GO

-- Test
-- SELECT dbo.fn_QLCLB_SoLuongDoiNhom('CLB01') AS SoDoiNhom;
-- GO

-- ============================================================
-- 3. TRIGGER: Tự động cập nhật số lượng đội nhóm khi thêm/xóa
-- Mục đích: Đảm bảo tính nhất quán dữ liệu, tự động cập nhật
-- ============================================================

-- Tạo cột SoLuongDoiNhom trong bảng CLB (nếu chưa có)
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.CLB') 
    AND name = 'SoLuongDoiNhom'
)
BEGIN
    ALTER TABLE CLB
    ADD SoLuongDoiNhom INT DEFAULT 0;
    PRINT N'Đã thêm cột SoLuongDoiNhom vào bảng CLB';
END
GO

-- Cập nhật giá trị ban đầu
UPDATE CLB
SET SoLuongDoiNhom = dbo.fn_QLCLB_SoLuongDoiNhom(MaCLB);
GO

-- Xóa trigger cũ nếu tồn tại
IF OBJECT_ID('trg_QLCLB_UpdateSoLuongDoiNhom', 'TR') IS NOT NULL
    DROP TRIGGER trg_QLCLB_UpdateSoLuongDoiNhom;
GO

-- Tạo trigger
CREATE TRIGGER trg_QLCLB_UpdateSoLuongDoiNhom
ON DoiNhom
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Cập nhật khi INSERT
    IF EXISTS (SELECT * FROM inserted)
    BEGIN
        UPDATE CLB
        SET SoLuongDoiNhom = SoLuongDoiNhom + 1
        WHERE MaCLB IN (SELECT MaCLB FROM inserted);
    END
    
    -- Cập nhật khi DELETE
    IF EXISTS (SELECT * FROM deleted)
    BEGIN
        UPDATE CLB
        SET SoLuongDoiNhom = SoLuongDoiNhom - 1
        WHERE MaCLB IN (SELECT MaCLB FROM deleted);
    END
END;
GO

-- Test trigger
-- INSERT INTO DoiNhom (MaDoi, TenDoi, MaCLB, MoTa) VALUES ('TEST1', N'Test Đội', 'CLB01', N'Test');
-- SELECT MaCLB, TenCLB, SoLuongDoiNhom FROM CLB WHERE MaCLB = 'CLB01';
-- DELETE FROM DoiNhom WHERE MaDoi = 'TEST1';
-- SELECT MaCLB, TenCLB, SoLuongDoiNhom FROM CLB WHERE MaCLB = 'CLB01';
-- GO

-- ============================================================
-- 4. CURSOR: Tạo báo cáo tổng hợp CLB và đội nhóm
-- Mục đích: Duyệt qua các CLB để tạo báo cáo chi tiết
-- ============================================================
IF OBJECT_ID('sp_QLCLB_BaoCaoTongHop', 'P') IS NOT NULL
    DROP PROCEDURE sp_QLCLB_BaoCaoTongHop;
GO

CREATE PROCEDURE sp_QLCLB_BaoCaoTongHop
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Tạo bảng tạm để lưu kết quả
    CREATE TABLE #BaoCao (
        MaCLB CHAR(5),
        TenCLB NVARCHAR(100),
        SoDoiNhom INT,
        DanhSachDoiNhom NVARCHAR(MAX)
    );
    
    DECLARE @MaCLB CHAR(5);
    DECLARE @TenCLB NVARCHAR(100);
    DECLARE @SoDoiNhom INT;
    DECLARE @DanhSachDoiNhom NVARCHAR(MAX);
    DECLARE @TenDoi NVARCHAR(100);
    
    -- Khai báo cursor
    DECLARE cur_CLB CURSOR FOR
        SELECT MaCLB, TenCLB
        FROM CLB
        ORDER BY TenCLB;
    
    OPEN cur_CLB;
    FETCH NEXT FROM cur_CLB INTO @MaCLB, @TenCLB;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Tính số lượng đội nhóm
        SET @SoDoiNhom = dbo.fn_QLCLB_SoLuongDoiNhom(@MaCLB);
        
        -- Lấy danh sách đội nhóm
        SET @DanhSachDoiNhom = '';
        
        DECLARE cur_DoiNhom CURSOR FOR
            SELECT TenDoi
            FROM DoiNhom
            WHERE MaCLB = @MaCLB
            ORDER BY TenDoi;
        
        OPEN cur_DoiNhom;
        FETCH NEXT FROM cur_DoiNhom INTO @TenDoi;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            IF @DanhSachDoiNhom = ''
                SET @DanhSachDoiNhom = @TenDoi;
            ELSE
                SET @DanhSachDoiNhom = @DanhSachDoiNhom + N', ' + @TenDoi;
            
            FETCH NEXT FROM cur_DoiNhom INTO @TenDoi;
        END
        
        CLOSE cur_DoiNhom;
        DEALLOCATE cur_DoiNhom;
        
        -- Chèn vào bảng tạm
        INSERT INTO #BaoCao (MaCLB, TenCLB, SoDoiNhom, DanhSachDoiNhom)
        VALUES (@MaCLB, @TenCLB, @SoDoiNhom, ISNULL(@DanhSachDoiNhom, N'Chưa có đội nhóm'));
        
        FETCH NEXT FROM cur_CLB INTO @MaCLB, @TenCLB;
    END
    
    CLOSE cur_CLB;
    DEALLOCATE cur_CLB;
    
    -- Trả về kết quả
    SELECT * FROM #BaoCao ORDER BY SoDoiNhom DESC, TenCLB;
    
    DROP TABLE #BaoCao;
END;
GO

-- Cấp quyền cho Role_QLCLB
GRANT EXECUTE ON sp_QLCLB_BaoCaoTongHop TO Role_QLCLB;
GO

-- Test
-- EXEC sp_QLCLB_BaoCaoTongHop;
-- GO

-- ============================================================
-- 5. TRANSACTION: Tạo CLB mới kèm đội nhóm ban đầu
-- Mục đích: Đảm bảo tính toàn vẹn khi tạo CLB và đội nhóm cùng lúc
-- ============================================================
IF OBJECT_ID('sp_QLCLB_TaoCLBVoiDoiNhom', 'P') IS NOT NULL
    DROP PROCEDURE sp_QLCLB_TaoCLBVoiDoiNhom;
GO

CREATE PROCEDURE sp_QLCLB_TaoCLBVoiDoiNhom
    @MaCLB CHAR(5),
    @TenCLB NVARCHAR(100),
    @NgayThanhLap DATE = NULL,
    @MoTa NVARCHAR(200) = NULL,
    @MaDoiBanDau CHAR(5) = NULL,
    @TenDoiBanDau NVARCHAR(100) = NULL,
    @MoTaDoi NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Sử dụng BEGIN TRAN theo yêu cầu chấm điểm
        BEGIN TRAN;
        
        -- 1. Tạo CLB mới
        INSERT INTO CLB (MaCLB, TenCLB, NgayThanhLap, MoTa, SoLuongDoiNhom)
        VALUES (
            @MaCLB, 
            @TenCLB, 
            ISNULL(@NgayThanhLap, GETDATE()), 
            @MoTa,
            0  -- Sẽ được cập nhật bởi trigger
        );
        
        -- 2. Nếu có thông tin đội nhóm ban đầu, tạo luôn
        IF @MaDoiBanDau IS NOT NULL AND @TenDoiBanDau IS NOT NULL
        BEGIN
            INSERT INTO DoiNhom (MaDoi, TenDoi, MaCLB, MoTa)
            VALUES (@MaDoiBanDau, @TenDoiBanDau, @MaCLB, @MoTaDoi);
        END
        
        -- COMMIT theo yêu cầu chấm điểm
        COMMIT TRAN;
        
        SELECT 
            'Success' AS Status,
            N'Tạo CLB thành công' AS Message,
            @MaCLB AS MaCLB;
    END TRY
    BEGIN CATCH
        -- ROLLBACK theo yêu cầu chấm điểm
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        
        SELECT 
            'Error' AS Status,
            ERROR_MESSAGE() AS Message,
            @MaCLB AS MaCLB;
    END CATCH
END;
GO

-- Cấp quyền cho Role_QLCLB
GRANT EXECUTE ON sp_QLCLB_TaoCLBVoiDoiNhom TO Role_QLCLB;
GO

-- Test
-- EXEC sp_QLCLB_TaoCLBVoiDoiNhom 
--     @MaCLB = 'TEST1',
--     @TenCLB = N'CLB Test',
--     @MaDoiBanDau = 'DN01',
--     @TenDoiBanDau = N'Đội Test';
-- GO

-- ============================================================
-- TỔNG KẾT
-- ============================================================
PRINT N'Đã tạo xong các cấu trúc SQL cho Quản lý CLB:';
PRINT N'1. Procedure: sp_QLCLB_ThongKeCLB - Thống kê CLB và đội nhóm';
PRINT N'2. Function: fn_QLCLB_SoLuongDoiNhom - Tính số lượng đội nhóm';
PRINT N'3. Trigger: trg_QLCLB_UpdateSoLuongDoiNhom - Tự động cập nhật số lượng';
PRINT N'4. Cursor: sp_QLCLB_BaoCaoTongHop - Báo cáo tổng hợp (dùng cursor)';
PRINT N'5. Transaction: sp_QLCLB_TaoCLBVoiDoiNhom - Tạo CLB kèm đội nhóm';
GO

