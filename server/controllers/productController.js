const mongoose = require('mongoose');
const Product = require('../models/Product');

// @desc    Get all products (supports category and search filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build filter object dynamically based on provided query params
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      // Case-insensitive search on product name
      filter.name = { $regex: search, $options: 'i' };
    }

    // Fetch products, newest first
    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById
};