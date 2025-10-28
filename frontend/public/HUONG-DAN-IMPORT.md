# 📥 HƯỚNG DẪN IMPORT CÔNG VIỆC

## 🎯 Các định dạng hỗ trợ
- ✅ **CSV** (mở được bằng Excel)
- ✅ **Excel** (.xlsx, .xls)
- ✅ **JSON**
- ✅ **Paste text** (danh sách dòng)

## 📊 Cấu trúc file Excel/CSV

### Các cột bắt buộc:
| Tên cột (English) | Tên cột (Tiếng Việt) | Bắt buộc | Mô tả |
|------------------|---------------------|----------|-------|
| Title | Tiêu đề / Tên công việc | ✅ Có | Tên của công việc |
| Description | Mô tả / Nội dung | ❌ Không | Mô tả chi tiết công việc |
| Status | Trạng thái | ❌ Không | pending / in-progress / completed |
| Due Date | Ngày hết hạn / Hạn chót | ❌ Không | Định dạng: YYYY-MM-DD |

### Giá trị Status hợp lệ:
- `pending` - Chờ xử lý (mặc định)
- `in-progress` - Đang làm
- `completed` - Hoàn thành

### Ví dụ file CSV:
```csv
Title,Description,Status,Due Date
Hoàn thành báo cáo,Viết báo cáo tháng 10,pending,2025-11-05
Họp team,Họp weekly,in-progress,2025-10-30
Review code,Kiểm tra code mới,pending,2025-11-01
```

### Ví dụ file CSV tiếng Việt:
```csv
Tiêu đề,Mô tả,Trạng thái,Ngày hết hạn
Hoàn thành báo cáo,Viết báo cáo tháng 10,pending,2025-11-05
Họp team,Họp weekly,in-progress,2025-10-30
```

## 📋 Cấu trúc file JSON

```json
[
  {
    "title": "Hoàn thành báo cáo",
    "description": "Viết báo cáo tháng 10",
    "status": "pending",
    "dueDate": "2025-11-05"
  },
  {
    "title": "Họp team weekly",
    "description": "Họp tổng kết tuần",
    "status": "in-progress",
    "dueDate": "2025-10-30"
  }
]
```

Hoặc:
```json
{
  "tasks": [
    {
      "title": "Task 1",
      "description": "...",
      "status": "pending"
    }
  ]
}
```

## 🚀 Cách import:

### 1. Import từ file Excel/CSV:
1. Mở ứng dụng
2. Click nút **"📂 Import/Export"**
3. Chọn **"📂 Chọn file (JSON/Excel/CSV)"**
4. Chọn file của bạn
5. Hệ thống sẽ tự động import

### 2. Import từ paste text:
1. Click nút **"📂 Import/Export"**
2. Chọn **"📋 Paste danh sách"**
3. Paste danh sách công việc (mỗi dòng 1 task)
4. Click **"✅ Import"**

**Ví dụ paste text:**
```
- Hoàn thành báo cáo
- Gọi điện cho khách hàng
- Review code

Hoặc:

1. Task đầu tiên
2. Task thứ hai
3. Task thứ ba
```

## ⚠️ Giới hạn:
- ✅ Tối đa **100 công việc** mỗi lần import
- ✅ Kích thước file tối đa: **5MB**
- ✅ Ít nhất phải có cột **Title** (tiêu đề)

## 📁 File mẫu:
- `mau-import-cong-viec.csv` - File mẫu tiếng Anh
- `mau-import-tieng-viet.csv` - File mẫu tiếng Việt
- `sample-tasks.json` - File mẫu JSON
- `sample-tasks.csv` - File mẫu CSV gốc

## 💡 Tips:
1. Nếu dùng Excel, lưu file dưới dạng `.xlsx` hoặc `.csv`
2. Đảm bảo cột "Title" không để trống
3. Ngày tháng nên dùng định dạng: YYYY-MM-DD (VD: 2025-11-05)
4. Status chỉ nhận: pending, in-progress, completed
5. Nếu để trống Status, mặc định sẽ là "pending"

## ❓ Xử lý lỗi:
- Nếu có task nào không hợp lệ, hệ thống sẽ bỏ qua và import những task hợp lệ
- Kiểm tra console log để xem chi tiết lỗi
- Thông báo sẽ hiện: "Import thành công X/Y công việc"

