# 📝 VÍ DỤ ERROR MESSAGES CỤ THỂ

## 🎯 **Trước và Sau khi cập nhật:**

---

## **Test Case 1: File có 1 title quá ngắn**

### **File Excel:**
```csv
Title,Description,Status,Due Date
AB,Làm báo cáo tháng 10,pending,2025-11-05
Họp team weekly,Họp tổng kết tuần,in-progress,2025-10-30
Review code,Kiểm tra PR#123,completed,2025-11-01
```

### **❌ TRƯỚC (Error cũ - ít thông tin):**
```
Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)
```

### **✅ BÂY GIỜ (Error mới - cực chi tiết):**
```
📍 Dòng 2 - Tiêu đề "AB": ❌ Quá ngắn 
   (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)
```

**👍 Lợi ích:**
- Biết ngay công việc "AB" bị lỗi
- Không cần mở file để xem dòng 2 là gì
- Rõ ràng cần sửa thành 3 ký tự trở lên

---

## **Test Case 2: File có status không hợp lệ**

### **File Excel:**
```csv
Title,Description,Status
Fix bug đăng nhập,Sửa lỗi user login,doing
Deploy production,Deploy version 2.0,completed
```

### **❌ TRƯỚC:**
```
Dòng 2: Trạng thái không hợp lệ "doing"
```

### **✅ BÂY GIỜ:**
```
📍 Dòng 2 - Công việc "Fix bug đăng nhập": ❌ Trạng thái không hợp lệ "doing"
   ✅ Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành
```

**👍 Lợi ích:**
- Biết ngay công việc "Fix bug đăng nhập" bị lỗi
- Biết status "doing" không hợp lệ
- Có danh sách status đúng để chọn

---

## **Test Case 3: File có ngày không hợp lệ**

### **File Excel:**
```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo,Viết báo cáo Q4,pending,2024-13-45
```

### **❌ TRƯỚC:**
```
Dòng 2: Ngày hết hạn không hợp lệ "2024-13-45"
```

### **✅ BÂY GIỜ:**
```
📍 Dòng 2 - Công việc "Hoàn thành báo cáo": ❌ Ngày hết hạn không hợp lệ "2024-13-45"
   ✅ Định dạng đúng: YYYY-MM-DD (ví dụ: 2025-11-30)
```

**👍 Lợi ích:**
- Biết công việc "Hoàn thành báo cáo" có ngày sai
- Biết "2024-13-45" là giá trị lỗi (tháng 13 không tồn tại)
- Có ví dụ format đúng để tham khảo

---

## **Test Case 4: File có nhiều lỗi**

### **File Excel:**
```csv
Title,Description,Status,Due Date
AB,Mô tả task 1,pending,2025-11-05
Họp team weekly,Mô tả task 2,invalid-status,2025-11-01
Fix bug login,Mô tả task 3,completed,2020-01-01
AB,Mô tả task 4 (trùng),pending,2025-11-03
Review code PR#123,Mô tả task 5,completed,2025-11-02
```

### **❌ TRƯỚC:**
```
Có 3 công việc không hợp lệ

Lỗi:
- Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)
- Dòng 3: Trạng thái không hợp lệ "invalid-status"
- Dòng 4: Ngày hết hạn quá xa trong quá khứ (2020-01-01)
```

### **✅ BÂY GIỜ:**
```
❌ Có 4 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.

Lỗi:

1. 📍 Dòng 2 - Tiêu đề "AB": ❌ Quá ngắn 
   (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)

2. 📍 Dòng 3 - Công việc "Họp team weekly": ❌ Trạng thái không hợp lệ "invalid-status"
   ✅ Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành

3. 📍 Dòng 4 - Công việc "Fix bug login": ❌ Ngày hết hạn "2020-01-01" quá xa trong quá khứ
   ✅ Phải từ 2024-10-28 trở đi

4. 📍 Dòng 5 - Tiêu đề "AB": ❌ TRÙNG LẶP với dòng 2
   ⚠️ Mỗi tiêu đề phải là duy nhất trong file

💡 Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. 
   Không có task nào được import.

🔍 Có 4 lỗi cần sửa. Mở Console (F12) để xem TẤT CẢ chi tiết.
```

---

## **Test Case 5: File trùng lặp**

### **File Excel:**
```csv
Title,Description
Hoàn thành báo cáo,Mô tả 1
Họp team,Mô tả 2
Hoàn thành báo cáo,Mô tả 3 (trùng lặp)
Review code,Mô tả 4
```

### **❌ TRƯỚC:**
```
Dòng 4: Tiêu đề trùng lặp với dòng 2 ("Hoàn thành báo cáo")
```

### **✅ BÂY GIỜ:**
```
📍 Dòng 4 - Tiêu đề "Hoàn thành báo cáo": ❌ TRÙNG LẶP với dòng 2
   ⚠️ Mỗi tiêu đề phải là duy nhất trong file
```

**👍 Lợi ích:**
- Biết chính xác "Hoàn thành báo cáo" bị trùng
- Biết dòng 4 trùng với dòng 2
- Biết cần đổi tên 1 trong 2

---

## **Test Case 6: File có mô tả quá dài**

### **File Excel:**
```csv
Title,Description
Fix bug,Đây là mô tả cực kỳ dài hơn 1000 ký tự... [1500 ký tự]
```

