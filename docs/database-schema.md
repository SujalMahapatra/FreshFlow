# FreshFlow — Database Schema

FreshFlow uses MongoDB with Mongoose for database modeling.

## User Collection

```text
User
├── name
├── email
├── password
├── phone
├── address
└── createdAt
```

### Purpose

Stores user account information and authentication credentials.

Passwords are hashed using bcrypt before being stored.

---

## Product Collection

```text
Product
├── name
├── description
├── price
├── category
├── image
├── stock
├── unit
└── createdAt
```

### Purpose

Stores grocery product information displayed in the application.

Example categories:

* Fruits
* Vegetables
* Dairy
* Bakery
* Beverages

---

## Order Collection

```text
Order
├── user
├── items[]
│   ├── product
│   ├── name
│   ├── quantity
│   └── price
│
├── totalAmount
├── deliveryAddress
├── paymentId
├── paymentStatus
├── orderStatus
└── createdAt
```

### Order Status Flow

```text
Placed
   ↓
Processing
   ↓
Out for Delivery
   ↓
Delivered
```

### Payment Status

```text
Pending
Paid
Failed
```

---

## Database Design Decision

For the MVP, payment information is stored within the Order document rather than using a separate Payment collection.

This simplifies the data model because each order currently has one payment transaction.

For a production-scale system supporting refunds, payment retries, or multiple transactions per order, a dedicated Payment collection would be more appropriate.
