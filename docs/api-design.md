# FreshFlow — API Design

FreshFlow uses RESTful APIs for communication between the React frontend and Express backend.

Base URL:

```text
/api
```

---

## Authentication APIs

### Register User

```text
POST /api/auth/register
```

Creates a new user account.

### Login User

```text
POST /api/auth/login
```

Authenticates the user and returns a JWT token.

### Get Current User

```text
GET /api/auth/me
```

Returns authenticated user information.

---

## Product APIs

### Get All Products

```text
GET /api/products
```

Supports optional filtering and search.

Examples:

```text
/api/products?category=Vegetables
/api/products?search=tomato
```

### Get Product by ID

```text
GET /api/products/:id
```

---

## Order APIs

### Create Order

```text
POST /api/orders
```

Creates a new grocery order after successful payment verification.

### Get User Orders

```text
GET /api/orders/my-orders
```

Returns the order history of the authenticated user.

### Get Order Details

```text
GET /api/orders/:id
```

Returns details for a specific order.

---

## Payment APIs

### Create Razorpay Order

```text
POST /api/payment/create-order
```

Creates a Razorpay payment order.

### Verify Payment

```text
POST /api/payment/verify
```

Verifies the Razorpay payment signature before marking an order as paid.
