-- Migration script để thêm cột Role và SQLUser vào bảng AppUsers
-- Chạy script này nếu bảng AppUsers đã tồn tại nhưng thiếu các cột này

USE QL_CLBvaDoiNhom;
GO

-- Kiểm tra và thêm cột Role nếu chưa tồn tại
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.AppUsers') 
    AND name = 'Role'
)
BEGIN
    ALTER TABLE AppUsers
    ADD Role NVARCHAR(50) NULL;
    PRINT N'Đã thêm cột Role';
END
ELSE
BEGIN
    PRINT N'Cột Role đã tồn tại';
END
GO

-- Kiểm tra và thêm cột SQLUser nếu chưa tồn tại
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.AppUsers') 
    AND name = 'SQLUser'
)
BEGIN
    ALTER TABLE AppUsers
    ADD SQLUser NVARCHAR(50) NULL;
    PRINT N'Đã thêm cột SQLUser';
END
ELSE
BEGIN
    PRINT N'Cột SQLUser đã tồn tại';
END
GO

-- Cập nhật dữ liệu cho các user hiện có nếu các cột vừa được thêm
UPDATE AppUsers SET Role = 'Admin', SQLUser = 'NguyenUser' WHERE Username = 'admin' AND (Role IS NULL OR SQLUser IS NULL);
UPDATE AppUsers SET Role = 'QLCLB', SQLUser = 'HaiUser' WHERE Username = 'hai' AND (Role IS NULL OR SQLUser IS NULL);
UPDATE AppUsers SET Role = 'QLSuKien', SQLUser = 'ThuanUser' WHERE Username = 'thuan' AND (Role IS NULL OR SQLUser IS NULL);
UPDATE AppUsers SET Role = 'HoTro', SQLUser = 'ChiUser' WHERE Username = 'chi' AND (Role IS NULL OR SQLUser IS NULL);
UPDATE AppUsers SET Role = 'ThongKe', SQLUser = 'VanUser' WHERE Username = 'van' AND (Role IS NULL OR SQLUser IS NULL);
GO

-- Đặt NOT NULL cho các cột sau khi đã cập nhật dữ liệu
IF EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.AppUsers') 
    AND name = 'Role'
    AND is_nullable = 1
)
BEGIN
    -- Kiểm tra xem có giá trị NULL không
    IF NOT EXISTS (SELECT * FROM AppUsers WHERE Role IS NULL)
    BEGIN
        ALTER TABLE AppUsers
        ALTER COLUMN Role NVARCHAR(50) NOT NULL;
        PRINT N'Đã đặt NOT NULL cho cột Role';
    END
    ELSE
    BEGIN
        PRINT N'Cảnh báo: Vẫn còn giá trị NULL trong cột Role, không thể đặt NOT NULL';
    END
END
GO

IF EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.AppUsers') 
    AND name = 'SQLUser'
    AND is_nullable = 1
)
BEGIN
    -- Kiểm tra xem có giá trị NULL không
    IF NOT EXISTS (SELECT * FROM AppUsers WHERE SQLUser IS NULL)
    BEGIN
        ALTER TABLE AppUsers
        ALTER COLUMN SQLUser NVARCHAR(50) NOT NULL;
        PRINT N'Đã đặt NOT NULL cho cột SQLUser';
    END
    ELSE
    BEGIN
        PRINT N'Cảnh báo: Vẫn còn giá trị NULL trong cột SQLUser, không thể đặt NOT NULL';
    END
END
GO

-- Kiểm tra kết quả
SELECT 
    UserId,
    Username,
    Password,
    Role,
    SQLUser
FROM AppUsers;
GO

PRINT N'Migration hoàn tất!';

