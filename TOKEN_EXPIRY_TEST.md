# 🔐 Inactivity Timeout (Auto-Logout) Testing Guide

## 📋 Tính năng

**Inactivity Timeout**: Nếu bạn **không có hoạt động nào trong 1 giờ**, hệ thống sẽ:
- ⏰ Hiển thị alert: "Bạn đã không hoạt động trong 1 giờ! Phiên đăng nhập đã hết hạn."
- 🚪 Tự động logout và redirect về trang login

**Các hoạt động được tính:**
- ✅ Click chuột
- ✅ Di chuyển chuột
- ✅ Gõ phím
- ✅ Scroll trang
- ✅ Touch (mobile)

**Khi có hoạt động:**
- ⏱️ Timer tự động reset về 1 giờ
- 🔄 Bạn có thể làm việc không giới hạn nếu liên tục thao tác

---

## 🧪 Cách Test

### 1️⃣ Restart Backend (BẮT BUỘC)

**Windows (Git Bash):**
```bash
# Dừng backend hiện tại (nhấn Ctrl+C trong terminal backend)
# Sau đó chạy lại:
cd backend
npm run dev
```

### 2️⃣ Test Flow

#### Bước 1: Đăng nhập
1. Mở trình duyệt: http://localhost:5174
2. Đăng nhập với tài khoản:
   - Email: `khai@gmail.com`
   - Password: `Khai123@`

#### Bước 2: Quan sát Console
1. Mở DevTools (F12) → Tab Console
2. Khi đăng nhập, sẽ thấy: `⏱️ Inactivity timer reset - sẽ logout sau 1 giờ nếu không có hoạt động`
3. Mỗi khi bạn click/gõ phím → Timer reset và log lại

#### Bước 3: Test Case 1 - Đứng yên (Idle) - KHUYẾN NGHỊ DÙNG MOCK
- **Để test thực:** Đứng yên hoàn toàn 1 giờ (không khả thi)
- **Mock test:** Đổi `INACTIVITY_TIMEOUT` tạm thành `10 * 1000` (10 giây)
- Sau **1 giờ** (hoặc 10s nếu mock) → Alert popup
- Click OK → Redirect về Login

#### Bước 4: Test Case 2 - Thao tác liên tục
1. Tạo task mới
2. Sửa task
3. Gõ vào search box
4. Di chuyển chuột
5. **Kết quả:** Không bao giờ bị logout (vì timer liên tục reset)

#### Bước 5: Test Case 3 - Realistic Usage
1. Làm việc bình thường (15-20 phút)
2. Nghỉ giải lao (rời khỏi máy tính 1 giờ)
3. Quay lại → Đã bị logout (bảo vệ tài khoản)

---

## 🔧 Technical Details

### Backend Changes (`auth.controller.js`)

```javascript
// JWT token hết hạn sau 1 giờ (backend)
const token = jwt.sign(
  { id: user._id, email: user.email }, 
  process.env.JWT_SECRET, 
  { expiresIn: "1h" }
);

// Frontend tự quản lý inactivity timeout (10s)
res.json({
  token,
  user: { ... }
});
```

### Frontend Changes (`AuthContext.jsx`)

**1. Lắng nghe user activity:**
```javascript
const events = [
  'mousedown',   // Click chuột
  'mousemove',   // Di chuyển chuột
  'keypress',    // Gõ phím
  'scroll',      // Scroll
  'touchstart',  // Touch (mobile)
  'click'        // Click
];

events.forEach(event => {
  document.addEventListener(event, handleActivity);
});
```

**2. Reset timer khi có activity:**
```javascript
const handleActivity = () => {
  if (token) {
    resetInactivityTimer(); // Reset về 10 giây
  }
};
```

**3. Auto-logout khi idle 10s:**
```javascript
const resetInactivityTimer = () => {
  clearTimeout(inactivityTimerRef.current);
  
  inactivityTimerRef.current = setTimeout(() => {
    alert("⏰ Bạn đã không hoạt động trong 1 giờ!");
    logout();
    window.location.href = "/login";
  }, 3600000); // 1 giờ = 3600000ms
};
```

