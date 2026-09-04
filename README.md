# 🛒 FreshFlow

**FreshFlow** is a full-stack grocery ordering and delivery platform that enables users to browse products, manage their shopping cart, securely authenticate, place orders, complete payments, and track delivery status.

## 🚀 Features

* User registration and login
* JWT-based authentication
* Browse grocery products
* Category filtering and product search
* Shopping cart management
* Persistent cart using local storage
* Secure checkout flow
* Razorpay test-mode payment integration
* Order history
* Delivery status tracking
* Responsive user interface

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt

### Database

* MongoDB Atlas
* Mongoose

### Payments

* Razorpay Test Mode

### Deployment

* Vercel
* Render
* MongoDB Atlas

## 🏗️ Architecture

FreshFlow follows a client-server architecture:

```text
React Frontend
      │
      │ REST APIs
      ▼
Node.js + Express Backend
      │
      ├── Authentication
      ├── Products
      ├── Orders
      └── Payments
      │
      ▼
MongoDB Atlas
```

## 📁 Project Structure

```text
FreshFlow/
├── client/
├── server/
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   └── api-design.md
└── README.md
```

## 🔐 Authentication

FreshFlow uses JWT-based authentication. Passwords are securely hashed using bcrypt before storage.

## 💳 Payments

Razorpay is integrated in Test Mode to simulate secure payment transactions. Payment signatures are verified on the backend before confirming an order.

## 📦 Order Status Flow

```text
Placed → Processing → Out for Delivery → Delivered
```

## 🗺️ Roadmap

* [x] System architecture and API design
* [ ] Backend implementation
* [ ] Frontend implementation
* [ ] Authentication
* [ ] Product catalog
* [ ] Shopping cart
* [ ] Razorpay integration
* [ ] Deployment

## 👨‍💻 Author

**Sujal Mahapatra**

* GitHub: [@SujalMahapatra](https://github.com/SujalMahapatra)
* LinkedIn: [Sujal Mahapatra](https://www.linkedin.com/in/sujal-mahapatra-712aa9291)
