# Hệ thống theo dõi hoạt động Real-time 🔄

## Tổng quan

Hệ thống theo dõi hoạt động real-time cho phép admin dashboard hiển thị các hoạt động ngay lập tức mà không cần refresh trang. Sử dụng CustomEvent API của trình duyệt để tạo pub/sub pattern.

## Kiến trúc

### 1. ActivityLogger (`src/lib/activity-logger.ts`)

**Core System:**
- Lưu trữ activities trong `localStorage`
- Phát sóng CustomEvent khi có activity mới
- Hỗ trợ 9 loại activity

**Activity Types:**
```typescript
- blog_created   // Tạo blog mới
- blog_updated   // Cập nhật blog
- blog_deleted   // Xóa blog
- blog_viewed    // Xem blog
- contact_sent   // Gửi contact form
- export         // Xuất dữ liệu
- import         // Nhập dữ liệu
- login          // Đăng nhập admin
- logout         // Đăng xuất admin
```

**Helper Functions:**
```typescript
logActivity.blogCreated(title: string)
logActivity.blogUpdated(title: string)
logActivity.blogDeleted(title: string)
logActivity.blogViewed(title: string)
logActivity.contactSent(name: string, email: string)
logActivity.dataExported()
logActivity.dataImported()
logActivity.adminLogin()
logActivity.adminLogout()
```

### 2. RecentActivities Component (`src/components/ui/recent-activities.tsx`)

**Features:**
- Tự động cập nhật khi có activity mới
- Hiển thị icon và màu sắc theo loại activity
- Format thời gian relative (vừa xong, 5 phút trước, etc.)
- Hỗ trợ giới hạn số lượng hiển thị

**Event Listeners:**
```typescript
// Lắng nghe activity mới
window.addEventListener('activity-logged', handleActivityLogged);

// Lắng nghe xóa activity
window.addEventListener('activity-deleted', handleActivityDeleted);

// Lắng nghe xóa toàn bộ
window.addEventListener('activities-cleared', handleActivitiesCleared);
```

## Cách hoạt động

### Flow Real-time:

1. **User thực hiện action** (VD: tạo blog mới)
2. **Call helper function**: `logActivity.blogCreated(title)`
3. **ActivityLogger lưu vào localStorage**
4. **Dispatch CustomEvent**: `window.dispatchEvent(new CustomEvent('activity-logged'))`
5. **RecentActivities component nhận event**
6. **Component tự động reload activities**
7. **UI cập nhật ngay lập tức** ✨

### Ví dụ Integration:

```typescript
// Trong admin/blogs/new/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  // ... validation ...
  
  blogManager.addBlog(formData.title, blogData);
  logActivity.blogCreated(formData.title); // 👈 Log activity
  
  router.push("/admin/blogs");
};
```

## Tích hợp hiện tại

### ✅ Đã tích hợp đầy đủ:

1. **Admin Dashboard** (`src/app/admin/page.tsx`)
   - Hiển thị RecentActivities component
   - Stats động (số lượng blog, tổng lượt xem)

2. **Blog Management** (`src/app/admin/blogs/page.tsx`)
   - Delete blog → `logActivity.blogDeleted()`
   - Export data → `logActivity.dataExported()`

3. **Blog Create** (`src/app/admin/blogs/new/page.tsx`)
   - Create blog → `logActivity.blogCreated()`

4. **Blog Edit** (`src/app/admin/blogs/edit/[slug]/page.tsx`)
   - Update blog → `logActivity.blogUpdated()`

5. **Blog View** (`src/app/blogs/[slug]/page.tsx`)
   - View blog → `logActivity.blogViewed()`

6. **Admin Auth** (`src/app/admin/login/page.tsx`, `src/app/admin/layout.tsx`)
   - Login → `logActivity.adminLogin()`
   - Logout → `logActivity.adminLogout()`

## Cách sử dụng

### Hiển thị Recent Activities:

```tsx
import { RecentActivities } from "@/components/ui/recent-activities";

export default function Dashboard() {
  return (
    <div>
      <RecentActivities limit={5} />
    </div>
  );
}
```

### Log Activity mới:

```typescript
import { logActivity } from "@/lib/activity-logger";

// Tạo blog
logActivity.blogCreated("Tiêu đề blog");

// Xóa blog
logActivity.blogDeleted("Tiêu đề blog");

// Custom activity
import { ActivityLogger } from "@/lib/activity-logger";

ActivityLogger.getInstance().log({
  type: 'blog_created',
  title: 'Custom activity',
  description: 'Mô tả chi tiết',
});
```

### Lấy activities từ ActivityLogger:

```typescript
import { ActivityLogger } from "@/lib/activity-logger";

const logger = ActivityLogger.getInstance();

// Lấy tất cả
const all = logger.getAll();

// Lấy 10 gần nhất
const recent = logger.getRecent(10);

// Lấy theo type
const blogActivities = logger.getByType('blog_created');

// Lấy 7 ngày gần đây
const thisWeek = logger.getFromLastDays(7);

// Xóa activity
logger.delete(activityId);

// Xóa tất cả
logger.clearAll();
```

## Testing Real-time

### Cách kiểm tra:

1. **Mở Admin Dashboard** (`/admin`)
2. **Để dashboard mở**, mở tab mới
3. **Thực hiện actions:**
   - Tạo blog mới → Thấy "📝 Tạo blog mới" xuất hiện ngay
   - Xem blog → Thấy "👁️ Xem blog" xuất hiện ngay
   - Xóa blog → Thấy "🗑️ Xóa blog" xuất hiện ngay
   - Logout → Thấy "🚪 Đăng xuất" xuất hiện ngay

4. **Không cần refresh** - tất cả update tự động! ✨

## Technical Details

### Storage Structure:

```typescript
// localStorage key: 'recent_activities'
{
  "activity-1234567890": {
    id: "activity-1234567890",
    type: "blog_created",
    title: "Tạo blog mới",
    description: "Tạo blog: 'Tiêu đề blog'",
    timestamp: "2024-01-15T10:30:00.000Z"
  },
  // ...
}
```

### CustomEvent Pattern:

```typescript
// Gửi event
window.dispatchEvent(new CustomEvent('activity-logged', {
  detail: { activity }
}));

// Nhận event
window.addEventListener('activity-logged', (e) => {
  const { activity } = e.detail;
  // Update UI
});
```

## Performance

- **Lightweight**: Chỉ sử dụng browser APIs (no external dependencies)
- **Fast**: CustomEvent pattern cực nhanh
- **Scalable**: localStorage limit ~5-10MB, đủ cho hàng nghìn activities
- **Memory efficient**: Event listeners tự động cleanup với useEffect

## Future Enhancements

Có thể mở rộng với:

1. **WebSocket** cho multi-user real-time (nếu có backend)
2. **IndexedDB** thay localStorage cho datasets lớn hơn
3. **Filters** cho activity list (theo type, theo date range)
4. **Export/Import** activities
5. **Activity Analytics** (charts, stats)
6. **Notifications** (toast khi có activity mới)
7. **Search** trong activities

## Kết luận

Hệ thống real-time activity tracking đã hoàn thành và hoạt động tốt! 🎉

Mọi thao tác của admin đều được track và hiển thị ngay lập tức trên dashboard mà không cần refresh trang.
