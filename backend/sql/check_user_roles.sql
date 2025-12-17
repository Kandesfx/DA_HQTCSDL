-- ============================================================
-- SCRIPT KIỂM TRA VÀ SỬA QUYỀN CHO CÁC USER
-- Chạy script này để kiểm tra xem các user đã được gán role chưa
-- ============================================================

USE QL_CLBvaDoiNhom;
GO

-- Kiểm tra các user và role hiện tại
PRINT N'=== KIỂM TRA USER VÀ ROLE ===';
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

-- Kiểm tra từng user cụ thể
PRINT N'=== KIỂM TRA HAIUSER ===';
SELECT 
    dp.name AS UserName,
    rp.name AS RoleName
FROM sys.database_role_members drm
JOIN sys.database_principals rp 
    ON drm.role_principal_id = rp.principal_id
JOIN sys.database_principals dp 
    ON drm.member_principal_id = dp.principal_id
WHERE dp.name = 'HaiUser';
GO

-- Kiểm tra bằng IS_MEMBER (cách này user có thể tự kiểm tra)
PRINT N'=== KIỂM TRA BẰNG IS_MEMBER (Cần chạy với quyền của từng user) ===';
-- Chạy với quyền của HaiUser:
-- EXECUTE AS USER = 'HaiUser';
-- SELECT 
--     IS_MEMBER('Role_QLCLB') AS IsQLCLB,
--     IS_MEMBER('Role_Admin') AS IsAdmin,
--     IS_MEMBER('db_owner') AS IsDbOwner;
-- REVERT;

-- Nếu HaiUser chưa có role, thêm vào
PRINT N'=== SỬA QUYỀN NẾU THIẾU ===';

-- Kiểm tra và thêm HaiUser vào Role_QLCLB nếu chưa có
IF NOT EXISTS (
    SELECT 1 
    FROM sys.database_role_members drm
    JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
    JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
    WHERE dp.name = 'HaiUser' AND rp.name = 'Role_QLCLB'
)
BEGIN
    EXEC sp_addrolemember 'Role_QLCLB', 'HaiUser';
    PRINT N'Đã thêm HaiUser vào Role_QLCLB';
END
ELSE
BEGIN
    PRINT N'HaiUser đã có trong Role_QLCLB';
END
GO

-- Kiểm tra và thêm ThuanUser vào Role_QLSuKien nếu chưa có
IF NOT EXISTS (
    SELECT 1 
    FROM sys.database_role_members drm
    JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
    JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
    WHERE dp.name = 'ThuanUser' AND rp.name = 'Role_QLSuKien'
)
BEGIN
    EXEC sp_addrolemember 'Role_QLSuKien', 'ThuanUser';
    PRINT N'Đã thêm ThuanUser vào Role_QLSuKien';
END
ELSE
BEGIN
    PRINT N'ThuanUser đã có trong Role_QLSuKien';
END
GO

-- Kiểm tra và thêm ChiUser vào Role_HoTro nếu chưa có
IF NOT EXISTS (
    SELECT 1 
    FROM sys.database_role_members drm
    JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
    JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
    WHERE dp.name = 'ChiUser' AND rp.name = 'Role_HoTro'
)
BEGIN
    EXEC sp_addrolemember 'Role_HoTro', 'ChiUser';
    PRINT N'Đã thêm ChiUser vào Role_HoTro';
END
ELSE
BEGIN
    PRINT N'ChiUser đã có trong Role_HoTro';
END
GO

-- Kiểm tra và thêm VanUser vào Role_ThongKe nếu chưa có
IF NOT EXISTS (
    SELECT 1 
    FROM sys.database_role_members drm
    JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
    JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
    WHERE dp.name = 'VanUser' AND rp.name = 'Role_ThongKe'
)
BEGIN
    EXEC sp_addrolemember 'Role_ThongKe', 'VanUser';
    PRINT N'Đã thêm VanUser vào Role_ThongKe';
END
ELSE
BEGIN
    PRINT N'VanUser đã có trong Role_ThongKe';
END
GO

-- Kiểm tra NguyenUser có db_owner không
IF IS_MEMBER('db_owner') = 1
BEGIN
    PRINT N'NguyenUser có quyền db_owner (Admin)';
END
ELSE
BEGIN
    -- Nếu không có db_owner, thêm vào Role_Admin (nếu có)
    IF EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'Role_Admin' AND type = 'R')
    BEGIN
        IF NOT EXISTS (
            SELECT 1 
            FROM sys.database_role_members drm
            JOIN sys.database_principals rp ON drm.role_principal_id = rp.principal_id
            JOIN sys.database_principals dp ON drm.member_principal_id = dp.principal_id
            WHERE dp.name = 'NguyenUser' AND rp.name = 'Role_Admin'
        )
        BEGIN
            EXEC sp_addrolemember 'Role_Admin', 'NguyenUser';
            PRINT N'Đã thêm NguyenUser vào Role_Admin';
        END
    END
END
GO

-- Kiểm tra lại sau khi sửa
PRINT N'=== KẾT QUẢ SAU KHI SỬA ===';
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

PRINT N'Hoàn tất kiểm tra và sửa quyền!';

