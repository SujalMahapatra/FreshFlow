const mongoose = require('mongoose');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Initialize Razorpay instance using environment credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create a Razorpay order for an existing FreshFlow order
// @route   POST /api/payments/create-order/:orderId
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Validate the FreshFlow order ID format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            });
        }

        // Find the FreshFlow order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Ensure the order belongs to the authenticated user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to pay for this order'
            });
        }

        // Prevent creating a new payment for an already paid order
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'This order has already been paid for'
            });
        }

        if (order.razorpayOrderId) {
            return res.status(200).json({
                success: true,
                message: 'Razorpay order already exists',
                razorpayOrder: {
                    id: order.razorpayOrderId,
                    amount: Math.round(order.totalAmount * 100),
                    currency: 'INR'
                },
                keyId: process.env.RAZORPAY_KEY_ID
            });
        }

        // Razorpay receipt strings must be 40 characters or fewer
        const receipt = `receipt_${order._id}`.slice(0, 40);

        // Create the Razorpay order using the amount stored in MongoDB (never from frontend)
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100), // amount in paise
            currency: 'INR',
            receipt
        });

        // Save the Razorpay order ID on our order for later verification
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Razorpay order created successfully',
            razorpayOrder,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while creating Razorpay order',
            error: error.message
        });
    }
};

// @desc    Verify Razorpay payment signature and finalize the order
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Validate required fields
        if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'orderId, razorpay_payment_id, razorpay_order_id, and razorpay_signature are all required'
            });
        }

        // Validate the FreshFlow order ID format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID'
            });
        }

        // Find the FreshFlow order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Ensure the order belongs to the authenticated user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to verify payment for this order'
            });
        }

        // Handle already-paid orders safely without reprocessing
        if (order.paymentStatus === 'paid') {
            return res.status(200).json({
                success: true,
                message: 'This order has already been verified and paid',
                order
            });
        }

        // Ensure the Razorpay order ID matches what we generated earlier
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay order ID does not match this order'
            });
        }

        // Generate the expected signature using HMAC SHA256
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest('hex');

        // Compare signatures securely to prevent timing attacks
        const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
        const receivedBuffer = Buffer.from(razorpay_signature, 'utf-8');

        const isSignatureValid =
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

        if (!isSignatureValid) {
            // Do NOT modify order, stock, or cart on invalid signature
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed. Invalid signature'
            });
        }

        // Verify sufficient stock still exists for every item before reducing it
        for (const item of order.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more products in this order no longer exist'
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} unit(s) of "${product.name}" are available`
                });
            }
        }

        // Reduce stock for every ordered item
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Mark the order as paid and confirmed
        order.paymentStatus = 'paid';
        order.paymentId = razorpay_payment_id;
        order.orderStatus = 'confirmed';
        await order.save();

        // Clear the user's cart only after successful verification
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while verifying payment',
            error: error.message
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};