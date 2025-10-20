# ⚙️ Inactivity Timeout - Configuration Guide

## 🎯 Cấu Hình Hiện Tại

| Setting | Value | Location |
|---------|-------|----------|
| **Inactivity Timeout** | 1 giờ | `frontend/src/context/AuthContext.jsx` |
| **JWT Token Expiry** | 1 giờ | `backend/src/modules/auth/auth.controller.js` |
| **Status** | ✅ Production-ready | Đồng bộ frontend & backend |

---

## 📝 Thay Đổi Timeout

### Đổi Inactivity Timeout

**File:** `frontend/src/context/AuthContext.jsx`

**Dòng 18-19:**
```javascript
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 giờ
```

### Các Giá Trị Phổ Biến:

| Thời gian | Code | Use Case |
|-----------|------|----------|
| **10 giây** | `10 * 1000` | Demo/Testing |
| **5 phút** | `5 * 60 * 1000` | High security |
| **15 phút** | `15 * 60 * 1000` | Standard |
| **30 phút** | `30 * 60 * 1000` | Comfortable |
| **1 giờ** | `60 * 60 * 1000` | Production (current) ✅ |
| **2 giờ** | `2 * 60 * 60 * 1000` | Relaxed |

---

## 🧪 Test với Mock Timeout

### Để Demo Nhanh (Video Recording):

1. **Backup timeout hiện tại:**
   ```javascript
   // const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 giờ (backup)
   const INACTIVITY_TIMEOUT = 10 * 1000; // 10 giây (MOCK CHO DEMO)
   ```

2. **Update console log:**
   ```javascript
   console.log(`⏱️ Inactivity timer reset - sẽ logout sau 10 giây nếu không có hoạt động`);
   ```

3. **Update alert message:**
   ```javascript
   alert("⏰ Bạn đã không hoạt động trong 10 giây!\n\n...");
   ```

4. **Sau khi record xong, RESTORE lại:**
   ```javascript
   const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 giờ
   console.log(`⏱️ Inactivity timer reset - sẽ logout sau 1 giờ nếu không có hoạt động`);
   alert("⏰ Bạn đã không hoạt động trong 1 giờ!\n\n...");
   ```

---

## 🎬 Quick Demo Setup

### Nhanh Nhất (10 giây demo):

**Step 1:** Edit `AuthContext.jsx` line 18:
```javascript
const INACTIVITY_TIMEOUT = 10 * 1000; // DEMO MODE
```

**Step 2:** Save file (frontend tự reload)

**Step 3:** Đăng nhập → Đứng yên 10s → Alert!

**Step 4:** Sau khi demo xong, đổi lại:
```javascript
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // PRODUCTION
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### ✅ Production Checklist:

- [ ] `INACTIVITY_TIMEOUT = 60 * 60 * 1000` (1 giờ)
- [ ] Console log: "sau 1 giờ"
- [ ] Alert message: "trong 1 giờ"
- [ ] Backend JWT expiry: "1h"
- [ ] Test thử trên production build

### 🎥 Demo/Video Checklist:

- [ ] Tạm đổi thành `10 * 1000` (10 giây)
- [ ] Update console log & alert
- [ ] Record video
- [ ] **QUAN TRỌNG:** Đổi lại về 1 giờ sau khi record!

---

## 🔧 Sync với Backend

Backend JWT token cũng nên match với frontend timeout:

**File:** `backend/src/modules/auth/auth.controller.js`

**Dòng ~100:**
```javascript
const token = jwt.sign(
  { id: user._id, email: user.email }, 
  process.env.JWT_SECRET, 
  { expiresIn: "1h" } // Match với frontend INACTIVITY_TIMEOUT
);
```

### Recommended Values:

| Frontend Inactivity | Backend JWT Expiry |
|---------------------|-------------------|
| 5 phút | "5m" |
| 15 phút | "15m" |
| 30 phút | "30m" |
| 1 giờ ✅ | "1h" ✅ |
| 2 giờ | "2h" |

**⚠️ Lưu ý:** Backend expiry nên = hoặc > Frontend timeout

---

## 📊 Comparison

### Before (Fixed Expiry):
```
Đăng nhập → 10s → Logout (kể cả đang làm việc)
❌ User experience kém
```

### After (Inactivity Timeout):
```
Đăng nhập → Làm việc liên tục → Không logout
Đăng nhập → Rời máy 1h → Logout
✅ User experience tốt + Bảo mật
```

---

## 💡 Best Practices

### Development:
- Dùng **10-30 giây** để test nhanh
- Luôn check console log để verify

### Production:
- Dùng **1 giờ** (current) cho web apps
- Dùng **5-15 phút** cho banking/sensitive apps
- Dùng **2-4 giờ** cho internal tools

### Demo/Presentation:
- Mock về **10 giây** để demo nhanh
- Giải thích rõ: "Production là 1 giờ"
- Show code để audience thấy cấu hình thực

---

## 🐛 Troubleshooting

### Alert không xuất hiện sau timeout:
- Check console log có message không
- Verify `INACTIVITY_TIMEOUT` value
- Clear localStorage và login lại

### Timer không reset khi thao tác:
- Check event listeners có được setup không
- Verify `resetInactivityTimer()` được gọi
- Check DevTools Console có log "reset" không

### Bị logout ngay lập tức:
- Check timeout có phải số âm không
- Verify `Date.now()` và localStorage
- Clear cache và thử lại

---

**Cấu hình hiện tại:** ✅ Production-ready (1 giờ)
**Last updated:** 2025-01-18
