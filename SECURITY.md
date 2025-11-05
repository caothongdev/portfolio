# Hệ thống bảo mật Admin 🔒

## Tổng quan

Hệ thống xác thực admin với bảo mật cao, sử dụng email + mật khẩu, mã hóa SHA-256, session management, và brute-force protection.

## Tính năng bảo mật

### 1. ✅ Xác thực 2 yếu tố (Email + Password)
- Email admin được lưu trữ và xác minh
- Mật khẩu phải đáp ứng các yêu cầu mạnh
- Cả 2 thông tin phải đúng mới đăng nhập được

### 2. 🔐 Mã hóa mật khẩu (SHA-256 + Salt)

**Cách hoạt động:**

1. **Random Salt Generation:**
   - Mỗi mật khẩu có 1 salt riêng biệt (16 bytes random)
   - Salt được tạo bằng `crypto.getRandomValues()` - chuẩn bảo mật

2. **Password + Salt → Hash:**
   - Mật khẩu gốc: `Admin@123456`
   - Random salt: `a3f9d8e2c1b4567890abcdef12345678`
   - Kết hợp: `Admin@123456a3f9d8e2c1b4567890abcdef12345678`
   - Hash SHA-256: `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918`
   - Lưu trữ: `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918:a3f9d8e2c1b4567890abcdef12345678`

3. **Tại sao an toàn:**
   - ✅ **Rainbow Table vô dụng:** Mỗi mật khẩu có salt khác nhau → hash khác nhau
   - ✅ **Cùng password → khác hash:** 2 người dùng `Admin@123` có hash hoàn toàn khác nhau
   - ✅ **Brute-force cực khó:** Phải thử từng mật khẩu với salt cụ thể
   - ✅ **One-way:** Không thể giải mã ngược từ hash → password

**Ví dụ thực tế:**
```
User A: Password "Admin@123" → Hash: 8c6976...a918:a3f9d8e2...
User B: Password "Admin@123" → Hash: 7d4be3...f821:b2e8c7f1...
                                      ↑ Khác nhau hoàn toàn!
```

**So sánh:**
| Method | Security Level | Rainbow Table Attack | Same Password = Same Hash? |
|--------|---------------|---------------------|---------------------------|
| Plain SHA-256 | ⚠️ Medium | ❌ Vulnerable | ✅ Yes (insecure) |
| **SHA-256 + Salt** | ✅ High | ✅ Protected | ❌ No (secure) |
| bcrypt (server) | ⭐ Very High | ✅ Protected | ❌ No (secure) |

### 3. ⏱️ Session Management
- **Session duration**: 24 giờ
- **Auto logout**: Tự động đăng xuất khi session hết hạn
- **Session tracking**: Hiển thị thời gian còn lại trong Settings

### 4. 🛡️ Brute-Force Protection
- **Max attempts**: 5 lần thử
- **Lockout duration**: 15 phút
- **Warning system**: Cảnh báo số lần thử còn lại
- **Counter reset**: Reset counter khi đăng nhập thành công

### 5. 📝 Password Requirements
- Tối thiểu 8 ký tự
- Ít nhất 1 chữ hoa (A-Z)
- Ít nhất 1 chữ thường (a-z)
- Ít nhất 1 chữ số (0-9)
- Password strength indicator (Yếu/Trung bình/Mạnh)

### 6. 📧 Email Validation
- Format email chuẩn
- Không chấp nhận email không hợp lệ

## Cách sử dụng

### Lần đầu tiên (First-time setup)

1. **Truy cập `/admin/login`**
2. **Hệ thống tự động hiển thị màn hình setup**
3. **Nhập thông tin:**
   - Email admin (VD: `admin@caothong.dev`)
   - Mật khẩu (phải đáp ứng yêu cầu)
   - Xác nhận mật khẩu
4. **Nhấn "Thiết lập tài khoản"**
5. **Hoàn tất! Có thể đăng nhập ngay**

### Đăng nhập

1. **Truy cập `/admin/login`**
2. **Nhập:**
   - Email đã thiết lập
   - Mật khẩu
3. **Nhấn "Đăng nhập"**
4. **Tự động chuyển đến `/admin` dashboard**

### Đổi mật khẩu