### **❌ TRƯỚC:**
```
Dòng 2: Mô tả quá dài (tối đa 1000 ký tự, hiện tại: 1500)
```

### **✅ BÂY GIỜ:**
```
📍 Dòng 2 - Công việc "Fix bug": ❌ Mô tả quá dài 
   (tối đa 1000 ký tự, hiện tại có 1500 ký tự)
```

**👍 Lợi ích:**
- Biết công việc "Fix bug" có mô tả quá dài
- Biết cần rút ngắn xuống ≤ 1000 ký tự
- Số liệu cụ thể: từ 1500 xuống 1000

---

## **Test Case 7: File thiếu tiêu đề**

### **File Excel:**
```csv
Title,Description,Status
,Mô tả công việc,pending
Họp team,Mô tả khác,completed
```

### **❌ TRƯỚC:**
```
Dòng 2: Thiếu tiêu đề (cột "Title" là bắt buộc)
```

### **✅ BÂY GIỜ:**
```
📍 Dòng 2: ❌ THIẾU TIÊU ĐỀ 
   Cột "Title" hoặc "Tiêu đề" là bắt buộc phải có giá trị
```

**👍 Lợi ích:**
- Biết dòng 2 thiếu tiêu đề
- Biết cột Title là bắt buộc
- Dễ hiểu, rõ ràng

---

## **Test Case 8: File có ngày quá xa tương lai**

### **File Excel:**
```csv
Title,Description,Status,Due Date
Dự án 2050,Kế hoạch dài hạn,pending,2050-12-31
```

### **❌ TRƯỚC:**
```
Dòng 2: Ngày hết hạn quá xa trong tương lai (2050-12-31)
```

### **✅ BÂY GIỜ:**
```
📍 Dòng 2 - Công việc "Dự án 2050": ❌ Ngày hết hạn "2050-12-31" quá xa trong tương lai
   ✅ Phải trước 2035-10-28
```

**👍 Lợi ích:**
- Biết công việc "Dự án 2050" có ngày quá xa
- Biết giới hạn là trước 2035-10-28
- Dễ điều chỉnh

---

## 📊 **Console Log Chi Tiết:**

### **Khi có lỗi, Console sẽ hiển thị:**

```javascript
❌ Import bị từ chối - Chi tiết lỗi: {
  message: "Có 3 công việc không hợp lệ. Vui lòng sửa TẤT CẢ lỗi trước khi import.",
  totalTasks: 5,
  validTasks: 2,
  invalidTasks: 3,
  errors: [
    "📍 Dòng 2 - Tiêu đề \"AB\": ❌ Quá ngắn (cần tối thiểu 3 ký tự, hiện tại chỉ có 2 ký tự)",
    "📍 Dòng 3 - Công việc \"Họp team weekly\": ❌ Trạng thái không hợp lệ \"invalid-status\"\n   ✅ Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành",
    "📍 Dòng 5 - Tiêu đề \"AB\": ❌ TRÙNG LẶP với dòng 2\n   ⚠️ Mỗi tiêu đề phải là duy nhất trong file"
  ],
  hint: "Hệ thống chỉ import khi TẤT CẢ công việc đều hợp lệ. Không có task nào được import."
}
```

---

## 🎯 **Hướng Dẫn Sửa Lỗi Nhanh:**

### **Lỗi 1: Title quá ngắn**
```
Error: Dòng 2 - Tiêu đề "AB": ❌ Quá ngắn

✅ Cách sửa:
Từ:  AB,Mô tả,pending
Sửa: ABC Task,Mô tả,pending
```

### **Lỗi 2: Status không hợp lệ**
```
Error: Công việc "Fix bug": ❌ Trạng thái "doing" không hợp lệ

✅ Cách sửa:
Từ:  Fix bug,Mô tả,doing
Sửa: Fix bug,Mô tả,in-progress
```

### **Lỗi 3: Ngày không hợp lệ**
```
Error: Công việc "Báo cáo": ❌ Ngày "2024-13-45" không hợp lệ

✅ Cách sửa:
Từ:  Báo cáo,Mô tả,pending,2024-13-45
Sửa: Báo cáo,Mô tả,pending,2024-11-30
```

### **Lỗi 4: Trùng lặp**
```
Error: Tiêu đề "Họp team": ❌ TRÙNG LẶP với dòng 2

✅ Cách sửa:
Dòng 2: Họp team,Mô tả 1,pending
Dòng 5: Họp team,Mô tả 2,pending (trùng)

Sửa dòng 5 thành:
Dòng 5: Họp team Q4,Mô tả 2,pending
```

---

## ✅ **Kết luận:**

**Error messages giờ đây cung cấp:**

1. ✅ **Vị trí chính xác:** Dòng số mấy
2. ✅ **Tên công việc:** Tiêu đề cụ thể bị lỗi
3. ✅ **Loại lỗi:** Title/Status/Date/Description
4. ✅ **Giá trị lỗi:** Giá trị hiện tại là gì
5. ✅ **Giá trị đúng:** Expected value là gì
6. ✅ **Hướng dẫn sửa:** Cách sửa cụ thể

**Bạn có thể sửa lỗi NHANH CHÓNG mà không cần đoán!** 🎯

