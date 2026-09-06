# 🛒 FreshFlow

### Full-Stack Grocery Ordering & Delivery Platform

FreshFlow is a full-stack grocery ordering web application where users can browse products, search and filter by category, manage their shopping cart, place orders, make secure test-mode payments, and track their orders.

**🌐 Live Demo:** [FreshFlow](https://fresh-flow-lake.vercel.app)

---

## ✨ Features

### 👤 Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Persistent user sessions
* Password validation and confirmation

### 🛍️ Product Management

* Browse grocery products
* Search products
* Filter products by category
* Featured products on the home page
* Product stock validation

### 🛒 Shopping Cart

* Add products to cart
* Update product quantities
* Remove products from cart
* Persistent cart stored in MongoDB
* Real-time cart total calculation

### 📦 Orders

* Create orders from the shopping cart
* Shipping address management
* Order history
* Individual order details
* Order status tracking

### 💳 Payments

* Razorpay payment gateway integration
* Razorpay order creation on the backend
* Server-side payment signature verification
* Stock reduction after successful payment
* Cart cleared only after successful payment

### 🚀 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* Database hosted on MongoDB Atlas

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Context API
* CSS
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Razorpay

### Deployment

* Vercel
* Render
* MongoDB Atlas

---

## 🏗️ Project Architecture

```text
FreshFlow
│
├── client
│   ├── api
│   ├── components
│   ├── context
│   ├── pages
│   ├── styles
│   └── utils
│
└── server
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    └── routes
```

### Application Flow

```text
React Frontend
      │
      │ REST API Requests
      ▼
Node.js + Express Backend
      │
      ├──────────► MongoDB Atlas
      │
      └──────────► Razorpay Payment Gateway
```

---

## 🔐 Payment Flow

1. User adds products to the cart.
2. User proceeds to checkout and enters shipping details.
3. A FreshFlow order is created in MongoDB.
4. Backend creates a Razorpay order using the server-side amount.
5. Razorpay checkout processes the payment.
6. Payment signature is sent to the backend.
7. Backend verifies the Razorpay signature.
8. Product stock is reduced after successful verification.
9. Order payment status is updated.
10. User's cart is cleared.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/SujalMahapatra/FreshFlow
cd FreshFlow
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Create a `.env` file if required:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register a user  |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |

### Products

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/products`     | Get all products  |
| GET    | `/api/products/:id` | Get product by ID |

### Cart

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/cart`            | Get user cart    |
| POST   | `/api/cart`            | Add item to cart |
| PUT    | `/api/cart/:productId` | Update cart item |
| DELETE | `/api/cart/:productId` | Remove cart item |
| DELETE | `/api/cart`            | Clear cart       |

### Orders

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/orders`           | Create order      |
| GET    | `/api/orders/my-orders` | Get user orders   |
| GET    | `/api/orders/:id`       | Get order details |

### Payments

| Method | Endpoint                              | Description           |
| ------ | ------------------------------------- | --------------------- |
| POST   | `/api/payments/create-order/:orderId` | Create Razorpay order |
| POST   | `/api/payments/verify`                | Verify payment        |

---

## 🔒 Security Highlights

* JWT authentication for protected endpoints
* Password hashing using bcryptjs
* Protected frontend routes
* Server-side payment verification
* Razorpay signature validation using HMAC SHA256
* Payment amount generated from database values
* Stock validation before order confirmation
* Cart cleared only after successful payment verification
* CORS configured for production deployment

---

## 🌐 Live Deployment

* **Frontend:** [FreshFlow on Vercel](https://fresh-flow-lake.vercel.app)
* **Backend:** Hosted on Render
* **Database:** MongoDB Atlas

---

## 🚧 Future Improvements

* Forgot password functionality with email verification
* Admin dashboard for product and order management
* Product reviews and ratings
* Wishlist functionality
* Real-time order tracking
* Payment webhook handling
* Product image upload using cloud storage
* Pagination and advanced filtering

---

## 👨‍💻 Author

**Sujal Mahapatra**

Built as a full-stack MERN project demonstrating modern web development, authentication, payment integration, API development, and cloud deployment.
