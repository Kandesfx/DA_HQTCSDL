const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { closePool } = require('./config/db');
const sukienRoutes = require('./routes/sukien');
const clbRoutes = require('./routes/clb');
const doinhomRoutes = require('./routes/doinhom');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Public routes (không cần authentication)
app.use('/api/auth', authRoutes);

// Protected routes (cần authentication)
app.use('/api/sukien', sukienRoutes);
app.use('/api/clb', clbRoutes);
app.use('/api/doinhom', doinhomRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server đang hoạt động' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Lỗi không xử lý được:', err);
  res.status(500).json({ error: 'Lỗi server nội bộ' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nĐang tắt server...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nĐang tắt server...');
  await closePool();
  process.exit(0);
});

