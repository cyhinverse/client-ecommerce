# Client E-commerce

Dự án Frontend cho hệ thống thương mại điện tử, được xây dựng bằng Next.js 16 và React 19.

## 🛠 Công nghệ sử dụng

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & Redux Persist
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: React Hook Form + Zod Validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Notifications**: Sonner
- **Maps**: React Google Maps

## ✨ Tính năng chính

### Người dùng (Customer)
- **Authentication**: Đăng nhập, Đăng ký, Quên mật khẩu.
- **Sản phẩm**:
  - Xem danh sách sản phẩm, lọc theo danh mục, giá.
  - Xem chi tiết sản phẩm (Hình ảnh, mô tả, đánh giá).
  - Tìm kiếm sản phẩm (Search Modal với lịch sử tìm kiếm).
- **Giỏ hàng & Thanh toán**:
  - Thêm/Sửa/Xóa sản phẩm trong giỏ.
  - Thanh toán (Checkout) tích hợp VNPay.
- **Tài khoản**:
  - Quản lý thông tin cá nhân, địa chỉ.
  - Xem lịch sử đơn hàng.
- **Thông báo**: Hệ thống thông báo realtime (Socket.io).

### Quản trị viên (Admin)
- **Dashboard**: Thống kê doanh thu, đơn hàng, người dùng.
- **Quản lý sản phẩm**: Thêm, sửa, xóa, quản lý biến thể (variants).
- **Quản lý đơn hàng**: Cập nhật trạng thái đơn hàng.
- **Quản lý danh mục & Khuyến mãi**.

## 🚀 Cài đặt và chạy dự án

1. **Cài đặt dependencies**:
   ```bash
   npm install
   # hoặc
   yarn install
   ```

2. **Cấu hình môi trường**:
   Tạo file `.env.local` và cấu hình các biến môi trường cần thiết (API URL, Google Maps Key, etc.).

3. **Chạy server development**:
   ```bash
   npm run dev
   ```
   Truy cập [http://localhost:3000](http://localhost:3000).

4. **Build production**:
   ```bash
   npm run build
   npm start
   ```

## 📂 Cấu trúc thư mục

- `src/app`: Next.js App Router pages.
- `src/components`: Reusable UI components.
- `src/features`: Redux slices và actions (Auth, Cart, Product...).
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions.
- `src/types`: TypeScript definitions.
