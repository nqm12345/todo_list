# 🎬 Inactivity Timeout - Demo Guide

## 🎯 Mục Đích
Chứng minh hệ thống **chỉ logout khi IDLE (1 giờ)**, không logout khi đang làm việc.

## ⚠️ LƯU Ý QUAN TRỌNG

**Inactivity timeout hiện tại: 1 GIỜ**

Để demo trong video (không thể đợi 1 giờ), có 2 cách:

### Cách 1: Mock cho Demo (KHUYẾN NGHỊ)
1. Tạm đổi `INACTIVITY_TIMEOUT` trong `AuthContext.jsx`:
   ```javascript
   const INACTIVITY_TIMEOUT = 10 * 1000; // 10 giây cho demo
   ```
2. Record video với 10 giây
3. Trong video giải thích: "Production sẽ là 1 giờ, demo này dùng 10s"
4. Sau khi record xong, đổi lại về `60 * 60 * 1000`

### Cách 2: Giải Thích Bằng Code
- Không demo thực tế việc logout
- Chỉ show code và giải thích logic
- Show console log: "Inactivity timer reset - sẽ logout sau 1 giờ"

---

## 📹 Kịch Bản Demo (2 Phút)

### **Scene 1: Idle Logout (30 giây)**

**0:00-0:05** - Đăng nhập
- Mở http://localhost:5174
- Đăng nhập với `khai@gmail.com` / `Khai123@`

**0:05-0:08** - Làm việc bình thường
- Tạo 1-2 tasks nhanh
- Để chứng minh hệ thống hoạt động

**0:08-0:18** - **ĐỨNG YÊN** (Quan trọng!)
- Đặt tay xuống
- Không click chuột
- Không gõ phím
- Không di chuyển chuột
- ⏱️ Đếm ngược 10 giây (nếu dùng mock timeout)
- 📝 **Voice over:** "Trong production, đây sẽ là 1 giờ. Để demo, tôi đã set thành 10 giây."

**0:18-0:20** - Alert xuất hiện
- Alert: "Bạn đã không hoạt động trong 10 giây!"
- Click OK

**0:20-0:25** - Redirect về Login
- Tự động chuyển về trang đăng nhập

---

### **Scene 2: Continuous Activity (1 phút)**

**0:25-0:30** - Đăng nhập lại
- Login lại với cùng tài khoản

**0:30-1:00** - Thao tác liên tục (30 giây)
- Tạo task mới
- Edit task
- Delete task
- Gõ vào search box
- Click filter dropdown
- Scroll lên xuống
- Di chuyển chuột

**Kết quả:** KHÔNG BAO GIỜ BỊ LOGOUT!

**1:00-1:05** - Dừng lại và giải thích
- "Như các bạn thấy, khi tôi liên tục thao tác, hệ thống không logout"
- "Timer tự động reset mỗi khi có hoạt động"

**1:05-1:15** - Test lại idle
- Đứng yên 10 giây
- Alert xuất hiện lần nữa

---

## 🎤 Script Thuyết Minh

### Tiếng Việt:

**Intro (0:00-0:05):**
> "Chào mọi người, hôm nay tôi sẽ demo tính năng Inactivity Timeout. Tính năng này sẽ tự động đăng xuất người dùng nếu không có hoạt động trong 1 giờ. Để tiết kiệm thời gian demo, tôi đã tạm set timeout thành 10 giây."

**Scene 1 - Idle (0:05-0:25):**
> "Bây giờ tôi sẽ đăng nhập và tạo vài task. Sau đó tôi sẽ đứng yên hoàn toàn không thao tác gì. Trong production, timeout sẽ là 1 giờ, nhưng để demo tôi đã set thành 10 giây. Chúng ta sẽ thấy sau 10 giây, một alert sẽ xuất hiện thông báo phiên làm việc đã hết hạn."

*(Đứng yên, đợi alert)*

> "Như các bạn thấy, alert đã xuất hiện sau đúng 10 giây. Và hệ thống tự động đăng xuất và chuyển về trang login."

