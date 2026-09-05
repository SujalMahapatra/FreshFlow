// models/Order.js

const mongoose = require('mongoose');

// Sub-schema for individual order items (snapshot of product at time of order)
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    name: {
      type: String,
      required: [true, 'Product name is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    image: {
      type: String,
      required: [true, 'Product image is required']
    }
  },
  { _id: false }
);

// Sub-schema for shipping address
const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipient name is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentId: {
      type: String
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'out_for_delivery',
        'delivered',
        'cancelled'
      ],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);