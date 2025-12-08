# 📚 Books Feature - Hướng Dẫn Sử Dụng

## Tổng Quan

Tính năng Books đã được tích hợp hoàn chỉnh vào portfolio của bạn với thiết kế brutalist đẹp mắt, giống với HTML mẫu "Show Your Work!" mà bạn đã cung cấp.

## ✨ Tính Năng Đã Implement

### 1. **Database Schema** ✅
- Bảng `books` với đầy đủ các trường
- Row Level Security (RLS) policies
- Indexes cho performance
- Auto-update timestamp trigger

### 2. **Backend (API & Logic)** ✅
- `src/lib/book-manager.ts` - CRUD operations
- `src/app/api/books/route.ts` - REST API endpoints
- TypeScript types đầy đủ

### 3. **Public Pages** ✅
- `/books` - Danh sách tất cả sách với filter theo category
- `/books/[slug]` - Chi tiết sách với modals interactive
- Design brutalist với Material Symbols icons
- Responsive và interactive

### 4. **Admin Pages** ✅
- `/admin/books` - Quản lý danh sách sách
- `/admin/books/new` - Thêm sách mới
- `/admin/books/edit/[slug]` - Chỉnh sửa sách (cần implement thêm)
- Rich text editor, image upload, tags, key takeaways

### 5. **Homepage Integration** ✅
- Component `Books` hiển thị 3 sách mới nhất
- Tích hợp vào homepage giữa Blogs và Skills

## 🚀 Cách Sử Dụng

### Bước 1: Run Migration
```bash
# Chạy migration để tạo bảng books trong Supabase
# Trong Supabase Dashboard > SQL Editor, paste nội dung từ:
# supabase/migrations/002_books_schema.sql
```

### Bước 2: Thêm Sách Mới
1. Đăng nhập vào Admin Panel: `/admin/login`
2. Vào **Books** trong sidebar
3. Click **"Thêm Sách Mới"**
4. Điền thông tin:
   - **Tên sách** (required)
   - **Tác giả** (required)
   - **Ảnh bìa** (upload hoặc URL)
   - **Thể loại** (Self-help, Business, Fiction...)
   - **Đánh giá** (1-5 sao)
   - **Tags** (nhấn Enter sau mỗi tag)
   - **Tóm tắt ngắn**
   - **Key Takeaways** (điểm chính rút ra)
   - **Nội dung chi tiết** (rich text editor)
   - **Ngày đọc**
   - **Xuất bản** checkbox

### Bước 3: Quản Lý Sách
- **Xem**: Click icon mắt để xem sách trên trang public
- **Sửa**: Click icon bút để chỉnh sửa
- **Xóa**: Click icon thùng rác
- **Toggle Publish**: Click nút "Công khai"/"Nháp"
- **Search**: Tìm kiếm theo tên, tác giả, tóm tắt
- **Filter**: Lọc theo trạng thái (Tất cả/Công khai/Nháp)

## 📁 Cấu Trúc File Đã Tạo

```
portfolio/
├── supabase/
│   └── migrations/
│       └── 002_books_schema.sql       # Database schema
├── src/
│   ├── types/
│   │   └── book.ts                    # TypeScript types
│   ├── lib/
│   │   └── book-manager.ts            # CRUD logic
│   ├── app/
│   │   ├── api/books/
│   │   │   └── route.ts               # API endpoints
│   │   ├── books/
│   │   │   ├── page.tsx               # Books list page
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Book detail page
│   │   └── admin/books/
│   │       ├── page.tsx               # Admin books list
│   │       └── new/
│   │           └── page.tsx           # Create new book
│   └── components/
│       └── sections/
│           └── books.tsx              # Homepage books section
```

## 🎨 Design Features

### Brutalist Design
- Border 4px màu đen
- Shadow effect: `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
- Hover animations: `-translate-y-1`
- Font: Patrick Hand (handwritten), Open Sans (body)
- Material Symbols icons
- Màu chủ đạo: Yellow (#fde047), Black, White

### Interactive Elements
- Modal popups cho Key Takeaways
- Smooth transitions
- Responsive grid layout
- Category filters với button states
- Star rating display (★★★★★)

## 🔧 Next Steps (Tùy chọn)

### 1. Tạo trang Edit Book
Tạo file `src/app/admin/books/edit/[slug]/page.tsx` tương tự `new/page.tsx` nhưng:
- Fetch dữ liệu sách hiện tại
- Pre-fill form
- Use PUT method thay vì POST

### 2. Add More Features
- Export/Import books (JSON format)
- Batch operations (delete multiple books)
- Advanced filtering (by tags, rating, date range)
- Reading progress tracker
- Related books suggestions

### 3. SEO Optimization
- Add metadata cho mỗi book page
- Generate sitemap cho books
- Structured data (Schema.org Book markup)

## 📝 Ví Dụ Book Data

```json
{
  "title": "Show Your Work!",
  "author": "Austin Kleon",
  "category": "Self-help",
  "rating": 5,
  "summary": "10 cách để chia sẻ sự sáng tạo và được mọi người biết đến.",
  "tags": ["creativity", "marketing", "personal-brand"],
  "key_takeaways": [
    "Không cần phải là thiên tài",
    "Tư duy quá trình, không phải thành phẩm",
    "Chia sẻ điều nhỏ bé mỗi ngày"
  ],
  "published": true
}
```

## 🎯 Tips

1. **Ảnh bìa**: Dùng ảnh tỷ lệ 2:3 (portrait) cho đẹp
2. **Key Takeaways**: Nên có 3-10 điểm chính
3. **Tags**: Dùng 3-7 tags mỗi sách
4. **Content**: Nên có ít nhất 300-500 từ để SEO tốt

## 🐛 Troubleshooting

### Lỗi "Book not found"
- Kiểm tra slug có đúng không
- Kiểm tra book có published = true không (nếu xem ở public page)

### Lỗi khi upload ảnh
- Kiểm tra Supabase Storage bucket đã được tạo chưa
- Kiểm tra policies của storage bucket

### Không thấy Books section trên homepage
- Đảm bảo có ít nhất 1 book với `published = true`
- Check console log có lỗi không

---

**Enjoy your new Books feature! 📚✨**
