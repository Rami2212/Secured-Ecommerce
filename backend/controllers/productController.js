const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * Get all products with pagination and filtering
 */
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category || null;
    const search = req.query.search || null;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice !== null && maxPrice !== null) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== null) {
      query.price = { $gte: minPrice };
    } else if (maxPrice !== null) {
      query.price = { $lte: maxPrice };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select('-__v'),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products'
    });
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select('-__v');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Product is not available'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product'
    });
  }
};

/**
 * Search products
 */
const searchProducts = async (req, res) => {
  try {
    const {
      q: searchTerm,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12
    } = req.query;

    const skip = (page - 1) * limit;

    const result = await Product.searchProducts(
      searchTerm,
      category,
      minPrice ? parseFloat(minPrice) : null,
      maxPrice ? parseFloat(maxPrice) : null,
      parseInt(limit),
      skip
    );

    res.status(200).json({
      status: 'success',
      data: {
        products: result.products,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(result.total / limit),
          total: result.total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search products'
    });
  }
};

/**
 * Get product categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = Product.getCategories();

    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
};

/**
 * Get featured products
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    // Get products with highest ratings and recent ones
    const products = await Product.find({ isActive: true })
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      status: 'success',
      data: {
        products
      }
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured products'
    });
  }
};

/**
 * Create new product (Admin only)
 */
const createProduct = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = req.body;

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Create product error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create product'
    });
  }
};

/**
 * Update product (Admin only)
 */
const updateProduct = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Update product error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update product'
    });
  }
};

/**
 * Delete product (Admin only)
 */
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product'
    });
  }
};

/**
 * Update product stock (Admin only)
 */
const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Stock must be a non-negative number'
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Stock updated successfully',
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update stock'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getCategories,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};