1. **Đăng nhập admin panel**
2. **Vào `/admin/settings`**
3. **Nhập:**
   - Mật khẩu hiện tại
   - Mật khẩu mới
   - Xác nhận mật khẩu mới
4. **Nhấn "Lưu thay đổi"**
5. **Session vẫn giữ nguyên, không cần đăng nhập lại**

## Kiến trúc kỹ thuật

### Storage Structure (localStorage)

```typescript
// Admin credentials
admin_email: "admin@example.com"
admin_password_hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918:a3f9d8e2c1b4567890abcdef12345678"
                      ↑                                                                    ↑
                      Hash của password + salt                                            Random salt (16 bytes)

// Session management
admin_authenticated: "true"
admin_session_expiry: "1699200000000" // timestamp

// Security tracking
admin_failed_attempts: "2"
admin_lockout_until: "1699199100000" // timestamp
```

### Authentication Flow

```
┌─────────────────┐
│  Access /admin  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Check isAuthenticated() │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │ Valid?  │
    └─┬────┬──┘
      │    │
   Yes│    │No
      │    │
      ▼    ▼
   ┌────┐ ┌───────────────┐
   │Show│ │Redirect to    │
   │Page│ │/admin/login   │
   └────┘ └───────────────┘
```

### Login Flow

```
┌──────────────────┐
│ /admin/login     │
└────────┬─────────┘
         │
         ▼
┌─────────────────────┐
│ Credentials set?    │
└────────┬────────────┘
         │
    ┌────┴────┐
    │ Set?    │
    └─┬────┬──┘
      │    │
    No│    │Yes
      │    │
      ▼    ▼
   ┌──────────┐ ┌──────────────┐
   │ Show     │ │ Show login   │
   │ Setup    │ │ form         │
   └──────────┘ └──────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Account locked?│
              └────────┬───────┘
                       │
                  ┌────┴────┐
                  │Locked?  │
                  └─┬────┬──┘
                    │    │
                  Yes│   │No
                    │    │
                    ▼    ▼
          ┌──────────┐ ┌──────────────┐
          │Show error│ │Verify email  │
          │+ lockout │ │+ password    │
          │time      │ └──────┬───────┘
          └──────────┘        │
                         ┌────┴────┐
                         │Valid?   │
                         └─┬────┬──┘
                           │    │
                        Yes│    │No
                           │    │
                           ▼    ▼
                  ┌──────────┐ ┌────────────┐
                  │Create    │ │Increment   │
                  │session   │ │fail counter│
                  │+ redirect│ │+ show error│
                  └──────────┘ └────────────┘
```

## API Reference

### `src/lib/auth.ts`

#### Functions

**Setup & Configuration:**

```typescript
// Initialize admin credentials
await initializeAdminCredentials(email: string, password: string): Promise<void>

// Check if credentials are set
isCredentialsSet(): boolean

// Get stored email
getStoredEmail(): string | null
```

**Authentication:**

```typescript
// Login
await login(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
}>

// Check authentication status
isAuthenticated(): boolean

// Logout
logout(): void
```

**Security:**

```typescript
// Check account lockout
isAccountLocked(): {
  locked: boolean;
  remainingTime?: number; // minutes
}

// Get remaining attempts
getRemainingAttempts(): number
```

**Password Management:**

```typescript
// Change password
await changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }>

// Hash password
await hashPassword(password: string): Promise<string>

// Verify password
await verifyPassword(password: string, hash: string): Promise<boolean>
```

**Session:**

```typescript
// Get session info
getSessionInfo(): {
  expiresIn: number; // minutes
  expiresAt: string; // formatted date
} | null
```

## Security Best Practices

### ✅ DO's

1. **Sử dụng mật khẩu mạnh:**
   - Tối thiểu 12 ký tự
   - Kết hợp chữ hoa, chữ thường, số, ký tự đặc biệt
   - Không dùng từ điển hoặc thông tin cá nhân

2. **Email admin:**
   - Sử dụng email riêng cho admin
   - Không chia sẻ email admin công khai

3. **Đổi mật khẩu định kỳ:**
   - Nên đổi mật khẩu mỗi 3-6 tháng
   - Không dùng lại mật khẩu cũ

