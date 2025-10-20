# 🧪 Testing Guide - Todo App

Hướng dẫn kiểm thử đầy đủ cho ứng dụng Todo App.

---

## 📋 Testing Checklist

### ✅ Functional Testing

#### Authentication Flow
- [ ] **Register**
  - [ ] Đăng ký với thông tin hợp lệ → Thành công
  - [ ] Đăng ký với email đã tồn tại → Lỗi "Email đã tồn tại"
  - [ ] Đăng ký với mật khẩu yếu → Lỗi validation
  - [ ] Đăng ký với email không hợp lệ → Lỗi validation
  - [ ] Đăng ký với field trống → Lỗi "Vui lòng nhập đầy đủ"
  - [ ] Password strength indicator hiển thị đúng (Yếu/Trung bình/Mạnh)
  - [ ] Confirm password không khớp → Lỗi

- [ ] **Login**
  - [ ] Đăng nhập với credentials đúng → Thành công, redirect to /
  - [ ] Đăng nhập với email sai → Lỗi "Email chưa đăng ký"
  - [ ] Đăng nhập với password sai → Lỗi "Mật khẩu không đúng"
  - [ ] Token được lưu vào localStorage
  - [ ] Remember me checkbox hoạt động
  - [ ] Password visibility toggle hoạt động

- [ ] **Logout**
  - [ ] Click Logout → Token bị xóa khỏi localStorage
  - [ ] Redirect về /login
  - [ ] Toast "Đã đăng xuất" hiển thị

- [ ] **Token Expiry**
  - [ ] Token hết hạn → Auto-logout
  - [ ] Toast "Phiên đăng nhập đã hết hạn" hiển thị
  - [ ] Redirect về /login

#### Task CRUD Operations

- [ ] **Create Task**
  - [ ] Tạo task với tiêu đề only → Thành công
  - [ ] Tạo task đầy đủ (title, description, status, dueDate) → Thành công
  - [ ] Tạo task với tiêu đề trống → Lỗi validation
  - [ ] Task mới hiển thị ngay trong list
  - [ ] Stats cards update (+1 total, +1 pending)
  - [ ] Form reset sau khi tạo
  - [ ] Toast "Tạo công việc mới thành công" hiển thị

- [ ] **Read Tasks**
  - [ ] Dashboard load hiển thị tất cả tasks
  - [ ] Empty state hiển thị khi chưa có task
  - [ ] Task cards hiển thị đầy đủ: title, description, status, dates
  - [ ] Status badges đúng màu (Pending=vàng, In-Progress=xanh, Completed=xanh lá)
  - [ ] Due date format dd/mm/yyyy
  - [ ] Created date hiển thị đúng

- [ ] **Update Task**
  - [ ] Click "Sửa" → Form populated với data cũ
  - [ ] Update task → Changes reflected ngay
  - [ ] Toast "Cập nhật công việc thành công" hiển thị
  - [ ] Stats cards update nếu status changed
  - [ ] Form close sau khi update

- [ ] **Delete Task**
  - [ ] Click "Xóa" → Confirm dialog hiển thị
  - [ ] Cancel → Không xóa
  - [ ] OK → Task bị xóa khỏi list
  - [ ] Toast "Xóa công việc thành công" hiển thị
  - [ ] Stats cards update (-1 total)

- [ ] **Toggle Status**
  - [ ] Click checkbox (pending) → Chuyển sang completed
  - [ ] Click checkbox (completed) → Chuyển sang pending
  - [ ] Badge color changes
  - [ ] Title có strikethrough khi completed
  - [ ] Toast "Cập nhật trạng thái thành công" hiển thị
  - [ ] Stats cards update

#### Search & Filter

- [ ] **Search**
  - [ ] Gõ keyword → Results filter real-time
  - [ ] Search by title → Correct results
  - [ ] Search by description → Correct results
  - [ ] Search không tìm thấy → "Không tìm thấy công việc nào..." hiển thị
  - [ ] Clear search (✕) → Reset về all tasks
  - [ ] Search input focus → Border blue