**Scene 2 - Active (0:25-1:05):**
> "Bây giờ tôi sẽ demo trường hợp người dùng đang làm việc. Tôi sẽ liên tục tạo, sửa, xóa task. Mỗi lần thao tác, timer sẽ tự động reset về 1 giờ. Do đó, người dùng có thể làm việc không giới hạn nếu liên tục có hoạt động. Trong production, họ có thể làm việc cả ngày mà không bị logout, miễn là có hoạt động trong mỗi khoảng 1 giờ."

*(Thao tác liên tục 30 giây)*

> "Như các bạn thấy, dù đã làm việc hơn 30 giây, nhưng tôi không bị logout vì tôi liên tục có hoạt động."

**Outro (1:05-1:20):**
> "Tính năng này rất hữu ích để bảo vệ tài khoản người dùng trong trường hợp họ quên đăng xuất hoặc rời khỏi máy tính. Với timeout 1 giờ, người dùng có thể làm việc thoải mái mà không bị gián đoạn, nhưng vẫn đảm bảo bảo mật khi rời máy lâu. Cảm ơn mọi người đã xem!"

---

## 📊 Checklist Before Recording

### ✅ Chuẩn Bị:
- [ ] Backend đang chạy (`npm run dev`)
- [ ] Frontend đang chạy (`npm run dev`)
- [ ] Browser mở trang Login
- [ ] Tài khoản test ready: `khai@gmail.com` / `Khai123@`
- [ ] DevTools Console mở (F12) để thấy logs
- [ ] Screen recording tool ready (OBS/ShareX/etc.)

### ✅ Test Trước:
- [ ] Test login → idle 10s → alert OK
- [ ] Test login → continuous activity → không logout
- [ ] Test alert message hiển thị đúng
- [ ] Test redirect về login sau alert

---

## 🎨 Visual Tips

### Console Logs Để Show:
```
⏱️ Inactivity timer reset - sẽ logout sau 1 giờ nếu không có hoạt động
⏱️ Inactivity timer reset - sẽ logout sau 1 giờ nếu không có hoạt động
⏱️ Inactivity timer reset - sẽ logout sau 1 giờ nếu không có hoạt động
```

Mỗi dòng xuất hiện khi có activity → Show timer đang reset

**📝 Trong video, giải thích:**
> "Như các bạn thấy trong console, mỗi lần thao tác, timer được reset về 1 giờ. Nhưng để demo nhanh, tôi đã set thành 10 giây."

### Alert Message:
```
⏰ Bạn đã không hoạt động trong 1 giờ!

Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
```

**⚠️ Lưu ý:** Nếu dùng mock 10s cho demo, alert sẽ hiển thị "10 giây" thay vì "1 giờ".

---

## 🔧 Troubleshooting

### Alert không xuất hiện:
- **Nguyên nhân:** Bạn vô tình di chuyển chuột
- **Giải pháp:** Đặt tay ra xa chuột, đứng yên hoàn toàn

### Timer không reset:
- **Nguyên nhân:** Event listeners chưa được setup
- **Giải pháp:** Logout → Login lại

### Logout ngay khi đứng yên:
- **Nguyên nhân:** Đúng! Đây là behavior mong muốn
- **Giải pháp:** N/A - Đúng như thiết kế

---

## 📸 Screenshots Cần Chụp

1. **Login Page** - Before login
2. **Dashboard** - Just logged in
3. **Create Task** - Đang tạo task (active state)
4. **Console Logs** - Thấy timer reset messages
5. **Alert Popup** - Alert "Bạn đã không hoạt động trong 10 giây!"
6. **Login Page** - After auto-logout
7. **Continuous Activity** - Multiple tasks created (không bị logout)

---

## 💡 Pro Tips

### Làm rõ ràng hơn:
- Dùng **countdown timer** trên màn hình (external tool)
- Highlight chuột để audience thấy khi bạn không di chuyển
- Zoom vào alert để rõ ràng

### Nếu quên:
- Luôn có thể restart và record lại
- Edit video để cắt bỏ phần sai

---

**Good luck! 🎬🚀**
