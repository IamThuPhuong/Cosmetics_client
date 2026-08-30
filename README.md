# LuxeBeauty - Nền Tảng Thương Mại Điện Tử Mỹ Phẩm & Son Môi (Frontend)

Ứng dụng thương mại điện tử chuyên cung cấp son môi, mỹ phẩm cao cấp và bộ trang điểm. Dự án được xây dựng với kiến trúc hiện đại, hiệu năng cao trên nền tảng **Next.js 16 (App Router)** và tích hợp hệ thống API Backend Spring Boot bảo mật cao với Spring Security & JWT.

---

## 🌟 Công Nghệ Sử Dụng (Tech Stack)

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Lucide React Icons](https://lucide.dev/)
- **State Management**: React Context API (`AuthContext`, `CartContext`)
- **Backend API Integration**: Spring Boot REST API (`http://localhost:8080/api/v1`)

---

## 📦 Cấu Trúc Thư Mục Dự Án

```text
Cosmetics_client/
├── app/                  # Next.js App Router (Trang, Layout, Routes)
│   ├── (auth)/           # Route nhóm: Login, Register
│   ├── admin/            # Phân hệ Quản trị viên (Dashboard, POS, Products, Orders, Users)
│   ├── cart/             # Trang Giỏ hàng
│   ├── checkout/         # Trang Thanh toán & Kết quả đặt hàng
│   ├── contact/          # Trang Liên hệ & CSKH
│   ├── orders/           # Trang Lịch sử đơn hàng & Chi tiết đơn
│   ├── product/          # Trang Chi tiết sản phẩm & Biến thể son
│   ├── products/         # Trang Khám phá sản phẩm & Bộ lọc
│   └── profile/          # Trang Hồ sơ cá nhân
├── components/           # UI Components tái sử dụng
│   ├── admin/            # Components dành riêng cho Admin
│   ├── common/           # ChatbotWidget, Notification, etc.
│   ├── home/             # HeroBanner, BrandBar, CategoryTabs, ProductCard
│   ├── layout/           # Header, Footer
│   └── ui/               # Base Radix/Tailwind components (Button, Input, Card...)
├── context/              # Quản lý State toàn cục (Auth, Cart)
├── lib/                  # Tiện ích chung (utils.ts)
├── public/               # Static assets & hình ảnh
├── services/             # API Client & Services tương tác Backend
├── types/                # TypeScript Interfaces & Types
└── ...config files       # package.json, tsconfig.json, next.config.ts...
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt thư viện dependencies:
```bash
npm install
# hoặc dùng pnpm:
pnpm install
```

### 2. Cấu hình biến môi trường:
Tạo file `.env.local` nếu cần tùy chỉnh URL Backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```
*(Nếu không cấu hình, ứng dụng mặc định trỏ về `http://localhost:8080/api/v1`)*

### 3. Khởi động môi trường Development:
```bash
npm run dev
# trên Windows PowerShell có thể dùng:
npm.cmd run dev
```

Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---

## 🛡️ Tích Hợp & Phân Quyền Hệ Thống

1. **Khách vãng lai (Public / permitAll)**:
   - Khám phá trang chủ, lọc sản phẩm theo thương hiệu/danh mục.
   - Xem chi tiết biến thể màu son, tư vấn cùng AI Chatbot.
   - Thêm giỏ hàng tạm và đặt hàng trực tiếp (Guest Checkout).
2. **Khách hàng đăng nhập (Authenticated)**:
   - Duy trì phiên đăng nhập với JWT Token lưu an toàn.
   - Đồng bộ giỏ hàng lên Database giữa nhiều thiết bị.
   - Xem và quản lý lịch sử đơn hàng, hủy đơn khi ở trạng thái chờ.
3. **Quản trị viên (ROLE_ADMIN)**:
   - Bảng điều khiển doanh thu trực quan, biểu đồ tăng trưởng.
   - Quản lý sản phẩm, danh mục, thương hiệu, kiểm soát tồn kho.
   - Xử lý đơn hàng, đổi trạng thái giao hàng.
   - Tạo đơn POS trực tiếp tại quầy hoặc qua hotline/fanpage.
   - Quản lý tài khoản người dùng & trạng thái hoạt động.

---

## 👤 Tác giả
- **Developer**: PT (dothithuphuong.s2@gmail.com)
- **Project**: LuxeBeauty Cosmetics E-Commerce Platform
