# Todo App - Frontend

Giao diện người dùng cho ứng dụng quản lý công việc (Todo App) sử dụng React, Vite, React Router, Axios.

## 🚀 Tính năng

### ✅ Authentication (Xác thực người dùng)
- **Login Page** - Đăng nhập với email & password
  - Remember me checkbox (lưu token vào localStorage)
  - Hero image với overlay text
  - Form validation
  - Toast notifications
  
- **Register Page** - Đăng ký tài khoản mới
  - Validate email format
  - Password strength indicator
  - Confirm password matching
  - Beautiful UI với hero panel

### ✅ Task Management (Quản lý công việc)
- **Dashboard** - Trang chủ sau khi đăng nhập
  - Statistics cards (Tổng số, Chờ xử lý, Đang làm, Hoàn thành)
  - Task list với status badges
  - Empty state khi chưa có task
  
- **Task CRUD Operations**
  - ➕ **Create**: Thêm task mới với form đầy đủ
  - 📝 **Read**: Hiển thị danh sách tasks từ MongoDB
  - ✏️ **Update**: Sửa task (click nút "Sửa")
  - 🗑️ **Delete**: Xóa task (với confirm dialog)
  - ✅ **Toggle Status**: Click checkbox để đánh dấu hoàn thành

- **Task Fields**
  - Tiêu đề (required)
  - Mô tả (optional)
  - Trạng thái: Chờ xử lý | Đang thực hiện | Hoàn thành
  - Hạn hoàn thành (optional)

### ✅ Security & UX
- Token-based authentication (JWT)
- Auto-logout khi token hết hạn (401)
- Protected routes (redirect to login if not authenticated)
- Toast notifications cho mọi action
- Loading states
- Error handling đầy đủ

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- npm hoặc yarn
- Backend API đang chạy tại `http://localhost:3000`

## ⚙️ Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình môi trường (Optional)

Tạo file `.env` nếu muốn custom API URL:

```env
VITE_API_BASE=http://localhost:3000/api
```

Nếu không tạo, frontend sẽ dùng default: `http://localhost:3000/api`

### 3. Khởi động dev server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### 4. Build cho production

```bash
npm run build
npm run preview
```

## 🎨 UI/UX Features

### Login & Register Pages
- **Hero Image Panel** (bên trái)
  - Ảnh background với overlay gradient
  - Welcome text với shadow effect
  - Responsive (ẩn trên mobile)
  
- **Form Panel** (bên phải)
  - Clean, modern design
  - Label + input styling
  - Error messages màu đỏ
  - Loading states
  - "Remember me" checkbox

### Tasks Dashboard
- **Header Bar**
  - Tiêu đề trang
  - Nút Logout (màu đỏ)
  
- **Statistics Grid** (4 cards)
  - Tổng số tasks
  - Pending (màu vàng)
  - In-Progress (màu xanh)
  - Completed (màu xanh lá)
  
- **Task Form**
  - Toggle show/hide form
  - 2-column responsive layout
  - Date picker cho due date
  - Dropdown chọn status
  
- **Task List**
  - Task cards với hover effects
  - Checkbox to toggle completion
  - Status badges 3 màu
  - Edit & Delete buttons
  - Date formatting (dd/mm/yyyy)

### Responsive Design
- Desktop: 2-column layout (hero + form)
- Tablet: Statistics 2 columns, form 1 column
- Mobile: Single column, hero ẩn

## 🔐 Authentication Flow

### Login
1. User nhập email & password
2. Click "Đăng nhập"
3. Frontend gọi `POST /api/auth/login`
4. Backend trả về token
5. Token lưu vào `localStorage`
6. Redirect về `/` (Tasks page)

### Register
1. User nhập username, email, password
2. Client-side validation (email format, password strength)
3. Frontend gọi `POST /api/auth/register`
4. Redirect về `/login` nếu thành công

### Auto-Logout
- Axios interceptor bắt response 401
- Xóa token khỏi localStorage
- Hiện toast "Phiên đăng nhập đã hết hạn"
- Redirect về `/login`

## 📊 Component Architecture

```
src/
├── main.jsx              # Entry point + Router setup
├── App.jsx               # (Unused - router in main)
├── index.css             # Global styles + Tailwind
│
├── api/
│   └── axios.js          # Axios instance + interceptors
│
├── assets/
│   ├── index.js          # Export hero images
│   ├── e7bc...jpg        # Login hero image
│   └── login-hero.svg    # Fallback SVG
│
├── context/
│   └── AuthContext.jsx   # Auth state + login/register/logout
│
├── pages/
│   ├── Login.jsx         # Login page
│   ├── Login.css         # Login styles
│   ├── Register.jsx      # Register page
│   ├── Register.css      # Register styles
│   ├── Tasks.jsx         # Main dashboard
│   ├── Tasks.css         # Dashboard styles
│   └── NotFound.jsx      # 404 page
│
└── components/
    ├── TaskForm.jsx      # Add/Edit task form
    └── TaskList.jsx      # Display tasks + actions
```

