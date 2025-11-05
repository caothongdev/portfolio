# ⚡ Quick Start Guide

## 🚀 Khởi động nhanh trong 3 phút

### 1️⃣ Clone & Install (1 phút)
```bash
cd c:\Users\Min Di Pc\Desktop\portfolio
npm install
```

### 2️⃣ Environment Setup (30 giây)
File `.env.local` đã được tạo sẵn với:
```env
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3️⃣ Run Development (30 giây)
```bash
npm run dev
```

Mở **http://localhost:3000** 🎉

---

## 🎯 Những gì bạn có thể làm NGAY BÂY GIỜ:

### ✅ Trang chủ
- ✨ Xem portfolio với dark/light mode
- 📱 Test responsive trên mobile
- 🎨 Smooth animations và custom cursor

### ✅ Admin Panel
1. Truy cập: **http://localhost:3000/admin**
2. Password: **admin123**
3. Tạo blog mới:
   - Click "New Blog"
   - Điền thông tin
   - Upload hình ảnh
   - Click "Publish"

### ✅ Blog Detail
- Xem blog tại `/blogs/[tên-blog]`
- Full content với rich text
- Categories, tags, author info

---

## 📝 Tùy chỉnh nội dung

### Thông tin cá nhân
Edit: `src/app/data.ts`

```typescript
export const DATA = {
  HEADER: {
    NAME: "Tên của bạn",        // 👈 Đổi tên
    EMAIL: "email@gmail.com",   // 👈 Đổi email
    GITHUB: "https://github.com/username", // 👈 Đổi links
    // ... etc
  }
}
```

### Màu sắc theme
Edit: `tailwind.config.ts`

```typescript
colors: {
  primary: { ... },    // 👈 Đổi màu chính
  secondary: { ... },  // 👈 Đổi màu phụ
}
```

### Font chữ
Edit: `src/app/layout.tsx`

```typescript
import { YourFont } from "next/font/google";
// 👈 Thay Outfit bằng font khác
```

---

## 🔧 Commands hữu ích

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run start            # Start production server

# Code Quality
npm run lint             # Check linting
npm run format           # Format code
npm run typecheck        # Check TypeScript
```

---

## 🎨 Cấu trúc nhanh

```
portfolio/
├── src/app/          👈 Pages & routing
│   ├── page.tsx      → Trang chủ
│   ├── admin/        → Admin panel
│   ├── blogs/        → Blog pages
│   ├── api/          → API endpoints
│   └── data.ts       → 🔥 EDIT ĐẦU TIÊN
│
├── src/components/   👈 React components
│   ├── sections/     → Page sections
│   └── ui/           → UI components
│
├── public/           👈 Static files
│   ├── images/       → 📷 Add images here
│   └── icons/        → 🎨 Add icons here
│
└── .env.local        👈 🔒 Config
```

---

## 🚀 Deploy trong 5 phút

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts → Done! 🎉
```

### Option 2: Vercel Dashboard
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select repo → Deploy
5. Done! 🎉

**Don't forget:** Set `ADMIN_PASSWORD` in Vercel dashboard!

---

## 💡 Tips

### Tip 1: Admin Panel
```
URL: /admin
Password: admin123 (change in production!)
```

### Tip 2: Blog URLs
```
Create blog with title "My First Blog"
→ URL: /blogs/My%20First%20Blog
```

### Tip 3: Images
```
Upload via admin panel
Or place in public/images/
```

### Tip 4: Dark Mode
Click theme toggle (top right)
Or press keyboard shortcut

---

## ⚠️ Troubleshooting

### Port đã được sử dụng?
```bash
# Tự động chuyển sang port khác (3001, 3002...)
npm run dev
```

### Build lỗi?
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript errors?
```bash
npm run typecheck
```

---

## 📚 Đọc thêm

- `SETUP_COMPLETE.md` - Hướng dẫn đầy đủ tính năng
- `DOCUMENTATION.md` - Documentation chi tiết
- `COMPLETED.md` - Tổng kết những gì đã làm
- `README.md` - Project overview

---

## 🎉 Bạn đã sẵn sàng!

Portfolio của bạn đang chạy và sẵn sàng để:
- ✅ Thêm nội dung
- ✅ Tùy chỉnh giao diện
- ✅ Viết blog
- ✅ Deploy lên internet

**Happy coding! 🚀**

---

Need help? Email: caothongdev@gmail.com