- [ ] **Filter**
  - [ ] Filter "Tất cả" → Hiển thị all tasks
  - [ ] Filter "Chờ xử lý" → Chỉ hiển thị pending tasks
  - [ ] Filter "Đang làm" → Chỉ hiển thị in-progress tasks
  - [ ] Filter "Hoàn thành" → Chỉ hiển thị completed tasks

- [ ] **Combined Search + Filter**
  - [ ] Search "test" + Filter "Pending" → Correct results
  - [ ] Change filter while searching → Results update correctly

---

### ✅ UI/UX Testing

#### Layout & Design
- [ ] Login page hero image hiển thị
- [ ] Register page hero image hiển thị
- [ ] Dashboard gradient background
- [ ] Task cards hover effect
- [ ] Button hover animations
- [ ] Input focus states (blue border)
- [ ] Loading spinner hiển thị khi fetch data

#### Responsive Design
- [ ] **Desktop (1920x1080)**
  - [ ] Layout 2-column (hero + form) cho Login/Register
  - [ ] Dashboard full width
  - [ ] Stats grid 4 columns
  - [ ] Task form 2 columns

- [ ] **Tablet (768x1024)**
  - [ ] Stats grid 2 columns
  - [ ] Task form 1 column
  - [ ] Search & filter stack vertically

- [ ] **Mobile (375x667)**
  - [ ] Hero image ẩn
  - [ ] Form full width
  - [ ] Stats grid 2x2
  - [ ] Task actions stack vertically
  - [ ] Buttons full width

#### Toast Notifications
- [ ] Success toast màu xanh lá
- [ ] Error toast màu đỏ
- [ ] Toast tự động đóng sau 3 giây
- [ ] Toast có icon (✓ hoặc ✕)
- [ ] Multiple toasts stack correctly

---

### ✅ Error Handling Testing

#### Network Errors
- [ ] Backend offline → "Không thể kết nối tới server" toast
- [ ] Slow connection → Loading spinner hiển thị

#### HTTP Status Codes
- [ ] 400 Bad Request → Error message từ backend
- [ ] 401 Unauthorized → Auto-logout + redirect
- [ ] 403 Forbidden → Toast "Bạn không có quyền..."
- [ ] 404 Not Found → Toast "Không tìm thấy tài nguyên..."
- [ ] 500 Server Error → Toast "Lỗi server. Vui lòng thử lại sau."

#### Client Errors
- [ ] Form validation errors hiển thị
- [ ] Empty field submission → Prevent submit
- [ ] Invalid email format → Error message

---

### ✅ Security Testing

#### Authentication
- [ ] Không có token → Redirect về /login khi access /
- [ ] Invalid token → Auto-logout
- [ ] Expired token → Auto-logout
- [ ] Token không expose trong console/network tab

#### Data Isolation
- [ ] User A chỉ thấy tasks của User A
- [ ] User B không thể edit/delete tasks của User A
- [ ] API requests kèm Authorization header

#### Input Validation
- [ ] XSS prevention: `<script>alert('xss')</script>` trong title → Không execute
- [ ] SQL injection prevention (MongoDB query không inject được)

---

### ✅ Performance Testing

#### Load Times
- [ ] Initial page load < 3s
- [ ] API response time < 500ms
- [ ] Search filter real-time (< 100ms)

#### Browser Console
- [ ] Không có errors
- [ ] Không có warnings (ngoài dev warnings)
- [ ] Không có 404 assets

---

## 🧪 Manual Testing Steps

### Test Case 1: Complete User Flow

**Objective:** Test toàn bộ flow từ đăng ký đến CRUD

**Steps:**
1. Mở http://localhost:5173
2. Click "Đăng ký"
3. Nhập:
   - Username: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm: `Test123!`
4. Submit → Expect: Redirect to /login
5. Nhập email & password → Login
6. Expect: Redirect to /, dashboard hiển thị
7. Click "➕ Thêm công việc mới"
8. Nhập:
   - Tiêu đề: `Hoàn thành báo cáo`
   - Mô tả: `Báo cáo cuối kỳ môn Web`
   - Status: `Chờ xử lý`
   - Due date: Tomorrow
