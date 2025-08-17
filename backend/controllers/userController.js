const User = require('../models/User');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

/**
 * Get current user's dashboard data
 */
const getDashboard = async (req, res) => {
  try {
    const user = req.currentUser;

    // Get user's order statistics
    const totalOrders = await Order.countDocuments({ user: user._id });
    const pendingOrders = await Order.countDocuments({ 
      user: user._id, 
      status: 'pending' 
    });
    const upcomingOrders = await Order.getUpcomingOrders(user._id);
    const recentOrders = await Order.find({ user: user._id })
      .populate('product', 'name image category')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        statistics: {
          totalOrders,
          pendingOrders,
          upcomingOrders: upcomingOrders.length,
          recentOrders: recentOrders.length
        },
        upcomingOrders: upcomingOrders.slice(0, 3), // Show only 3 upcoming orders
        recentOrders
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard data'
    });
  }
};

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = req.currentUser;

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile'
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
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

    const user = req.currentUser;
    const { name, contactNumber, country } = req.body;

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (country !== undefined) user.country = country;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

/**
 * Get user's orders summary
 */
const getOrdersSummary = async (req, res) => {
  try {
    const user = req.currentUser;

    const [totalOrders, upcomingOrders, pastOrders] = await Promise.all([
      Order.countDocuments({ user: user._id }),
      Order.getUpcomingOrders(user._id),
      Order.getPastOrders(user._id)
    ]);

    // Calculate total spent
    const orders = await Order.find({ user: user._id, status: 'delivered' });
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalOrders,
          upcomingOrders: upcomingOrders.length,
          pastOrders: pastOrders.length,
          totalSpent
        },
        upcomingOrders,
        pastOrders
      }
    });

  } catch (error) {
    console.error('Get orders summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders summary'
    });
  }
};

/**
 * Deactivate user account
 */
const deactivateAccount = async (req, res) => {
  try {
    const user = req.currentUser;

    // Check if user has pending orders
    const pendingOrders = await Order.countDocuments({
      user: user._id,
      status: { $in: ['pending', 'confirmed', 'processing', 'shipped'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot deactivate account with pending orders. Please wait for all orders to be completed or cancelled.'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to deactivate account'
    });
  }
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

/**
 * Get user by ID (Admin only)
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        orderStats
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

/**
 * Update user status (Admin only)
 */
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.equals(req.currentUser._id) && !isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot deactivate your own account'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status'
    });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getOrdersSummary,
  deactivateAccount,
  getAllUsers,
  getUserById,
  updateUserStatus
};