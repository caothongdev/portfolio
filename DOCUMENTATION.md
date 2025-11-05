# 🎨 Portfolio - Hoàng Cao Thống

[🔗 Live Preview](https://caothong.is-a.dev/)

Portfolio cá nhân hiện đại với Next.js 15, TypeScript, và Tailwind CSS. Tích hợp admin panel để quản lý blog và nội dung.

## 👨‍💻 Về tôi

**Hoàng Cao Thống**, 16 tuổi - Lập trình viên trẻ với tham vọng xây dựng thương hiệu cá nhân và tự do tài chính.

- 🎯 **Mục tiêu**: Trở thành entrepreneur công nghệ
- 🚀 **Chuyên môn**: Full-Stack Web Development
- 📚 **Học tập**: System Design, Product Thinking, Business Logic
- 🌟 **Định hướng**: Kết hợp lập trình với tư duy kinh doanh

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Analytics**: Vercel Analytics, Speed Insights
- **Deployment**: Vercel

## ✨ Tính năng chính

### 🎨 Giao diện người dùng
- ✅ Responsive Design cho mọi thiết bị
- ✅ Dark/Light Mode với next-themes
- ✅ Smooth Animations (Framer Motion & GSAP)
- ✅ Custom Cursor với hiệu ứng đặc biệt
- ✅ Grid Pattern Background động
- ✅ Modern UI với ShadCN Components

### 🔐 Admin Panel
- ✅ Blog Management (CRUD operations)
- ✅ Rich Text Editor cho nội dung
- ✅ Image Upload & Management
- ✅ Authentication với middleware
- ✅ Confirmation Dialogs
- ✅ Toast Notifications

### 🚀 Performance & SEO
- ✅ SEO Optimized (Metadata, OpenGraph)
- ✅ Image Optimization (WebP/AVIF)
- ✅ PWA Ready (manifest.json)
- ✅ Security Headers (CSP, X-Frame-Options)
- ✅ Vercel Analytics tích hợp
- ✅ Speed Insights

### 📝 Blog System
- ✅ Dynamic Blog Detail Pages
- ✅ Category & Tags Support
- ✅ Draft/Published Status
- ✅ LocalStorage Sync
- ✅ View Counter (ready)
- ✅ Search & Filter (ready)

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/caothongdev/portfolio.git
cd portfolio

# Cài đặt dependencies
npm install

# Tạo file environment
cp .env.example .env.local

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🔧 Environment Variables

Tạo file `.env.local`:

```env
# Admin Authentication
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_ADMIN_PASSWORD=admin123

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (optional)
CONTACT_EMAIL=caothongdev@gmail.com
```

Xem `.env.example` để biết tất cả các biến môi trường có sẵn.

## 📁 Cấu trúc dự án

```
portfolio/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin/        # Admin panel
│   │   ├── api/          # API routes
│   │   ├── blogs/        # Blog pages
│   │   └── projects/     # Projects page
│   ├── components/       # React components
│   │   ├── sections/     # Page sections
│   │   ├── ui/           # UI components
│   │   └── navbar/       # Navigation
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   ├── hooks/            # Custom hooks
│   └── assets/           # Static assets
├── public/               # Public files
│   ├── images/           # Images
│   ├── icons/            # Icons & favicons
│   └── manifest.json     # PWA manifest
└── middleware.ts         # Next.js middleware
```

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Check TypeScript types
```

## 🔒 Admin Panel

Truy cập admin panel tại `/admin`

**Mật khẩu mặc định**: `admin123` (đổi trong production!)

### Tính năng Admin:
- ✅ Quản lý blogs
- ✅ Tạo/sửa/xóa blog posts
- ✅ Upload hình ảnh
- ✅ Rich text editor
- ✅ Draft/Publish workflow

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Hoặc kết nối GitHub repo với Vercel để tự động deploy.

### Environment Variables trong Production

Đảm bảo set các biến sau trong Vercel dashboard:
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`
- Các biến email service (nếu dùng)

## 📝 Sử dụng

### Thêm Blog mới

1. Truy cập `/admin`
2. Nhập mật khẩu admin
3. Click "New Blog"
4. Điền thông tin và nội dung
5. Click "Save" hoặc "Publish"

### Tùy chỉnh nội dung

Edit file `src/app/data.ts` để thay đổi:
- Thông tin cá nhân
- Kinh nghiệm làm việc
- Dự án
- Kỹ năng
- Liên kết mạng xã hội

## 🎨 Customization

### Màu sắc

Edit `tailwind.config.ts` để thay đổi theme:

```ts
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... },
    }
  }
}
```

### Fonts

Thay đổi font trong `src/app/layout.tsx`:

```ts
import { YourFont } from "next/font/google";
```

## 🐛 Troubleshooting

### Build lỗi

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript errors

```bash
npm run typecheck
```

### Linting issues

```bash
npm run lint -- --fix
```

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

Contributions, issues và feature requests được chào đón!

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Liên hệ

**Hoàng Cao Thống**

- Website: [caothong.is-a.dev](https://caothong.is-a.dev)
- Email: caothongdev@gmail.com
- GitHub: [@caothongdev](https://github.com/caothongdev)
- LinkedIn: [caothongdev](https://www.linkedin.com/in/caothongdev)
- YouTube: [@caothongdev](https://youtube.com/@caothongdev)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel](https://vercel.com/)

---

⭐ **Star repository này nếu bạn thấy hữu ích!**

Made with ❤️ by Hoàng Cao Thống