res.json({
  token,
  expiresAt, // Timestamp khi token hết hạn
  user: { ... }
});
```

### Frontend Changes (`AuthContext.jsx`)

**1. Lưu thời gian hết hạn:**
```javascript
localStorage.setItem("token", token);
localStorage.setItem("tokenExpiresAt", expiresAt);
```

**2. Setup auto-logout timer:**
```javascript
const setupAutoLogout = (expiresAt) => {
  const timeUntilExpiry = expiresAt - Date.now();
  
  logoutTimerRef.current = setTimeout(() => {
    alert("⏰ Phiên đăng nhập đã hết hạn!");
    logout();
    window.location.href = "/login";
  }, timeUntilExpiry);
};
```

**3. Kiểm tra token khi load trang:**
```javascript
useEffect(() => {
  const storedExpiresAt = localStorage.getItem("tokenExpiresAt");
  
  if (storedExpiresAt) {
    const expiresAt = parseInt(storedExpiresAt);
    const now = Date.now();
    
    if (expiresAt > now) {
      setupAutoLogout(expiresAt); // Còn hạn
    } else {
      logout(); // Đã hết hạn
    }
  }
}, []);
```

---

## ⚙️ Tuỳ Chỉnh Thời Gian Hết Hạn

### Đổi về 1 giờ (production):

**Backend:** `auth.controller.js`
```javascript
{ expiresIn: "1h" }
const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
```

### Các giá trị khác:
- `"5m"` = 5 phút
- `"15m"` = 15 phút
- `"1h"` = 1 giờ
- `"1d"` = 1 ngày
- `"7d"` = 7 ngày

**⚠️ LƯU Ý:** Phải đổi cả backend VÀ frontend (tính toán `expiresAt`)

---

## 🐛 Troubleshooting

### Alert không hiển thị sau 30s

**Nguyên nhân:** Backend chưa restart

**Giải pháp:**
1. Dừng backend (Ctrl+C)
2. Chạy lại: `npm run dev`
3. Đăng nhập lại

### Token hết hạn ngay khi load lại trang

**Nguyên nhân:** Đúng! Token chỉ có hạn 30s

**Giải pháp:** 
- Đây là hành vi mong đợi khi test
- Production nên dùng `1h` hoặc lâu hơn

### Không redirect về Login

**Nguyên nhân:** Browser block popup/alert

**Giải pháp:** 
- Check DevTools Console có lỗi không
- Allow popups cho localhost

---

## 📊 Test Scenarios

## 📊 Test Scenarios

| Scenario | Expected Result | Status |
|----------|----------------|--------|
| Đăng nhập → Đứng yên 1 giờ | Alert + Logout + Redirect | ✅ |
| Đăng nhập → Click liên tục | Không bao giờ logout | ✅ |
| Đăng nhập → Làm việc → Rời máy 1h | Alert sau 1 giờ | ✅ |
| Di chuột mỗi 30 phút | Timer reset, không logout | ✅ |
| Gõ phím trong search | Timer reset mỗi lần gõ | ✅ |
| Logout manual | Timer bị clear | ✅ |

---

## 🎯 Demo Video Script

## 🎯 Demo Video Script

**Thời lượng:** 40 giây

1. **0:00-0:05** - Đăng nhập thành công
2. **0:05-0:10** - Tạo 2-3 tasks (thao tác bình thường)
3. **0:10-0:20** - Đứng yên hoàn toàn (không click, không di chuột)
4. **0:20-0:30** - Alert popup sau 10 giây
5. **0:30-0:40** - Click OK → Redirect về Login → Demo lại với continuous activity (không bị logout)

---

## 📝 Notes

## 📝 Notes

- ✅ Timer reset mỗi khi có bất kỳ hoạt động nào
- ✅ Có thể làm việc không giới hạn nếu liên tục thao tác
- ✅ Chỉ logout khi IDLE (không hoạt động) 1 giờ
- ✅ Backend token cũng hết hạn sau 1 giờ (đồng bộ)
- ⚠️ **Production-ready:** 1 giờ là thời gian hợp lý cho môi trường thực tế
- 💡 **Test tip:** Để test nhanh, tạm đổi thành 10s trong code, test xong đổi lại

---

**Made with ❤️ by Minh & Khải**
