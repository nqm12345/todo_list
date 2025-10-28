# 🔒 CHẾ ĐỘ STRICT - Import Công Việc

## ⚠️ **QUAN TRỌNG: All or Nothing**

Hệ thống giờ đây hoạt động ở **CHẾ ĐỘ STRICT** (Nghiêm ngặt):

> **TẤT CẢ công việc phải hợp lệ 100% thì mới import được.**  
> **Nếu CÓ 1 LỖI DUY NHẤT → KHÔNG import gì cả!**

---

## 🎯 **Cách hoạt động:**

### ✅ **Trường hợp THÀNH CÔNG:**

**File Excel:**
```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo,Viết báo cáo tháng 10,pending,2025-11-05
Họp team weekly,Họp tổng kết tuần,in-progress,2025-10-30
Review code,Kiểm tra code mới,completed,2025-11-01
Fix bug login,Sửa lỗi đăng nhập,pending,2025-11-02
```

**Kết quả:**
```
✅ Import thành công TẤT CẢ 4 công việc từ Excel!
```

**Vào database:** 4 tasks được tạo ✅

---

### ❌ **Trường hợp THẤT BẠI:**

**File Excel (có 1 lỗi ở dòng 3):**
```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo,Viết báo cáo tháng 10,pending,2025-11-05
Họp team weekly,Họp tổng kết tuần,in-progress,2025-10-30
AB,Tiêu đề quá ngắn,completed,2025-11-01
Fix bug login,Sửa lỗi đăng nhập,pending,2025-11-02
```

**Kết quả:**
```
❌ Có 1 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

Lỗi:
- Dòng 3: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)

💡 Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. Không có task nào được import.
```

**Vào database:** 0 tasks (KHÔNG import gì cả) ❌

---

## 📊 **So sánh với chế độ cũ:**

| Tình huống | Chế độ cũ (Partial) | Chế độ mới (STRICT) |
|-----------|---------------------|---------------------|
| File có 4 tasks, 1 lỗi | Import 3, bỏ qua 1 | ❌ Reject, import 0 |
| File có 10 tasks, 5 lỗi | Import 5, bỏ qua 5 | ❌ Reject, import 0 |
| File có 4 tasks, 0 lỗi | ✅ Import 4 | ✅ Import 4 |

---

## 🔥 **Ví dụ chi tiết:**

### **Ví dụ 1: 1 Title trùng lặp**

```csv
Title,Description
Hoàn thành báo cáo,Mô tả 1
Họp team,Mô tả 2
Hoàn thành báo cáo,Mô tả 3 (trùng với dòng 2)
Fix bug,Mô tả 4
```

**Kết quả:**
```
❌ Có 1 công việc không hợp lệ

Lỗi:
- Dòng 4: Tiêu đề trùng lặp với dòng 2 ("Hoàn thành báo cáo")

Imported: 0/4 ❌
```

---

### **Ví dụ 2: Nhiều lỗi khác nhau**

```csv
Title,Description,Status,Due Date
AB,Mô tả ngắn,pending,2025-11-05
Hoàn thành báo cáo,Mô tả dài,invalid-status,2025-11-01
Review code,Mô tả tốt,completed,2020-01-01
Fix bug,Mô tả ok,pending,
```

**Kết quả:**
```
❌ Có 3 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

Lỗi:
- Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)
- Dòng 3: Trạng thái không hợp lệ "invalid-status". Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành
- Dòng 4: Ngày hết hạn quá xa trong quá khứ (2020-01-01)

Imported: 0/4 ❌
```

**Console (F12) sẽ hiển thị:**
```javascript
❌ Import bị từ chối - Chi tiết lỗi: {
  message: "Có 3 công việc không hợp lệ...",
  totalTasks: 4,
  validTasks: 1,
  invalidTasks: 3,
  errors: [
    "Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)",
    "Dòng 3: Trạng thái không hợp lệ 'invalid-status'...",
    "Dòng 4: Ngày hết hạn quá xa trong quá khứ (2020-01-01)"
  ],
  hint: "Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ..."
}
```

---

### **Ví dụ 3: File hoàn hảo**

```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo Q4,Viết và gửi báo cáo,pending,2025-11-05
Họp team weekly,Họp tổng kết,đang làm,2025-10-30
Review code PR#123,Kiểm tra code,completed,2025-10-28
Fix bug đăng nhập,Sửa lỗi user login,pending,2025-11-02
```

**Kết quả:**
```
✅ Import thành công TẤT CẢ 4 công việc từ Excel!

Imported: 4/4 ✅
```

---

## 🛠️ **Quy trình sửa lỗi:**

### **Bước 1: Import file**
```
Chọn file → Import
```

### **Bước 2: Nếu có lỗi**
```
❌ Có 2 công việc không hợp lệ

Lỗi:
- Dòng 3: Tiêu đề quá ngắn
- Dòng 5: Trạng thái không hợp lệ "abc"
```

### **Bước 3: Mở Console (F12)**
```
Console → Xem chi tiết TẤT CẢ lỗi
```

### **Bước 4: Sửa file Excel/CSV**
```
Dòng 3: "AB" → "ABC Task" (tối thiểu 3 ký tự)
Dòng 5: "abc" → "pending" (status hợp lệ)
```

