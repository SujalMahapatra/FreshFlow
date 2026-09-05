const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;