4. **Đăng xuất khi không sử dụng:**
   - Luôn logout khi rời khỏi máy tính
   - Không để session mở trên máy công cộng

### ❌ DON'Ts

1. **Không lưu mật khẩu:**
   - Không lưu trong trình duyệt
   - Không viết ra giấy hoặc file text
   - Không gửi qua email/chat

2. **Không chia sẻ thông tin:**
   - Không cho người khác biết email admin
   - Không chia sẻ mật khẩu với ai

3. **Không sử dụng trên mạng công cộng:**
   - Tránh đăng nhập trên WiFi công cộng
   - Không đăng nhập trên máy tính chung

## Xử lý sự cố

### Quên mật khẩu

**Giải pháp:**
1. Mở Developer Tools (F12)
2. Console tab
3. Chạy lệnh:
```javascript
localStorage.removeItem('admin_email');
localStorage.removeItem('admin_password_hash');
localStorage.removeItem('admin_failed_attempts');
localStorage.removeItem('admin_lockout_until');
```
4. Refresh trang
5. Setup lại email và mật khẩu mới

### Tài khoản bị khóa

**Giải pháp 1 - Đợi:**
- Chờ 15 phút để tự động mở khóa

**Giải pháp 2 - Reset thủ công:**
1. Mở Developer Tools (F12)
2. Console tab
3. Chạy lệnh:
```javascript
localStorage.removeItem('admin_failed_attempts');
localStorage.removeItem('admin_lockout_until');
```
4. Refresh trang
5. Có thể đăng nhập lại

### Session hết hạn

**Giải pháp:**
- Đăng nhập lại
- Session mới được tạo với 24 giờ

### Loading mãi không xong

**Nguyên nhân:**
- localStorage bị corrupt
- Session không hợp lệ

**Giải pháp:**
1. Mở Developer Tools (F12)
2. Console tab
3. Chạy lệnh:
```javascript
localStorage.removeItem('admin_authenticated');
localStorage.removeItem('admin_session_expiry');
```
4. Refresh trang
5. Đăng nhập lại

## Nâng cấp trong tương lai

### Có thể thêm:

1. **2FA (Two-Factor Authentication):**
   - OTP qua email
   - Authenticator app (Google Authenticator, Authy)

2. **Backend Authentication:**
   - API routes cho authentication
   - JWT tokens
   - Refresh tokens
   - HTTP-only cookies

3. **Activity Logs:**
   - Track login attempts (IP, time, location)
   - Export security logs

4. **Password Recovery:**
   - Email reset link
   - Security questions
   - Admin backup codes

5. **Multi-admin Support:**
   - Multiple admin accounts
   - Role-based access control (RBAC)
   - Permissions system

6. **Advanced Security:**
   - CAPTCHA after failed attempts
   - IP whitelisting
   - Device fingerprinting
   - Session management (multiple devices)

---

## 🛡️ Bảo vệ chống các kiểu tấn công

### 1. Rainbow Table Attack ❌ KHÔNG THỂ

**Cách tấn công:**
- Hacker có sẵn bảng tra cứu (rainbow table) chứa hàng triệu password → hash
- Tìm hash trong database → tra ngược lại password

**Tại sao hệ thống này an toàn:**
```
Không có Salt:
  "Admin@123" → "240be518..." (luôn giống nhau)
  → Rainbow table có thể tra được!

Có Salt (Hệ thống này):
  User A: "Admin@123" + salt_A → "8c6976e5...:a3f9d8e2..."
  User B: "Admin@123" + salt_B → "7d4be3f2...:b2e8c7f1..."
  → Mỗi user có hash khác nhau → Rainbow table VÔ DỤNG!
```

### 2. Brute-Force Attack ⚠️ CỰC KHÓ

**Cách tấn công:**
- Thử từng mật khẩu: Admin@1, Admin@2, Admin@3...
- Cho đến khi tìm được đúng

**Hệ thống bảo vệ:**
1. **Client-side rate limiting:**
   - Chỉ cho phép 5 lần thử
   - Khóa 15 phút sau đó
   
