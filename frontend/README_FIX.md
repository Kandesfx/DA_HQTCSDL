# Sửa lỗi allowedHosts

Đã xóa cấu hình `proxy` trong package.json vì API đã được cấu hình với baseURL trực tiếp.

## Cách chạy lại:

1. Dừng server hiện tại (Ctrl+C)

2. Xóa cache và chạy lại:
```bash
rm -rf node_modules/.cache
npm start
```

Hoặc đơn giản chỉ cần chạy lại:
```bash
npm start
```

## Lưu ý:

- API đã được cấu hình trong `src/services/api.js` với baseURL: `http://localhost:5000/api`
- Không cần proxy nữa
- Đảm bảo backend đang chạy tại port 5000