9. Submit → Expect: Task hiển thị, toast success
10. Click checkbox → Expect: Status changed to completed
11. Click "Sửa" → Expect: Form populated
12. Change status to "Đang thực hiện" → Submit
13. Expect: Status updated, toast success
14. Click "Xóa" → Confirm → Expect: Task removed
15. Click "Đăng xuất" → Expect: Redirect to /login

**Expected Result:** All steps pass without errors

---

### Test Case 2: Search & Filter

**Objective:** Test search và filter features

**Pre-condition:** Có ít nhất 5 tasks với các status khác nhau

**Steps:**
1. Login vào dashboard
2. Nhập "báo cáo" vào search box
3. Expect: Chỉ tasks có chữ "báo cáo" hiển thị
4. Click ✕ để clear search
5. Expect: All tasks hiển thị lại
6. Select filter "Chờ xử lý"
7. Expect: Chỉ pending tasks hiển thị
8. Nhập "test" vào search (với filter "Chờ xử lý" active)
9. Expect: Chỉ pending tasks có chữ "test" hiển thị

**Expected Result:** Search và filter hoạt động đúng, combined search + filter OK

---

### Test Case 3: Error Handling

**Objective:** Test error handling và recovery

**Steps:**
1. Stop backend server
2. Try to login
3. Expect: Toast "Không thể kết nối tới server"
4. Start backend server
5. Login thành công
6. Trong console, chạy: `localStorage.setItem('token', 'invalid')`
7. Refresh page
8. Expect: Auto-logout, redirect to /login, toast "Phiên đăng nhập đã hết hạn"

**Expected Result:** App handle errors gracefully, không crash

---

### Test Case 4: Responsive Design

**Objective:** Test UI trên các screen sizes

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test các devices:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)
4. Check:
   - Layout không bị vỡ
   - Text đọc được
   - Buttons clickable
   - Forms usable

**Expected Result:** UI responsive trên tất cả devices

---

## 🚀 Automated Testing (Optional)

### Backend API Testing với Jest

```bash
cd backend
npm install --save-dev jest supertest
```

**Example test:**

```javascript
// backend/tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'Test User',
        email: 'test@example.com',
        password: 'Test123!'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });
});
```

### Frontend Testing với React Testing Library

```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

**Example test:**

```javascript
// frontend/src/components/__tests__/Login.test.jsx
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
});
```

---

## 📊 Testing Report Template

```markdown
# Testing Report - Todo App

**Test Date:** [Date]
**Tester:** [Your Name]
**Version:** [Version]

## Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Pass Rate: [Percentage]%

## Test Results

### Authentication
| Test Case | Status | Notes |
|-----------|--------|-------|
| Register with valid data | ✅ Pass | - |
| Login with correct credentials | ✅ Pass | - |
| Auto-logout on token expiry | ❌ Fail | Bug: Does not redirect |

### Task CRUD
| Test Case | Status | Notes |
|-----------|--------|-------|
| Create task | ✅ Pass | - |
| Read tasks | ✅ Pass | - |
| Update task | ✅ Pass | - |
| Delete task | ✅ Pass | - |

### Search & Filter
| Test Case | Status | Notes |
|-----------|--------|-------|
| Search by title | ✅ Pass | - |
| Filter by status | ✅ Pass | - |
| Combined search + filter | ✅ Pass | - |

## Issues Found

1. **[BUG-001] Auto-logout does not redirect**
   - Severity: High
   - Steps to reproduce: [...]
   - Expected: Redirect to /login
   - Actual: Stays on current page

## Recommendations

- [ ] Fix BUG-001 before production deployment
- [ ] Add loading indicator for slow connections
- [ ] Improve error messages

---

**Tester Signature:** _______________
```

---

## 🎯 Acceptance Criteria

Trước khi deploy production, đảm bảo:

- [ ] ✅ All functional tests PASS
- [ ] ✅ No console errors
- [ ] ✅ Responsive trên mobile/tablet/desktop
- [ ] ✅ Error handling hoạt động
- [ ] ✅ Security tests PASS
- [ ] ✅ Performance acceptable (< 3s load time)
- [ ] ✅ Demo video recorded
- [ ] ✅ Screenshots taken

---

**Happy Testing! 🧪**
