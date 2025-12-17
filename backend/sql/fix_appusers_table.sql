-- Script nhanh để sửa bảng AppUsers
-- Chạy script này trong SQL Server Management Studio

USE QL_CLBvaDoiNhom;
GO

-- Xóa và tạo lại bảng AppUsers với đầy đủ cột
IF OBJECT_ID('dbo.AppUsers', 'U') IS NOT NULL
    DROP TABLE dbo.AppUsers;
GO

CREATE TABLE AppUsers (
    UserId INT IDENTITY PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) NOT NULL,  -- Role: Admin, QLCLB, QLSuKien, HoTro, ThongKe
    SQLUser NVARCHAR(50) NOT NULL -- Tên SQL Server User tương ứng
);
GO

INSERT INTO AppUsers (Username, Password, Role, SQLUser)
VALUES
('admin', '123456', 'Admin', 'NguyenUser'),
('hai',   '123',    'QLCLB', 'HaiUser'),
('thuan', '123',    'QLSuKien', 'ThuanUser'),
('chi',   '123',    'HoTro', 'ChiUser'),
('van',   '123',    'ThongKe', 'VanUser');
GO

-- Kiểm tra
SELECT * FROM AppUsers;
GO

PRINT N'Đã tạo lại bảng AppUsers thành công!';