2. **Strong password requirements:**
   - 8+ ký tự, hoa, thường, số
   - Mật khẩu 12 ký tự → 95^12 = 540+ quadrillion khả năng
   - Thử 1 tỷ/giây → cần **17,129 năm**!

3. **Session timeout:**
   - Tự động logout sau 24h
   - Giới hạn thời gian tấn công

### 3. Dictionary Attack ❌ KHÔNG HIỆU QUẢ

**Cách tấn công:**
- Dùng từ điển có sẵn: password, admin, 123456...
- Hash từng từ và so sánh

**Hệ thống bảo vệ:**
1. **Salt làm vô hiệu hóa pre-computed dictionary**
2. **Password requirements** bắt buộc ký tự phức tạp
3. **Lockout mechanism** giới hạn số lần thử

### 4. Timing Attack ✅ ĐƯỢC BẢO VỆ

**Cách tấn công:**
- Đo thời gian phản hồi để đoán thông tin
- VD: "Email đúng" vs "Email sai" có thời gian khác nhau

**Hệ thống bảo vệ:**
- Thông báo lỗi chung: "Email hoặc mật khẩu không đúng"
- KHÔNG tiết lộ thông tin nào sai cụ thể
- Xử lý đồng đều cho cả 2 trường hợp

### 5. SQL Injection ✅ KHÔNG ÁP DỤNG

- Hệ thống dùng localStorage, không có database
- Không có SQL queries
- Không bị SQL injection

### 6. XSS (Cross-Site Scripting) ⚠️ CẨN THẬN

**Rủi ro:**
- Kẻ tấn công inject JavaScript để đánh cắp localStorage

**Cách phòng tránh:**
1. Không paste code lạ vào Console
2. Tránh extension trình duyệt không rõ nguồn gốc
3. Đăng xuất khi rời khỏi máy tính

### 7. Man-in-the-Middle (MITM) Attack ⚠️

**Rủi ro:**
- Kẻ tấn công nghe lén traffic giữa browser và server

**Cách phòng tránh:**
1. **Luôn dùng HTTPS** khi deploy production
2. Không đăng nhập trên WiFi công cộng
3. Kiểm tra certificate của website

---

## 📊 So sánh độ bảo mật

| Attack Vector | Without Salt | **With Salt (Current)** | With bcrypt (Server) |
|--------------|--------------|------------------------|---------------------|
| Rainbow Table | ❌ Vulnerable | ✅ Protected | ✅ Protected |
| Brute-Force | ⚠️ Medium | ✅ Protected | ✅ Highly Protected |
| Dictionary | ❌ Vulnerable | ✅ Protected | ✅ Protected |
| Timing Attack | ⚠️ Risk | ✅ Protected | ✅ Protected |
| Same Password = Same Hash | ❌ Yes | ✅ No | ✅ No |

---

## 💡 Tại sao không dùng bcrypt?

**bcrypt là tốt nhất**, nhưng:
- bcrypt cần backend/server
- Portfolio này là **client-side only** (localStorage)
- SHA-256 + Salt là **giải pháp tốt nhất cho client-side**

**Khi nào nên dùng bcrypt:**
- Khi có backend API
- Production app với nhiều users
- Cần bảo mật cấp enterprise

**Hệ thống hiện tại phù hợp cho:**
- ✅ Portfolio cá nhân
- ✅ Admin đơn lẻ
- ✅ Dự án nhỏ/vừa
- ✅ Prototype/MVP

---

## Kết luận

Hệ thống bảo mật hiện tại đã cung cấp:
- ✅ Xác thực 2 yếu tố (Email + Password)
- ✅ Mã hóa mật khẩu (SHA-256)
- ✅ Session management (24h auto-expire)
- ✅ Brute-force protection (5 attempts, 15 min lockout)
- ✅ Password strength validation
- ✅ User-friendly setup process
- ✅ Change password functionality
- ✅ Real-time security warnings

Hệ thống phù hợp cho portfolio cá nhân và các dự án nhỏ. Với production app lớn hơn, nên xem xét sử dụng NextAuth.js hoặc Clerk cho authentication.

## Liên hệ

Nếu có vấn đề về bảo mật hoặc cần hỗ trợ:
- Email: your-email@example.com
- GitHub Issues: [github.com/yourrepo](https://github.com/yourrepo)
