# 🔍 ERROR MESSAGES CHI TIẾT - Validation Import

## ✨ **CẬP NHẬT MỚI: Error Messages Cực Kỳ Chi Tiết!**

Bây giờ error messages sẽ hiển thị **CỤ THỂ:**
- ✅ **Dòng nào** bị lỗi
- ✅ **Tiêu đề công việc** nào bị lỗi
- ✅ **Lỗi gì** cụ thể
- ✅ **Giá trị hiện tại** vs **Giá trị mong đợi**
- ✅ **Cách sửa** rõ ràng

---

## 📊 **So sánh Before/After:**

### **TRƯỚC ĐÂY (Ít thông tin):**
```
❌ Dòng 3: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)
```
👎 Không biết công việc nào, phải mở file để xem

---

### **BÂY GIỜ (Chi tiết cực kỳ):**
```
❌ 📍 Dòng 3 - Tiêu đề "AB": ❌ Quá ngắn 
   (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)
```
👍 Biết ngay công việc "AB" bị lỗi, không cần mở file!

---

## 🎯 **Ví dụ Chi Tiết Từng Loại Lỗi:**

### **1. Lỗi THIẾU TIÊU ĐỀ:**

**File Excel:**
```csv
Title,Description,Status
,Mô tả công việc,pending
```

