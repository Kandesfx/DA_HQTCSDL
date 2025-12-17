-- ============================================================
-- DEMO TRANSACTION & LOCKING CHO QUẢN LÝ CLB
-- Yêu cầu: Minh họa BEGIN TRAN, COMMIT, ROLLBACK và Locking
-- ============================================================

USE QL_CLBvaDoiNhom;
GO

-- ============================================================
-- 1. DEMO TRANSACTION VỚI BEGIN TRAN / COMMIT / ROLLBACK
-- ============================================================

-- Scenario: Cập nhật thông tin CLB và tất cả đội nhóm của CLB đó
-- Nếu có lỗi ở bất kỳ bước nào, rollback toàn bộ

IF OBJECT_ID('sp_QLCLB_DemoTransaction', 'P') IS NOT NULL
    DROP PROCEDURE sp_QLCLB_DemoTransaction;
GO

CREATE PROCEDURE sp_QLCLB_DemoTransaction
    @MaCLB CHAR(5),
    @TenCLBMoi NVARCHAR(100) = NULL,
    @MoTaMoi NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    PRINT N'=== DEMO TRANSACTION ===';
    PRINT N'Bắt đầu transaction với BEGIN TRAN';
    
    -- Bắt đầu transaction (theo yêu cầu chấm điểm)
    BEGIN TRAN;
    
    BEGIN TRY
        -- 1. Cập nhật thông tin CLB
        IF @TenCLBMoi IS NOT NULL OR @MoTaMoi IS NOT NULL
        BEGIN
            PRINT N'Bước 1: Cập nhật thông tin CLB...';
            
            UPDATE CLB
            SET 
                TenCLB = ISNULL(@TenCLBMoi, TenCLB),
                MoTa = ISNULL(@MoTaMoi, MoTa)
            WHERE MaCLB = @MaCLB;
            
            IF @@ROWCOUNT = 0
            BEGIN
                RAISERROR(N'Không tìm thấy CLB với mã: %s', 16, 1, @MaCLB);
            END
            
            PRINT N'✓ Cập nhật CLB thành công';
        END
        
        -- 2. Cập nhật mô tả cho tất cả đội nhóm của CLB
        PRINT N'Bước 2: Cập nhật mô tả cho tất cả đội nhóm...';
        
        UPDATE DoiNhom
        SET MoTa = N'Đã được cập nhật bởi transaction - ' + CONVERT(NVARCHAR, GETDATE(), 120)
        WHERE MaCLB = @MaCLB;
        
        PRINT N'✓ Cập nhật ' + CAST(@@ROWCOUNT AS NVARCHAR) + N' đội nhóm thành công';
        
        -- 3. Kiểm tra tính hợp lệ (ví dụ: số lượng đội nhóm không được âm)
        DECLARE @SoLuong INT;
        SELECT @SoLuong = COUNT(*) FROM DoiNhom WHERE MaCLB = @MaCLB;
        
        IF @SoLuong < 0
        BEGIN
            RAISERROR(N'Dữ liệu không hợp lệ: Số lượng đội nhóm không thể âm', 16, 1);
        END
        
        -- Nếu tất cả thành công, COMMIT
        PRINT N'✓ Tất cả các bước thành công';
        PRINT N'Thực hiện COMMIT TRAN...';
        
        COMMIT TRAN;
        
        PRINT N'✓ Transaction đã được COMMIT thành công';
        
        SELECT 
            'Success' AS Status,
            N'Cập nhật thành công' AS Message,
            @MaCLB AS MaCLB,
            @SoLuong AS SoLuongDoiNhom;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, ROLLBACK
        PRINT N'✗ Có lỗi xảy ra: ' + ERROR_MESSAGE();
        PRINT N'Thực hiện ROLLBACK TRAN...';
        
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        
        PRINT N'✓ Transaction đã được ROLLBACK';
        
        SELECT 
            'Error' AS Status,
            ERROR_MESSAGE() AS Message,
            @MaCLB AS MaCLB;
    END CATCH
END;
GO

-- Cấp quyền
GRANT EXECUTE ON sp_QLCLB_DemoTransaction TO Role_QLCLB;
GO

-- ============================================================
-- 2. DEMO LOCKING VÀ ISOLATION LEVELS
-- ============================================================

-- Tạo procedure để demo locking
IF OBJECT_ID('sp_QLCLB_DemoLocking', 'P') IS NOT NULL
    DROP PROCEDURE sp_QLCLB_DemoLocking;
