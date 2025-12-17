#!/bin/bash

# Script để chạy backend và frontend đồng thời trên Git Bash

echo "🚀 Đang khởi động Backend và Frontend..."

# Chạy backend trong background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Đợi một chút để backend khởi động
sleep 2

# Chạy frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Backend đang chạy (PID: $BACKEND_PID)"
echo "✅ Frontend đang chạy (PID: $FRONTEND_PID)"
echo ""
echo "Nhấn Ctrl+C để dừng cả hai..."

# Đợi cho đến khi nhận tín hiệu dừng
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait

