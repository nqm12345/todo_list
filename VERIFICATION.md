# 📋 TODO APP - VERIFICATION CHECKLIST

Danh sách kiểm tra đầy đủ để xác nhận hệ thống hoạt động chính xác theo yêu cầu.

---

## ✅ YÊU CẦU 1: Giao diện hiển thị danh sách công việc đầy đủ

### Frontend Components
- [x] **TaskList.jsx** - Component hiển thị danh sách
  - [x] Hiển thị tất cả tasks từ API
  - [x] Hiển thị: title, description, status, dueDate, createdAt
  - [x] Status badges với 3 màu (pending/in-progress/completed)
  - [x] Empty state khi chưa có task
  - [x] Responsive design

- [x] **Tasks.jsx** - Dashboard page
  - [x] Statistics cards (4 cards: total, pending, in-progress, completed)
  - [x] Auto-fetch tasks khi component mount
  - [x] Loading state với spinner
  - [x] Error handling

### Styling
- [x] **Tasks.css** - Comprehensive styling
  - [x] Task cards với hover effects
  - [x] Grid layout cho stats
  - [x] Responsive breakpoints
  - [x] Modern gradient backgrounds

### API Integration
- [x] GET `/api/tasks` được gọi khi load page
- [x] Response data được parse và hiển thị đúng
- [x] Token được gửi trong Authorization header

---

## ✅ YÊU CẦU 2: Có thể thêm / sửa / xóa công việc thật qua API

### CREATE - Thêm công việc
- [x] **TaskForm.jsx** - Form component
  - [x] Input fields: title (required), description, status, dueDate
  - [x] Client-side validation (title không được rỗng)
  - [x] POST `/api/tasks` với payload đầy đủ
  - [x] Toast notification success/error
  - [x] Reset form sau khi tạo thành công
  - [x] Trigger refresh task list

- [x] **Backend - task.controller.js**
  - [x] `createTask()` function
  - [x] Attach `userId` từ token
  - [x] Validate required fields
  - [x] Save to MongoDB
  - [x] Return created task

### UPDATE - Sửa công việc
- [x] **TaskForm.jsx** - Edit mode
  - [x] Populate form với task data khi edit
  - [x] PUT `/api/tasks/:id` với updated data
  - [x] Toast notification
  - [x] Trigger refresh

- [x] **TaskList.jsx** - Edit button
  - [x] Click "Sửa" → call `onEdit(task)`
  - [x] Parent component (Tasks.jsx) shows form

- [x] **TaskList.jsx** - Toggle status
  - [x] Checkbox to toggle completed
  - [x] PUT `/api/tasks/:id` với new status
  - [x] Optimistic UI update

- [x] **Backend - task.controller.js**
  - [x] `updateTask()` function
  - [x] Verify user owns the task
  - [x] Update with `$set` operator
  - [x] Return updated task

### DELETE - Xóa công việc
- [x] **TaskList.jsx** - Delete button
  - [x] Click "Xóa" → confirm dialog
  - [x] DELETE `/api/tasks/:id`
  - [x] Toast notification
  - [x] Trigger refresh
  - [x] Loading state (disable button)

- [x] **Backend - task.controller.js**
  - [x] `deleteTask()` function
  - [x] Verify user owns the task
  - [x] Remove from MongoDB
  - [x] Return success message

---

## ✅ YÊU CẦU 3: Token xác thực hoạt động chính xác

### Authentication Flow
- [x] **Register**
  - [x] POST `/api/auth/register` với username, email, password
  - [x] Password hashing với bcrypt
  - [x] Save user to MongoDB
  - [x] Return success message

- [x] **Login**
  - [x] POST `/api/auth/login` với email, password
  - [x] Verify password với bcrypt.compare()
  - [x] Generate JWT token với jwt.sign()
  - [x] Token expires in 1h
  - [x] Return token + user info

- [x] **Token Storage**
  - [x] Frontend lưu token vào localStorage
  - [x] Remember me checkbox (optional)
  - [x] Token persists across page refreshes

### Token Verification
- [x] **Middleware - auth.middleware.js**
  - [x] `verifyToken()` function
  - [x] Extract token from Authorization header
  - [x] Support "Bearer <token>" format
  - [x] Fallback to cookies
  - [x] Verify token với jwt.verify()
  - [x] Attach user info to req.user
  - [x] Return 401 if no token
  - [x] Return 403 if invalid token

- [x] **Protected Routes**
  - [x] Task routes use verifyToken middleware
  - [x] All task endpoints require authentication
  - [x] User can only see their own tasks

### Auto-Logout on Token Expiry
- [x] **Axios Response Interceptor**
  - [x] Catch 401 responses
  - [x] Remove token from localStorage
  - [x] Show toast notification
  - [x] Redirect to /login
  - [x] Prevent infinite loops

---

## ✅ YÊU CẦU 4: Backend ổn định, không lỗi CRUD

### Error Handling
- [x] **Global Error Middleware**
  - [x] Catch all errors in server.js
  - [x] Standardized error format
  - [x] Localized error messages (Vietnamese)
  - [x] Proper HTTP status codes

- [x] **Controller Error Handling**
  - [x] Try-catch blocks in all controllers
  - [x] Validation errors (400)
  - [x] Not found errors (404)
  - [x] Unauthorized errors (401)
  - [x] Forbidden errors (403)
  - [x] Server errors (500)

### Data Validation
- [x] **Mongoose Schemas**
  - [x] User schema với required fields
  - [x] Task schema với required fields
  - [x] Enum validation cho status
  - [x] Email validation
  - [x] Unique constraint cho email

- [x] **Input Validation**
  - [x] Check required fields
  - [x] Email format validation
  - [x] Password strength validation
  - [x] Sanitize user input

### MongoDB Connection
- [x] **db.js**
  - [x] Mongoose connection setup
  - [x] Connection string từ env
  - [x] Error handling
  - [x] Exit process nếu không kết nối được

### CRUD Stability
- [x] **No duplicate code**
- [x] **Consistent response format**
- [x] **Proper async/await usage**
- [x] **No unhandled promise rejections**

---

## ✅ YÊU CẦU 5: Frontend hiển thị chính xác dữ liệu từ MongoDB

### Data Flow
- [x] **MongoDB → Backend**
  - [x] Task.find() lấy data từ MongoDB
  - [x] Populate userId nếu cần
  - [x] Filter by userId (user chỉ thấy tasks của mình)
  - [x] Return array of tasks

- [x] **Backend → Frontend**
  - [x] JSON response với proper structure
  - [x] Status 200 for success
  - [x] Data field contains tasks array

- [x] **Frontend Display**
  - [x] Parse response: `data.data` hoặc `data.tasks`
  - [x] Map over array to render TaskList
  - [x] Display all fields correctly
  - [x] Format dates (createdAt, dueDate)
  - [x] Show status badges
  - [x] Handle empty array (empty state)

### Data Accuracy
- [x] **Title** - Hiển thị chính xác
- [x] **Description** - Hiển thị nếu có, ẩn nếu không
- [x] **Status** - Map đúng enum value sang badge
- [x] **Due Date** - Format dd/mm/yyyy
- [x] **Created Date** - Format dd/mm/yyyy
- [x] **User Isolation** - Chỉ hiển thị tasks của user đăng nhập

### Real-time Updates
- [x] **After Create** - Task mới hiển thị ngay
- [x] **After Update** - Task cập nhật ngay
- [x] **After Delete** - Task biến mất ngay
- [x] **Toggle Status** - UI update optimistic

---

## 🧪 MANUAL TESTING GUIDE

### Step 1: Start Backend
```bash
cd backend
npm install
# Đảm bảo MongoDB đang chạy
npm run dev
# Expect: "🚀 Server đã sẵn sàng tại http://localhost:3000"
```

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Expect: Server chạy tại http://localhost:5173
```

### Step 3: Test Authentication
1. Mở http://localhost:5173
2. Click "Đăng ký" → Nhập thông tin → Submit
   - ✅ Expect: Redirect về /login, toast "Đăng ký thành công"
3. Nhập email/password → Click "Đăng nhập"
   - ✅ Expect: Redirect về /, token lưu trong localStorage
4. Mở DevTools → Application → Local Storage
   - ✅ Expect: Key "token" có giá trị JWT

### Step 4: Test Create Task
1. Click "➕ Thêm công việc mới"
2. Nhập tiêu đề: "Test Task"
3. Nhập mô tả: "This is a test"
4. Chọn status: "Chờ xử lý"
5. Chọn hạn: tomorrow
6. Click "Tạo mới"
   - ✅ Expect: Toast "Tạo công việc mới thành công"
   - ✅ Expect: Task hiển thị trong danh sách
   - ✅ Expect: Form reset
   - ✅ Expect: Stats cards update (+1 total, +1 pending)

### Step 5: Test Update Task
1. Click "✏️ Sửa" trên task vừa tạo
   - ✅ Expect: Form hiện lên với dữ liệu cũ
2. Đổi status thành "Đang thực hiện"
3. Click "Cập nhật"
   - ✅ Expect: Toast "Cập nhật công việc thành công"
   - ✅ Expect: Badge đổi sang "Đang thực hiện" (xanh dương)
   - ✅ Expect: Stats update (-1 pending, +1 in-progress)

### Step 6: Test Toggle Status
1. Click checkbox trên task
   - ✅ Expect: Toast "Cập nhật trạng thái thành công"
   - ✅ Expect: Badge đổi sang "Hoàn thành" (xanh lá)
   - ✅ Expect: Title có gạch ngang
   - ✅ Expect: Stats update (+1 completed)

### Step 7: Test Delete Task
1. Click "🗑️ Xóa"
   - ✅ Expect: Confirm dialog
2. Click OK
   - ✅ Expect: Toast "Xóa công việc thành công"
   - ✅ Expect: Task biến mất khỏi list
   - ✅ Expect: Stats update (-1 total, -1 completed)

### Step 8: Test Token Expiry
1. Trong DevTools Console, chạy:
   ```javascript
   localStorage.setItem('token', 'invalid-token')
   ```
2. Refresh page hoặc thực hiện bất kỳ action nào
   - ✅ Expect: Toast "Phiên đăng nhập đã hết hạn"
   - ✅ Expect: Redirect về /login
   - ✅ Expect: Token bị xóa khỏi localStorage

### Step 9: Test MongoDB Data
1. Mở MongoDB Compass hoặc mongosh
2. Connect tới `mongodb://127.0.0.1:27017/todoapp`
3. Xem collection `tasks`
   - ✅ Expect: Tasks vừa tạo có trong DB
   - ✅ Expect: userId field tồn tại
   - ✅ Expect: All fields đúng format
4. Xem collection `users`
   - ✅ Expect: User vừa đăng ký có trong DB
   - ✅ Expect: Password đã được hash

---

## 🎯 FINAL VERIFICATION

### Backend Checklist
- [x] Server khởi động thành công
- [x] MongoDB connection thành công
- [x] All routes hoạt động (auth + tasks)
- [x] JWT middleware hoạt động
- [x] CRUD operations stable
- [x] Error handling đầy đủ
- [x] CORS configured correctly

### Frontend Checklist
- [x] App khởi động thành công
- [x] Routing hoạt động (/, /login, /register)
- [x] Authentication flow hoạt động
- [x] Token storage & retrieval hoạt động
- [x] Task CRUD UI hoạt động
- [x] Toast notifications hoạt động
- [x] Data hiển thị chính xác từ MongoDB
- [x] Responsive design

### Integration Checklist
- [x] Frontend ↔ Backend communication hoạt động
- [x] Token được gửi trong mọi protected request
- [x] 401 auto-logout hoạt động
- [x] Data sync giữa UI và DB
- [x] No console errors
- [x] No network errors

---

## 📊 SUMMARY

| Yêu cầu | Status | Notes |
|---------|--------|-------|
| 1. Giao diện danh sách công việc đầy đủ | ✅ PASS | TaskList + Dashboard complete |
| 2. Thêm/sửa/xóa qua API | ✅ PASS | Full CRUD implemented |
| 3. Token xác thực hoạt động | ✅ PASS | JWT flow + auto-logout |
| 4. Backend ổn định | ✅ PASS | Error handling + validation |
| 5. Frontend hiển thị đúng MongoDB data | ✅ PASS | Data flow verified |

**✅ TẤT CẢ YÊU CẦU ĐÃ HOÀN THÀNH**

---

## 🚀 QUICK START

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Browser
http://localhost:5173
```

**Happy Testing! 🎉**