### **Bước 5: Import lại**
```
✅ Import thành công TẤT CẢ 5 công việc!
```

---

## 📋 **Checklist trước khi import:**

### ✅ **File structure:**
- [ ] File có dòng header (Title, Description, Status, Due Date)
- [ ] Cột "Title" tồn tại (bắt buộc)
- [ ] File không trống (có ít nhất 1 dòng dữ liệu)

### ✅ **Title (Tiêu đề):**
- [ ] Mọi dòng đều có Title
- [ ] Title dài 3-200 ký tự
- [ ] Không có Title trùng lặp
- [ ] Không chứa ký tự đặc biệt nguy hiểm (`<script>`, etc.)

### ✅ **Description (Mô tả):**
- [ ] Tối đa 1000 ký tự

### ✅ **Status (Trạng thái):**
- [ ] Chỉ dùng: `pending`, `in-progress`, `completed`
- [ ] Hoặc tiếng Việt: `chờ xử lý`, `đang làm`, `hoàn thành`

### ✅ **Due Date (Ngày hết hạn):**
- [ ] Format: YYYY-MM-DD (ví dụ: 2025-11-30)
- [ ] Trong khoảng: 1 năm trước đến 10 năm sau

### ✅ **Tổng thể:**
- [ ] Số lượng tasks ≤ 100
- [ ] File size ≤ 5MB

---

## 🎨 **UI Messages:**

### **Success:**
```
🎉 Import thành công TẤT CẢ 10 công việc từ Excel!
```

### **Error với 1 lỗi:**
```
❌ Có 1 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

Dòng 3: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)

💡 Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. Không có task nào được import.
```

### **Error với nhiều lỗi:**
```
❌ Có 5 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

Dòng 2: Tiêu đề quá ngắn
Dòng 4: Trạng thái không hợp lệ
Dòng 7: Ngày hết hạn không hợp lệ
... và 2 lỗi khác

🔍 Có 5 lỗi cần sửa. Mở Console (F12) để xem TẤT CẢ chi tiết.
```

---

## 🔍 **Debug Tips:**

### **1. Kiểm tra Console:**
Mở Console (F12) sau khi import thất bại để xem:
- Tổng số tasks trong file
- Số tasks hợp lệ vs không hợp lệ
- Chi tiết TẤT CẢ lỗi
- Hint về cách sửa

### **2. Export file mẫu:**
Nếu không chắc format, export 1 file mẫu từ hệ thống:
```
Export → Tất cả → JSON/CSV
→ Sử dụng làm template
```

### **3. Validate từng phần:**
Nếu file quá lớn (>50 tasks), chia nhỏ ra để dễ debug:
- Import 10 tasks đầu
- Sửa lỗi (nếu có)
- Import 10 tasks tiếp theo
- ...

---

## 💡 **Lợi ích của STRICT mode:**

### ✅ **Ưu điểm:**
1. **Data Integrity:** Đảm bảo 100% dữ liệu trong DB là hợp lệ
2. **Consistency:** Không có trường hợp "một nửa thành công, một nửa thất bại"
3. **Predictable:** Kết quả rõ ràng - Hoặc tất cả, hoặc không
4. **Force Quality:** Buộc user phải chuẩn bị dữ liệu tốt trước khi import

### ⚠️ **Lưu ý:**
- Cần sửa TẤT CẢ lỗi mới import được
- Nếu file có nhiều lỗi, có thể tốn thời gian sửa
- Phải import lại toàn bộ sau khi sửa (không lưu phần đúng)

---

## 🔄 **API Response Format:**

### **Success Response:**
```json
{
  "success": true,
  "message": "Import thành công TẤT CẢ 10 công việc từ Excel!",
  "importedCount": 10,
  "totalSubmitted": 10,
  "data": [ /* all imported tasks */ ]
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Có 3 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.",
  "totalTasks": 10,
  "validTasks": 7,
  "invalidTasks": 3,
  "errors": [
    "Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)",
    "Dòng 5: Trạng thái không hợp lệ 'xyz'",
    "Dòng 8: Ngày hết hạn không hợp lệ '2024-13-45'"
  ],
  "hint": "Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. Không có task nào được import."
}
```

---

## 📚 **Tham khảo:**

- **Validation Rules:** `backend/VALIDATION_RULES.md`
- **Hướng dẫn Import:** `frontend/public/HUONG-DAN-IMPORT.md`
- **Code Implementation:**
  - Controller: `backend/src/modules/task/task.controller.js` (dòng 210-221, 282-292, 359-369)
  - Frontend: `frontend/src/components/ImportExport.jsx` (dòng 133-157)

---

## ✅ **Kết luận:**

**CHẾ ĐỘ STRICT đảm bảo:**
- ✅ 100% dữ liệu trong database là hợp lệ
- ✅ Không có "partial success" gây nhầm lẫn
- ✅ Error messages rõ ràng, chi tiết
- ✅ User biết chính xác cần sửa gì

**Quy tắc vàng:**
> **TẤT CẢ hoặc KHÔNG GÌ CẢ!** 🔒

