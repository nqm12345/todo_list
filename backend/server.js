import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/modules/auth/auth.router.js';
import taskRoutes from './src/modules/task/task.route.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Server đang chạy...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message;
  
  // Xử lý các lỗi mặc định của hệ thống
  if (message === 'You are not authenticated') {
    message = 'Vui lòng đăng nhập để thực hiện chức năng này';
  } else if (message === 'Token is not valid') {
    message = 'Token không hợp lệ hoặc đã hết hạn';
  } else if (status === 401 && !message) {
    message = 'Vui lòng đăng nhập để thực hiện chức năng này';
  } else if (status === 403 && !message) {
    message = 'Bạn không có quyền thực hiện chức năng này';
  } else if (status === 404 && !message) {
    message = 'Không tìm thấy tài nguyên yêu cầu';
  } else if (!message) {
    message = 'Đã xảy ra lỗi, vui lòng thử lại';
  }

  res.status(status).json({
    success: false,
    status,
    message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đã sẵn sàng tại http://localhost:${PORT}`);
});
