# 🛡️ VALIDATION RULES - Import Công Việc

Tài liệu này mô tả chi tiết các quy tắc validation khi import công việc qua file JSON, Excel, hoặc CSV.

## 📋 **Tổng quan**

Tất cả các file import đều phải tuân thủ các quy tắc validation sau để đảm bảo dữ liệu chính xác và an toàn.

---

## 🔒 **1. Validation Cấp File**

### File Size (Kích thước file)
- ✅ **Tối đa:** 5MB
- ❌ **Lỗi nếu:** File > 5MB
- 📍 **Vị trí:** Frontend validation

### Số lượng Tasks
- ✅ **Tối đa:** 100 tasks/lần
- ❌ **Lỗi nếu:** > 100 tasks
- 📍 **Vị trí:** Backend + Frontend validation

### Định dạng file được hỗ trợ
- ✅ JSON (.json)
- ✅ Excel (.xlsx, .xls)
- ✅ CSV (.csv)
- ❌ **Lỗi nếu:** Định dạng khác

---

## 🏗️ **2. Validation Cấu Trúc File**

### Excel/CSV - Headers (Tiêu đề cột)

#### Cột bắt buộc:
- ✅ **Title** (hoặc các tên tiếng Việt tương đương)
  - Tên hợp lệ: `title`, `tiêu đề`, `tên công việc`, `ten cong viec`, `tiêu đề công việc`

#### Cột tùy chọn:
- 📝 **Description**: `description`, `mô tả`, `nội dung`, `mo ta`, `noi dung`, `ghi chú`, `chi tiết`
- 📊 **Status**: `status`, `trạng thái`, `trang thai`, `tình trạng`
- 📅 **Due Date**: `duedate`, `due_date`, `due date`, `ngày hết hạn`, `hạn chót`, `deadline`, `hạn hoàn thành`

#### Quy tắc:
- ❌ **Lỗi nếu:** Không có dòng header
- ❌ **Lỗi nếu:** Thiếu cột "Title"
- ❌ **Lỗi nếu:** Không nhận diện được bất kỳ cột nào

### JSON - Structure

#### Định dạng hợp lệ:
```json
// Cách 1: Array trực tiếp
[
  { "title": "...", "description": "..." }
]

// Cách 2: Object với key "tasks"
{
  "tasks": [
    { "title": "...", "description": "..." }
  ]
}

// Cách 3: Object với key "data"
{
  "data": [
    { "title": "...", "description": "..." }
  ]
}
```

#### Quy tắc:
- ❌ **Lỗi nếu:** Không phải JSON hợp lệ
- ❌ **Lỗi nếu:** Không phải array hoặc object có key tasks/data
- ❌ **Lỗi nếu:** Array rỗng

---

## 📝 **3. Validation Từng Field**

### 3.1. Title (Tiêu đề) - BẮT BUỘC

#### Quy tắc:
- ✅ **Bắt buộc:** Phải có giá trị
- ✅ **Độ dài tối thiểu:** 3 ký tự
- ✅ **Độ dài tối đa:** 200 ký tự
- ✅ **Kiểu dữ liệu:** String
- ✅ **Sanitization:** Loại bỏ ký tự nguy hiểm (<, >, javascript:, onclick=, etc.)

#### Lỗi:
- ❌ `Dòng X: Thiếu tiêu đề (cột "Title" hoặc "Tiêu đề" là bắt buộc)`
- ❌ `Dòng X: Tiêu đề không được để trống`
- ❌ `Dòng X: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: Y)`
- ❌ `Dòng X: Tiêu đề quá dài (tối đa 200 ký tự, hiện tại: Y)`

### 3.2. Description (Mô tả) - TÙY CHỌN

#### Quy tắc:
- ✅ **Tùy chọn:** Có thể để trống
- ✅ **Độ dài tối đa:** 1000 ký tự
- ✅ **Kiểu dữ liệu:** String
- ✅ **Sanitization:** Loại bỏ ký tự nguy hiểm

#### Lỗi:
- ❌ `Dòng X: Mô tả quá dài (tối đa 1000 ký tự, hiện tại: Y)`

### 3.3. Status (Trạng thái) - TÙY CHỌN

#### Giá trị hợp lệ (English):
- `pending` (mặc định)
- `in-progress`
- `completed`

#### Giá trị hợp lệ (Tiếng Việt - tự động convert):
- `chờ xử lý`, `chờ` → `pending`
- `đang làm`, `đang thực hiện`, `in progress` → `in-progress`
- `hoàn thành`, `xong` → `completed`

#### Quy tắc:
- ✅ **Tùy chọn:** Nếu không có, mặc định là `pending`
- ✅ **Case-insensitive:** Không phân biệt chữ hoa/thường
- ✅ **Auto-normalize:** Tự động chuyển từ tiếng Việt sang English

#### Lỗi:
- ❌ `Dòng X: Trạng thái không hợp lệ "Y". Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành`

### 3.4. Due Date (Ngày hết hạn) - TÙY CHỌN

#### Định dạng hợp lệ:
- ✅ `YYYY-MM-DD` (ví dụ: `2025-11-30`)
- ✅ ISO 8601 format
- ✅ Bất kỳ format nào mà `new Date()` của JavaScript parse được

#### Quy tắc:
- ✅ **Tùy chọn:** Có thể để trống
- ✅ **Khoảng thời gian hợp lệ:** Từ 1 năm trước đến 10 năm sau
- ❌ **Không chấp nhận:** Ngày quá khứ > 1 năm hoặc tương lai > 10 năm