GO

CREATE PROCEDURE sp_QLCLB_DemoLocking
    @IsolationLevel NVARCHAR(50) = 'READ COMMITTED'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @SQL NVARCHAR(MAX);
    
    -- Thiết lập isolation level
    SET @SQL = N'SET TRANSACTION ISOLATION LEVEL ' + @IsolationLevel;
    EXEC sp_executesql @SQL;
    
    PRINT N'=== DEMO LOCKING ===';
    PRINT N'Isolation Level: ' + @IsolationLevel;
    PRINT N'Bắt đầu transaction...';
    
    BEGIN TRAN;
    
    BEGIN TRY
        -- Đọc dữ liệu (sẽ tạo shared lock)
        PRINT N'Bước 1: Đọc dữ liệu CLB (Shared Lock)...';
        SELECT * FROM CLB WHERE MaCLB = 'CLB01';
        
        -- Đợi 5 giây để có thể test locking từ session khác
        PRINT N'Bước 2: Đợi 5 giây (giữ lock)...';
        WAITFOR DELAY '00:00:05';
        
        -- Cập nhật dữ liệu (sẽ tạo exclusive lock)
        PRINT N'Bước 3: Cập nhật dữ liệu (Exclusive Lock)...';
        UPDATE CLB 
        SET MoTa = N'Đã cập nhật bởi demo locking - ' + CONVERT(NVARCHAR, GETDATE(), 120)
        WHERE MaCLB = 'CLB01';
        
        COMMIT TRAN;
        
        PRINT N'✓ Transaction hoàn tất';
        
        SELECT 
            'Success' AS Status,
            N'Demo locking thành công với Isolation Level: ' + @IsolationLevel AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;
        
        SELECT 
            'Error' AS Status,
            ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

-- Cấp quyền
GRANT EXECUTE ON sp_QLCLB_DemoLocking TO Role_QLCLB;
GO

-- ============================================================
-- 3. HƯỚNG DẪN DEMO LOCKING
-- ============================================================

/*
=== HƯỚNG DẪN DEMO LOCKING ===

1. DEMO READ COMMITTED (Default):
   - Mở 2 cửa sổ SQL Server Management Studio
   - Cửa sổ 1: EXEC sp_QLCLB_DemoLocking @IsolationLevel = 'READ COMMITTED';
   - Cửa sổ 2: Trong khi cửa sổ 1 đang chạy, thử UPDATE CLB WHERE MaCLB = 'CLB01';
   - Kết quả: Cửa sổ 2 sẽ phải đợi cửa sổ 1 commit mới được thực hiện

2. DEMO SERIALIZABLE:
   - Cửa sổ 1: EXEC sp_QLCLB_DemoLocking @IsolationLevel = 'SERIALIZABLE';
   - Cửa sổ 2: Trong khi cửa sổ 1 đang chạy, thử SELECT * FROM CLB;
   - Kết quả: Cửa sổ 2 sẽ phải đợi (phantom read prevention)

3. DEMO DEADLOCK:
   - Cửa sổ 1: BEGIN TRAN; UPDATE CLB SET MoTa = '1' WHERE MaCLB = 'CLB01';
   - Cửa sổ 2: BEGIN TRAN; UPDATE CLB SET MoTa = '2' WHERE MaCLB = 'CLB02';
   - Cửa sổ 1: UPDATE CLB SET MoTa = '1' WHERE MaCLB = 'CLB02'; (đợi)
   - Cửa sổ 2: UPDATE CLB SET MoTa = '2' WHERE MaCLB = 'CLB01'; (deadlock!)
   - SQL Server sẽ tự động rollback một trong hai transaction

4. XEM LOCKS HIỆN TẠI:
   SELECT 
       request_session_id,
       resource_type,
       resource_database_id,
       request_mode,
       request_status
   FROM sys.dm_tran_locks
   WHERE resource_database_id = DB_ID('QL_CLBvaDoiNhom');
*/

-- ============================================================
-- 4. TEST TRANSACTION
-- ============================================================

-- Test thành công
-- EXEC sp_QLCLB_DemoTransaction @MaCLB = 'CLB01', @TenCLBMoi = N'CLB Đã Cập Nhật';

-- Test rollback (CLB không tồn tại)
-- EXEC sp_QLCLB_DemoTransaction @MaCLB = 'CLB99', @TenCLBMoi = N'CLB Không Tồn Tại';

PRINT N'Đã tạo xong các procedure demo Transaction & Locking';
GO

