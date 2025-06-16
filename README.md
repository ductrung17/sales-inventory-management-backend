# ⚙️ Backend - Sales & Inventory Management System

Hệ thống API Node.js phục vụ quản lý sản phẩm, đơn hàng, người dùng và thống kê.

## 🚀 Công nghệ sử dụng

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (upload ảnh sản phẩm)
- CORS, express-validator
- PDFKit (xuất hóa đơn PDF)

## ▶️ Khởi chạy backend

```bash
npm install
npm run dev
```

Backend sẽ chạy tại:  
👉 http://localhost:5000

## 🧩 Các API chính

| Method | Endpoint            | Mô tả                    |
| ------ | ------------------- | ------------------------ |
| POST   | `/api/login`        | Đăng nhập                |
| GET    | `/api/users/:id`    | Lấy thông tin người dùng |
| PUT    | `/api/users/:id`    | Cập nhật người dùng      |
| GET    | `/api/products`     | Lấy danh sách sản phẩm   |
| POST   | `/api/products`     | Thêm sản phẩm            |
| PUT    | `/api/products/:id` | Sửa sản phẩm             |
| DELETE | `/api/products/:id` | Xóa sản phẩm + ảnh       |
| POST   | `/api/orders`       | Tạo đơn hàng             |
| GET    | `/api/orders`       | Lấy danh sách đơn hàng   |

## 📁 Cấu trúc thư mục

```
backend/
├── controllers/      # Xử lý logic
├── models/           # Định nghĩa schema MongoDB
├── routes/           # Định tuyến API
├── uploads/          # Lưu ảnh sản phẩm
└── server.js         # Điểm bắt đầu của ứng dụng
```