**Error Message:**
```
📍 Dòng 2: ❌ THIẾU TIÊU ĐỀ 
   Cột "Title" hoặc "Tiêu đề" là bắt buộc phải có giá trị
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** title
- 🔴 **Vấn đề:** Ô Title bị để trống
- ✅ **Cách sửa:** Điền tiêu đề công việc (3-200 ký tự)

---

### **2. Lỗi TIÊU ĐỀ QUÁ NGẮN:**

**File Excel:**
```csv
Title,Description,Status
AB,Mô tả ngắn gọn,pending
```

**Error Message:**
```
📍 Dòng 2 - Tiêu đề "AB": ❌ Quá ngắn 
   (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** title
- 🔴 **Giá trị hiện tại:** "AB" (2 ký tự)
- ✅ **Giá trị mong đợi:** 3-200 ký tự
- ✅ **Cách sửa:** Đổi thành "ABC Task" hoặc dài hơn

---

### **3. Lỗi TIÊU ĐỀ QUÁ DÀI:**

**File Excel:**
```csv
Title,Description
Đây là một tiêu đề cực kỳ dài vượt quá 200 ký tự... (300 ký tự),Mô tả
```

**Error Message:**
```
📍 Dòng 2 - Tiêu đề "Đây là một tiêu đề cực kỳ dài...": ❌ Quá dài 
   (tối đa 200 ký tự, hiện tại có 300 ký tự)
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** title
- 🔴 **Giá trị hiện tại:** 300 ký tự
- ✅ **Giá trị mong đợi:** ≤ 200 ký tự
- ✅ **Cách sửa:** Rút ngắn tiêu đề xuống dưới 200 ký tự

---

### **4. Lỗi TRÙNG LẶP TIÊU ĐỀ:**

**File Excel:**
```csv
Title,Description
Hoàn thành báo cáo,Mô tả task 1
Họp team weekly,Mô tả task 2
Hoàn thành báo cáo,Mô tả task 3 (trùng với dòng 2)
```

**Error Message:**
```
📍 Dòng 4 - Tiêu đề "Hoàn thành báo cáo": ❌ TRÙNG LẶP với dòng 2
   ⚠️ Mỗi tiêu đề phải là duy nhất trong file
```

**Thông tin chi tiết:**
- 🔴 **Vấn đề:** Tiêu đề "Hoàn thành báo cáo" đã xuất hiện ở dòng 2
- ✅ **Cách sửa:** Đổi thành "Hoàn thành báo cáo Q4" hoặc tên khác

---

### **5. Lỗi MÔ TÁ QUÁ DÀI:**

**File Excel:**
```csv
Title,Description
Họp team,Đây là mô tả cực kỳ dài hơn 1000 ký tự... (1500 ký tự)
```

**Error Message:**
```
📍 Dòng 2 - Công việc "Họp team": ❌ Mô tả quá dài 
   (tối đa 1000 ký tự, hiện tại có 1500 ký tự)
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** description
- 🔴 **Công việc:** "Họp team"
- 🔴 **Giá trị hiện tại:** 1500 ký tự
- ✅ **Giá trị mong đợi:** ≤ 1000 ký tự
- ✅ **Cách sửa:** Rút ngắn mô tả xuống dưới 1000 ký tự

---

### **6. Lỗi TRẠNG THÁI KHÔNG HỢP LỆ:**

**File Excel:**
```csv
Title,Description,Status
Review code PR#123,Kiểm tra code mới,doing
```

**Error Message:**
```
📍 Dòng 2 - Công việc "Review code PR#123": ❌ Trạng thái không hợp lệ "doing"
   ✅ Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** status
- 🔴 **Công việc:** "Review code PR#123"
- 🔴 **Giá trị hiện tại:** "doing"
- ✅ **Giá trị chấp nhận:** 
  - `pending` hoặc `chờ xử lý`
  - `in-progress` hoặc `đang làm`
  - `completed` hoặc `hoàn thành`
- ✅ **Cách sửa:** Đổi "doing" thành "in-progress" hoặc "đang làm"

---

### **7. Lỗi NGÀY KHÔNG HỢP LỆ:**

**File Excel:**
```csv
Title,Description,Status,Due Date
Fix bug login,Sửa lỗi đăng nhập,pending,2024-13-45
```

**Error Message:**
```
📍 Dòng 2 - Công việc "Fix bug login": ❌ Ngày hết hạn không hợp lệ "2024-13-45"
   ✅ Định dạng đúng: YYYY-MM-DD (ví dụ: 2025-11-30)
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** dueDate
- 🔴 **Công việc:** "Fix bug login"
- 🔴 **Giá trị hiện tại:** "2024-13-45" (tháng 13 không tồn tại)
- ✅ **Định dạng đúng:** YYYY-MM-DD
- ✅ **Cách sửa:** Đổi thành "2024-11-30" hoặc ngày hợp lệ khác

---

### **8. Lỗi NGÀY QUÁ KHỨ:**

**File Excel:**
```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo,Viết báo cáo,pending,2020-01-01
```

**Error Message:**
```
📍 Dòng 2 - Công việc "Hoàn thành báo cáo": ❌ Ngày hết hạn "2020-01-01" quá xa trong quá khứ
   ✅ Phải từ 2024-10-28 trở đi
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** dueDate
- 🔴 **Công việc:** "Hoàn thành báo cáo"
- 🔴 **Giá trị hiện tại:** 2020-01-01 (quá khứ 4 năm)
- ✅ **Giá trị chấp nhận:** Từ 2024-10-28 (1 năm trước) đến 10 năm sau
- ✅ **Cách sửa:** Đổi thành ngày trong khoảng cho phép, ví dụ: 2025-11-30

---

### **9. Lỗi NGÀY QUÁ XA TƯƠNG LAI:**

**File Excel:**
```csv
Title,Description,Status,Due Date
Dự án 2040,Kế hoạch dài hạn,pending,2040-12-31
```

**Error Message:**
```
📍 Dòng 2 - Công việc "Dự án 2040": ❌ Ngày hết hạn "2040-12-31" quá xa trong tương lai
   ✅ Phải trước 2035-10-28
```

**Thông tin chi tiết:**
- 🔴 **Field lỗi:** dueDate
- 🔴 **Công việc:** "Dự án 2040"
- 🔴 **Giá trị hiện tại:** 2040-12-31 (15 năm sau)
- ✅ **Giá trị chấp nhận:** Trước 2035-10-28 (10 năm sau)
- ✅ **Cách sửa:** Đổi thành ngày gần hơn, ví dụ: 2030-12-31

---

## 📋 **Ví Dụ File Có Nhiều Lỗi:**

**File Excel:**
```csv
Title,Description,Status,Due Date
AB,Mô tả ngắn,pending,2025-11-05
Họp team weekly,Mô tả dài,invalid-status,2025-11-01
AB,Mô tả khác,completed,2020-01-01
Fix bug,Mô tả ok,pending,2025-11-03
```

**Error Messages Chi Tiết:**
```
❌ Có 3 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

Errors:

1. 📍 Dòng 2 - Tiêu đề "AB": ❌ Quá ngắn 
   (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)

2. 📍 Dòng 3 - Công việc "Họp team weekly": ❌ Trạng thái không hợp lệ "invalid-status"
   ✅ Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành

3. 📍 Dòng 4 - Tiêu đề "AB": ❌ TRÙNG LẶP với dòng 2
   ⚠️ Mỗi tiêu đề phải là duy nhất trong file

💡 Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. 
   Không có task nào được import.
```

**Console Log Chi Tiết:**
```javascript
❌ Import bị từ chối - Chi tiết lỗi: {
  message: "Có 3 công việc không hợp lệ...",
  totalTasks: 4,
  validTasks: 1,
  invalidTasks: 3,
  errors: [
    {
      error: "📍 Dòng 2 - Tiêu đề 'AB': ❌ Quá ngắn...",
      field: "title",
      value: "AB",
      expected: "3-200 ký tự",
      actual: "2 ký tự"
    },
    {
      error: "📍 Dòng 3 - Công việc 'Họp team weekly': ❌ Trạng thái không hợp lệ...",
      field: "status",
      value: "invalid-status",
      expected: "pending | in-progress | completed"
    },
    {
      error: "📍 Dòng 4 - Tiêu đề 'AB': ❌ TRÙNG LẶP với dòng 2..."
    }
  ]
}
```

---

## 🎯 **Cách Sửa Từng Lỗi:**

### **Lỗi 1: Dòng 2 - Title "AB" quá ngắn**
```
Từ:  AB,Mô tả ngắn,pending,2025-11-05
Sửa: ABC Task,Mô tả ngắn,pending,2025-11-05
```

### **Lỗi 2: Dòng 3 - Status "invalid-status"**
```
Từ:  Họp team weekly,Mô tả dài,invalid-status,2025-11-01
Sửa: Họp team weekly,Mô tả dài,in-progress,2025-11-01
```

### **Lỗi 3: Dòng 4 - Trùng lặp "AB"**
```
Từ:  AB,Mô tả khác,completed,2020-01-01
Sửa: XYZ Task,Mô tả khác,completed,2025-11-01
```

**File sau khi sửa:**
```csv
Title,Description,Status,Due Date
ABC Task,Mô tả ngắn,pending,2025-11-05
Họp team weekly,Mô tả dài,in-progress,2025-11-01
XYZ Task,Mô tả khác,completed,2025-11-01
Fix bug,Mô tả ok,pending,2025-11-03
```

**Kết quả:**
```
✅ Import thành công TẤT CẢ 4 công việc!
```

---

## 📊 **Format Error Response:**

### **Error Object Structure:**
```javascript
{
  error: "📍 Dòng X - Công việc 'Title': ❌ Chi tiết lỗi...",
  field: "title|description|status|dueDate",
  value: "Giá trị hiện tại",
  expected: "Giá trị mong đợi",
  actual: "Giá trị thực tế"
}
```

### **API Response:**
```json
{
  "success": false,
  "message": "Có 3 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.",
  "totalTasks": 10,
  "validTasks": 7,
  "invalidTasks": 3,
  "errors": [
    "📍 Dòng 2 - Tiêu đề \"AB\": ❌ Quá ngắn (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)",
    "📍 Dòng 5 - Công việc \"Review code\": ❌ Trạng thái không hợp lệ \"xyz\"",
    "📍 Dòng 8 - Công việc \"Fix bug\": ❌ Ngày hết hạn \"2024-13-45\" không hợp lệ"
  ],
  "hint": "Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. Không có task nào được import."
}
```

---

## 🎨 **UI Display:**

### **Toast Error (hiển thị 3 lỗi đầu):**
```
❌ Có 5 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

📍 Dòng 2 - Tiêu đề "AB": ❌ Quá ngắn (cần 3 ký tự)
📍 Dòng 4 - Công việc "Review": ❌ Trạng thái không hợp lệ "xyz"
📍 Dòng 6 - Công việc "Fix bug": ❌ Ngày không hợp lệ
... và 2 lỗi khác

🔍 Mở Console (F12) để xem TẤT CẢ chi tiết.
```

---

## 💡 **Lợi Ích Của Error Messages Chi Tiết:**

### ✅ **1. Tiết kiệm thời gian:**
- Không cần mở file để xem dòng nào lỗi
- Biết ngay công việc nào bị lỗi gì
- Sửa nhanh chóng, chính xác

### ✅ **2. Dễ hiểu:**
- Ngôn ngữ rõ ràng, cụ thể
- Icon trực quan (📍 ❌ ✅ ⚠️)
- Có cả giá trị hiện tại và mong đợi

### ✅ **3. Dễ debug:**
- Console log đầy đủ thông tin
- Field bị lỗi rõ ràng
- Giá trị expected vs actual

### ✅ **4. User-friendly:**
- Hướng dẫn cách sửa cụ thể
- Ví dụ minh họa rõ ràng
- Không gây hoang mang

---

## 📚 **Checklist Debug:**

Khi gặp lỗi import, làm theo thứ tự:

### **Bước 1: Đọc Toast Message**
- Xem có bao nhiêu lỗi
- Đọc 3 lỗi đầu tiên được hiển thị

### **Bước 2: Mở Console (F12)**
- Xem TẤT CẢ lỗi chi tiết
- Note lại: Dòng nào, công việc nào, lỗi gì

### **Bước 3: Mở File Excel/CSV**
- Tìm đến dòng bị lỗi
- Kiểm tra giá trị hiện tại

### **Bước 4: Sửa Theo Hướng Dẫn**
- Đọc phần "expected" trong error
- Sửa thành giá trị đúng
- Lưu file

### **Bước 5: Import Lại**
- Upload file đã sửa
- Nếu còn lỗi, quay lại bước 1
- Nếu hết lỗi → ✅ Success!

---

## ✅ **Kết luận:**

Error messages giờ đây **CỰC KỲ CHI TIẾT**, bao gồm:

- ✅ Dòng nào bị lỗi
- ✅ Tiêu đề/tên công việc cụ thể
- ✅ Field nào bị lỗi
- ✅ Giá trị hiện tại vs mong đợi
- ✅ Hướng dẫn cách sửa
- ✅ Icon trực quan

**Bạn không cần phải đoán, mọi thứ đều RÕ RÀNG!** 🎯

