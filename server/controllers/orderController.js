const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create a new order from the authenticated user's cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Validate shippingAddress presence and required fields
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address must include name, phone, address, city, and pincode'
      });
    }

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Validate each cart item and build order item snapshots
    for (const cartItem of cart.items) {
      const product = cartItem.product;

      // Ensure the product still exists
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products in your cart no longer exist'
        });
      }

      // Ensure requested quantity does not exceed current stock
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of "${product.name}" are available`
        });
      }

      // Build snapshot of product details at time of order
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image
      });

      totalAmount += product.price * cartItem.quantity;
    }

    // Create the order (stock is not reduced and cart is not cleared here)
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

// @desc    Get all orders belonging to the authenticated user
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// @desc    Get a single order by ID (must belong to the authenticated user)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = await Order.findById(id);

    // Return 404 if order doesn't exist or doesn't belong to this user
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};