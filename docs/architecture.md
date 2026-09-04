# FreshFlow — System Architecture

## Overview

FreshFlow is a full-stack grocery ordering and delivery platform designed around a client-server architecture. Users can browse grocery products, manage their cart, authenticate securely, place orders, complete test-mode payments, and track their order status.

## Technology Stack

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
* JWT Authentication
* bcrypt

### Database

* MongoDB Atlas
* Mongoose ODM

### Payments

* Razorpay Test Mode

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## High-Level Architecture

```text
                         ┌─────────────────┐
                         │   React Client  │
                         │                 │
                         │ React + Vite    │
                         │ Tailwind CSS    │
                         └────────┬────────┘
                                  │
                            HTTP / REST APIs
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Express Server  │
                         │                 │
                         │ Node.js Backend │
                         └────────┬────────┘
                                  │
                  ┌───────────────┼───────────────┐
                  │               │               │
                  ▼               ▼               ▼
             Authentication    Products        Orders
                  │               │               │
                  └───────────────┼───────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ MongoDB Atlas   │
                         │                 │
                         │ Users           │
                         │ Products        │
                         │ Orders          │
                         └─────────────────┘

                                  │
                                  │ Payment Processing
                                  ▼
                         ┌─────────────────┐
                         │    Razorpay     │
                         │    Test Mode    │
                         └─────────────────┘
```

---

## Backend Architecture

The backend follows a layered MVC-inspired architecture.

```text
Client Request
      │
      ▼
    Routes
      │
      ▼
 Controllers
      │
      ▼
    Models
      │
      ▼
 MongoDB Atlas
```

### Routes

Routes define API endpoints and map incoming HTTP requests to the appropriate controller.

### Controllers

Controllers contain application business logic, including authentication, product handling, order processing, and payment workflows.

### Models

Mongoose models define the application's data structure and manage interactions with MongoDB.

---

## Authentication Flow

```text
User Registration/Login
        │
        ▼
Express Backend
        │
        ▼
Validate Credentials
        │
        ▼
Hash / Compare Password using bcrypt
        │
        ▼
Generate JWT Token
        │
        ▼
Return Token to Client
        │
        ▼
Protected API Requests
        │
        ▼
JWT Verification Middleware
```

Passwords are never stored in plain text. bcrypt is used for password hashing, while JWT tokens are used to authenticate protected routes.

---

## Payment Flow

```text
User Checkout
      │
      ▼
Frontend requests payment order
      │
      ▼
Backend creates Razorpay Order
      │
      ▼
Razorpay Checkout Opens
      │
      ▼
User completes Test Payment
      │
      ▼
Payment Details Returned
      │
      ▼
Backend verifies Payment Signature
      │
      ▼
Order stored in MongoDB
```

Payment verification is handled on the backend to avoid trusting payment results directly from the client.

---

## Deployment Architecture

```text
                User Browser
                     │
                     ▼
              Vercel Deployment
              React Frontend
                     │
                     │ API Requests
                     ▼
              Render Deployment
              Node + Express API
                     │
                     ▼
                MongoDB Atlas
```

The frontend and backend are deployed independently, allowing each service to be updated and scaled separately.