#### Lỗi:
- ❌ `Dòng X: Ngày hết hạn không hợp lệ "Y". Định dạng đúng: YYYY-MM-DD (ví dụ: 2025-11-30)`
- ❌ `Dòng X: Ngày hết hạn quá xa trong quá khứ (Y)`
- ❌ `Dòng X: Ngày hết hạn quá xa trong tương lai (Y)`

---

## 🔍 **4. Validation Bổ Sung**

### 4.1. Duplicate Detection (Phát hiện trùng lặp)

#### Quy tắc:
- ✅ **Check:** Tiêu đề trùng lặp trong cùng 1 file import
- ✅ **Case-insensitive:** Không phân biệt chữ hoa/thường
- ✅ **Trim:** Tự động loại bỏ khoảng trắng thừa

#### Lỗi:
- ❌ `Dòng X: Tiêu đề trùng lặp với dòng Y ("Z")`

### 4.2. Empty Rows (Dòng trống)

#### Quy tắc:
- ✅ **Auto-skip:** Tự động bỏ qua dòng trống
- ✅ **Warning:** Thông báo số dòng đã bỏ qua

#### Warning:
- ⚠️ `Đã bỏ qua X dòng trống`

### 4.3. XSS Prevention (Bảo mật)

#### Sanitization Rules:
- ❌ Loại bỏ `<` và `>` (HTML tags)
- ❌ Loại bỏ `javascript:` protocol
- ❌ Loại bỏ event handlers (onclick=, onload=, etc.)

---

## 📊 **5. Response Format**

### Success Response
```json
{
  "success": true,
  "message": "Import thành công 8/10 công việc",
  "importedCount": 8,
  "totalSubmitted": 10,
  "skippedCount": 2,
  "warnings": [
    "Dòng 3: Tiêu đề trùng lặp với dòng 1",
    "Dòng 7: Mô tả quá dài (tối đa 1000 ký tự)"
  ],
  "data": [ /* imported tasks */ ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "File Excel có lỗi",
  "errors": [
    "Thiếu cột bắt buộc: 'title'",
    "Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự)"
  ],
  "warnings": [
    "Đã bỏ qua 2 dòng trống"
  ]
}
```

---

## 🎯 **6. Ví dụ Thực Tế**

### ✅ File Excel/CSV Hợp Lệ

```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo,Viết báo cáo tháng 10,pending,2025-11-05
Họp team,Họp weekly,đang làm,2025-10-30
Review code,Kiểm tra code,completed,2025-10-28
```

### ❌ File Excel/CSV Không Hợp Lệ

```csv
Name,Info,State,Date
AB,This is too short title,invalid status,2020-01-01
```

**Lỗi:**
- Thiếu cột bắt buộc: "title"
- Dòng 2: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)
- Dòng 2: Trạng thái không hợp lệ "invalid status"

### ✅ File JSON Hợp Lệ

```json
{
  "tasks": [
    {
      "title": "Hoàn thành báo cáo",
      "description": "Viết báo cáo tháng 10",
      "status": "pending",
      "dueDate": "2025-11-05"
    },
    {
      "title": "Họp team weekly",
      "status": "in-progress"
    }
  ]
}
```

### ❌ File JSON Không Hợp Lệ

```json
{
  "tasks": [
    {
      "title": "AB",
      "status": "wrong",
      "dueDate": "invalid-date"
    }
  ]
}
```

**Lỗi:**
- Dòng 1: Tiêu đề quá ngắn (tối thiểu 3 ký tự, hiện tại: 2)
- Dòng 1: Trạng thái không hợp lệ "wrong"
- Dòng 1: Ngày hết hạn không hợp lệ "invalid-date"

---

## 🚨 **7. Error Handling Flow**

```
1. Frontend Validation (File type, size, basic format)
   ↓
2. Backend Parser (File structure, headers)
   ↓
3. Backend Validator (Each field, data integrity)
   ↓
4. Database Insert (Valid tasks only)
   ↓
5. Response (Success + Warnings hoặc Errors)
```

---

## 📚 **8. Tham Khảo Code**

- **Validator:** `backend/src/modules/task/helpers/taskValidator.js`
- **Excel/CSV Parser:** `backend/src/modules/task/helpers/excelParser.js`
- **Controller:** `backend/src/modules/task/task.controller.js`
- **Frontend:** `frontend/src/components/ImportExport.jsx`

---

## ⚙️ **9. Configuration**

### Thay đổi giới hạn (nếu cần):

```javascript
// backend/src/modules/task/helpers/taskValidator.js

const VALIDATION_RULES = {
  title: {
    minLength: 3,      // Thay đổi ở đây
    maxLength: 200,    // Thay đổi ở đây
    required: true
  },
  description: {
    maxLength: 1000    // Thay đổi ở đây
  }
};
```

```javascript
// backend/src/modules/task/task.controller.js

if (tasks.length > 100) {  // Thay đổi giới hạn số lượng tasks
  return res.status(400).json({...});
}
```

```javascript
// frontend/src/components/ImportExport.jsx

if (file.size > 5 * 1024 * 1024) {  // Thay đổi giới hạn file size
  toast.error('File quá lớn. Tối đa 5MB');
}
```

---

## 📞 **Support**

Nếu gặp vấn đề với validation, kiểm tra:
1. Console browser (F12) - Xem chi tiết errors/warnings
2. Server logs - Kiểm tra backend errors
3. File HUONG-DAN-IMPORT.md - Hướng dẫn sử dụng

