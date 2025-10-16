# Todo App - Backend API

Backend server cho ứng dụng quản lý công việc (Todo App) sử dụng Node.js, Express, MongoDB.

## 🚀 Tính năng

### ✅ Authentication (Xác thực)
- **POST** `/api/auth/register` - Đăng ký tài khoản mới
- **POST** `/api/auth/login` - Đăng nhập (trả về JWT token)

### ✅ Tasks Management (Quản lý công việc)
- **GET** `/api/tasks` - Lấy danh sách công việc của user
- **GET** `/api/tasks/:id` - Lấy chi tiết 1 công việc
- **POST** `/api/tasks` - Tạo công việc mới
- **PUT** `/api/tasks/:id` - Cập nhật công việc
- **DELETE** `/api/tasks/:id` - Xóa công việc

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 5.x (local hoặc MongoDB Atlas)
- npm hoặc yarn

## ⚙️ Cài đặt

### 1. Clone repository và cài dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Nội dung file `.env`:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/todoapp

# JWT Configuration
JWT_SECRET=todo-app-super-secret-jwt-key-2025-dev

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Khởi động MongoDB

**MongoDB Local:**
```bash
# macOS/Linux
sudo systemctl start mongodb

# Windows (nếu cài MongoDB service)
net start MongoDB

# Hoặc chạy mongod trực tiếp
mongod --dbpath /path/to/data
```

**MongoDB Atlas (Cloud):**
- Thay `MONGO_URI` bằng connection string từ MongoDB Atlas
- Ví dụ: `mongodb+srv://username:password@cluster.mongodb.net/todoapp`

### 4. Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['pending', 'in-progress', 'completed']),
  dueDate: Date,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. **Register**: Client gửi `username`, `email`, `password` → Server hash password → Lưu vào DB
2. **Login**: Client gửi `email`, `password` → Server verify → Trả về JWT token
3. **Protected Routes**: Client gửi token trong header `Authorization: Bearer <token>` → Server verify token → Cho phép truy cập

## 🧪 Test API (dùng cURL hoặc Postman)

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

Response:
```json
{
  "message": "Đăng nhập thành công.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "John Doe",
    "email": "john@example.com"
  }
}
```

### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Học Node.js",
    "description": "Hoàn thành tutorial Express",
    "status": "pending",
    "dueDate": "2025-10-20"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Task
```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "completed"
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛡️ Security Features

- ✅ Password hashing với bcrypt
- ✅ JWT token authentication
- ✅ Token expiration (1 hour)
- ✅ CORS protection
- ✅ Input validation
- ✅ User-specific data isolation (users chỉ thấy tasks của mình)

## 🐛 Troubleshooting

### Lỗi: "MongooseError: connect ECONNREFUSED"
**Nguyên nhân:** MongoDB chưa chạy hoặc connection string sai

**Giải pháp:**
- Kiểm tra MongoDB đang chạy: `mongo` hoặc `mongosh`
- Kiểm tra `MONGO_URI` trong `.env`

### Lỗi: "secretOrPrivateKey must have a value"
**Nguyên nhân:** Thiếu `JWT_SECRET` trong `.env`

**Giải pháp:**
- Thêm `JWT_SECRET=your-secret-key` vào file `.env`

### Lỗi: "Port 3000 already in use"
**Giải pháp:**
```bash
# Tìm và kill process đang dùng port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Hoặc đổi PORT trong .env
PORT=3001
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "status": 400,
  "message": "Mô tả lỗi"
}
```

## 🔄 Development Workflow

1. Chỉnh sửa code trong `src/`
2. Nodemon tự động restart server
3. Test API bằng Postman/Thunder Client/cURL
4. Kiểm tra logs trong terminal
5. Kiểm tra data trong MongoDB Compass hoặc `mongosh`

## 📚 Project Structure

```
backend/
├── server.js               # Entry point
├── .env                    # Environment variables
├── .env.example           # Template for .env
├── package.json
└── src/
    ├── config/
    │   └── db.js          # MongoDB connection
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.js   # Login, Register logic
    │   │   ├── auth.middleware.js   # JWT verification
    │   │   ├── auth.model.js        # User schema
    │   │   └── auth.router.js       # Auth routes
    │   └── task/
    │       ├── task.controller.js   # CRUD logic
    │       ├── task.model.js        # Task schema
    │       └── task.route.js        # Task routes
    └── utils/
        └── error.js        # Error helper
```

## ✅ Verification Checklist

- [ ] MongoDB đang chạy
- [ ] File `.env` đã được tạo và cấu hình đúng
- [ ] Dependencies đã được cài (`npm install`)
- [ ] Server khởi động thành công (`npm run dev`)
- [ ] Register API hoạt động (test bằng cURL/Postman)
- [ ] Login API trả về token
- [ ] Task CRUD APIs hoạt động với token
- [ ] Frontend có thể kết nối tới backend

## 👨‍💻 Author

Backend API cho Todo App - 2025
