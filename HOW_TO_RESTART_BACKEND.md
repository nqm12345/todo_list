# 🔄 HƯỚNG DẪN RESTART BACKEND

## ⚠️ **QUAN TRỌNG:**

Sau khi sửa code backend, **BẮT BUỘC phải RESTART** server để thay đổi có hiệu lực!

---

## 🔧 **CÁCH 1: Restart Backend (Recommended)**

### **Nếu backend đang chạy trong terminal:**

1. **Tìm terminal đang chạy backend**
   - Tìm terminal có dòng: `Server running on port 3000...`
   - Hoặc dòng: `MongoDB connected...`

2. **Stop server:**
   - Nhấn `Ctrl + C` trong terminal đó
   - Đợi server dừng hẳn

3. **Start lại:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Đợi thông báo:**
   ```
   ✅ Server running on port 3000...
   ✅ MongoDB connected successfully
   ```

5. **Export lại file CSV để test**

---

## 🔧 **CÁCH 2: Nếu dùng nodemon (auto-restart)**

Nếu backend dùng `nodemon`, chỉ cần:

1. Lưu file code (Ctrl + S)
2. Nodemon tự động restart
3. Đợi 2-3 giây
4. Export lại

---

## 🔧 **CÁCH 3: Kill process và start mới**

### **Windows PowerShell:**

```powershell
# Tìm process Node.js
Get-Process node

# Kill tất cả Node.js
Stop-Process -Name node -Force

# Vào thư mục backend
cd backend

# Start lại
npm run dev
```

---

## ✅ **SAU KHI RESTART:**

### **Export file mới sẽ có:**

```csv
Tiêu đề,Mô tả,Trạng thái,Ngày hết hạn,Ngày tạo
siuu,ok luôn,Chờ xử lý,2025-10-30,2025-10-28
```

**Thay vì:**
```csv
Title,Description,Status,Due Date,Created At
siuu,ok luôn,pending,30/10/202,28/10/2025
```

---

## 🎯 **KIỂM TRA XEM RESTART THÀNH CÔNG CHƯA:**

### **Cách 1: Xem terminal log:**

Terminal backend phải có dòng mới:
```
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
Server running on port 3000...
MongoDB connected successfully
```

### **Cách 2: Export và kiểm tra:**

1. Export 1 file CSV
2. Mở file
3. Xem header:
   - Nếu là **"Tiêu đề,Mô tả,Trạng thái"** → ✅ Đã apply
   - Nếu vẫn **"Title,Description,Status"** → ❌ Chưa restart

---

## 🔥 **LƯU Ý:**

### **Thay đổi code backend → BẮT BUỘC restart:**

- ✅ Sửa `.js` files trong `backend/src/`
- ✅ Restart server
- ✅ Test lại

### **Không cần restart:**

- Frontend (React) - auto refresh
- CSS changes - auto refresh

---

## 📝 **CHECKLIST:**

- [ ] Backend server đã stop (Ctrl + C)
- [ ] Chạy lại `npm run dev` trong thư mục backend
- [ ] Thấy log "Server running on port 3000..."
- [ ] Export file CSV mới
- [ ] Kiểm tra header tiếng Việt
- [ ] Kiểm tra ngày format YYYY-MM-DD

---

## ✅ **KẾT QUẢ MONG ĐỢI:**

Sau khi restart, export file sẽ như này:

```csv
Tiêu đề,Mô tả,Trạng thái,Ngày hết hạn,Ngày tạo
siuu,ok luôn,Chờ xử lý,2025-10-30,2025-10-28
```

**100% TIẾNG VIỆT + FORMAT CHUẨN!** ✅

---

**Bạn restart backend rồi export thử xem nhé!** 😊

