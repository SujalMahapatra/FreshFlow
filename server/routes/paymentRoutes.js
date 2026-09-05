const express = require('express');
const router = express.Router();

const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-order/:orderId', authMiddleware, createRazorpayOrder);
router.post('/verify', authMiddleware, verifyPayment);

module.exports = router;