## 🔗 API Integration

### Endpoints Used

| Method | Endpoint | Component | Purpose |
|--------|----------|-----------|---------|
| POST | `/auth/register` | Register.jsx | Đăng ký |
| POST | `/auth/login` | Login.jsx | Đăng nhập |
| GET | `/tasks` | Tasks.jsx | Load tasks |
| POST | `/tasks` | TaskForm.jsx | Tạo task |
| PUT | `/tasks/:id` | TaskForm.jsx, TaskList.jsx | Cập nhật |
| DELETE | `/tasks/:id` | TaskList.jsx | Xóa |

### Request Flow Example (Create Task)

```javascript
// TaskForm.jsx
const payload = {
  title: "Học React",
  description: "Hoàn thành tutorial",
  status: "pending",
  dueDate: "2025-10-20"
};

await api.post("/tasks", payload);
// api.js tự động gắn header: Authorization: Bearer <token>
```

### Response Handling

```javascript
// Success
{
  "success": true,
  "message": "Tạo công việc mới thành công",
  "data": { _id, title, ... }
}

// Error
{
  "success": false,
  "message": "Vui lòng nhập tiêu đề công việc"
}
```

## 🎨 Styling Strategy

- **Global Styles**: `index.css` (Tailwind base + custom utilities)
- **Page-specific**: `Login.css`, `Register.css`, `Tasks.css`
- **No Tailwind classes** in components (plain CSS classes)
- **Responsive**: Media queries @768px

### Key CSS Classes

```css
/* Login/Register */
.login-page, .register-page   /* Full-page container */
.login-card                    /* 2-column grid */
.hero-image                    /* Background image */
.hero-overlay                  /* Text overlay */
.input, .btn, .link           /* Form elements */

/* Tasks */
.tasks-page                    /* Full-page gradient */
.stats-grid                    /* 4-column stats */
.task-form                     /* Add/Edit form */
.task-list                     /* Task cards container */
.task-item                     /* Individual card */
.status-badge                  /* Colored badges */
```

## 🧪 Testing Checklist

### Authentication
- [ ] Register with valid data → success
- [ ] Register with existing email → error
- [ ] Login with correct credentials → redirect to /
- [ ] Login with wrong password → error
- [ ] Token saved in localStorage after login
- [ ] Auto-logout on 401 response

### Task Management
- [ ] Dashboard loads tasks on mount
- [ ] Statistics cards show correct counts
- [ ] Click "Thêm công việc mới" → form appears
- [ ] Submit form with title → task created
- [ ] New task appears in list immediately
- [ ] Click checkbox → status toggles to completed
- [ ] Click "Sửa" → form populated with task data
- [ ] Update task → changes reflected
- [ ] Click "Xóa" → confirm dialog → task deleted
- [ ] Empty state shown when no tasks

### UI/UX
- [ ] Toast notifications for all actions
- [ ] Loading states (spinner, disabled buttons)
- [ ] Form validation works
- [ ] Responsive on mobile
- [ ] Hero image displays correctly

## 🐛 Troubleshooting

### Lỗi: "Network Error" khi gọi API
**Nguyên nhân:** Backend chưa chạy hoặc CORS issue

**Giải pháp:**
- Kiểm tra backend đang chạy: `http://localhost:3000`
- Kiểm tra CORS config trong backend `server.js`

### Lỗi: Token không được gửi lên
**Nguyên nhân:** Axios interceptor không hoạt động

**Giải pháp:**
- Check DevTools → Network → Headers → `Authorization: Bearer ...`
- Check localStorage có key `token` không

### Lỗi: "Cannot read properties of undefined"
**Nguyên nhân:** API response format khác expected

**Giải pháp:**
- Check backend response structure
- Sử dụng optional chaining: `data?.tasks`

## 📚 Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.1.1 | UI framework |
| React Router DOM | 7.9.4 | Routing |
| Axios | 1.12.2 | HTTP client |
| react-hot-toast | 2.6.0 | Notifications |
| Vite | 7.1.14 | Build tool |
| Tailwind CSS | 4.1.14 | CSS framework (minimal usage) |

## 🔄 Development Workflow

1. Chỉnh sửa component trong `src/`
2. Vite hot-reload tự động
3. Kiểm tra UI trong browser
4. Kiểm tra Network tab cho API calls
5. Kiểm tra Console cho errors
6. Test trên mobile view (DevTools)

## ✅ Production Deployment

### Build
```bash
npm run build
# Output: dist/
```

### Deploy Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Config base path in `vite.config.js`

### Environment Variables
```env
VITE_API_BASE=https://your-backend-api.com/api
```

## 🎯 Next Features (Future)

- [ ] Search & Filter tasks
- [ ] Sort by date, priority
- [ ] Categories/Tags
- [ ] Due date reminders
- [ ] Drag & drop reordering
- [ ] Priority levels
- [ ] Dark mode
- [ ] Export to PDF/CSV

## 👨‍💻 Author

Frontend cho Todo App - React + Vite - 2025

