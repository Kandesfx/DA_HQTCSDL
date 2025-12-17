# HƯỚNG DẪN CHẠY ỨNG DỤNG

## Cách 1: Chạy riêng lẻ (Khuyến nghị cho Git Bash)

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```

## Cách 2: Dùng script bash (Git Bash)

```bash
chmod +x start-dev.sh
./start-dev.sh
```

## Cách 3: Dùng npm run dev (nếu đã cài concurrently)

```bash
npm install
npm run dev
```

**Lưu ý**: Nếu gặp lỗi với `npm run dev` trên Git Bash, hãy dùng **Cách 1** (chạy riêng lẻ).

## Kiểm tra

- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

## Cấu hình Database

Đảm bảo đã tạo file `.env` trong thư mục `backend` với thông tin SQL Server của bạn (xem `backend/env.example.txt`).

