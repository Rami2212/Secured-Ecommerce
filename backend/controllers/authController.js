const axios = require('axios');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/* Register a new user with Auth0 and local database */
const register = async (req, res) => {
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

    const { email, password, name, username, contactNumber, country } = req.body;

    // Check if user already exists in local database
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'Username already taken'
      });
    }

    // Get Auth0 Management API token
    const managementToken = await getAuth0ManagementToken();

    // Create user in Auth0
    const createUserResponse = await axios.post(
      `${process.env.AUTH0_DOMAIN}api/v2/users`,
      {
        email: email,
        password: password,
        username: username,
        name: name,
        connection: 'Username-Password-Authentication',
        user_metadata: {
          username: username,
          contactNumber: contactNumber,
          country: country
        },
        email_verified: false
      },
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Create user in local database
    const localUser = await User.create({
      auth0Id: createUserResponse.data.user_id,
      email,
      name,
      username,
      contactNumber,
      country,
      emailVerified: false,
      isActive: true
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: localUser,
        auth0Id: createUserResponse.data.user_id
      }
    });

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);

    if (error.response?.data?.message?.includes('already exists')) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/* Login user with Auth0 */
const login = async (req, res) => {
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

    const { email, password } = req.body;

    // Authenticate with Auth0
    const auth0Response = await axios.post(`${process.env.AUTH0_DOMAIN}oauth/token`, {
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      username: email,
      password: password,
      realm: 'Username-Password-Authentication',
      scope: 'openid profile email',
      audience: process.env.AUTH0_AUDIENCE
    });

    const { access_token, id_token } = auth0Response.data;

    // Get user info from Auth0
    const userInfoResponse = await axios.get(`${process.env.AUTH0_DOMAIN}userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userInfo = userInfoResponse.data;

    // Create or update user in local database
    const localUser = await createOrUpdateUser(userInfo);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        access_token: access_token,
        id_token: id_token,
        token_type: 'Bearer',
        user: localUser
      }
    });

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);

    if (error.response?.status === 403 || error.response?.data?.error === 'invalid_grant') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/* Get current user profile */
const getProfile = async (req, res) => {
  try {
    const user = req.currentUser;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found in request'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name,
          username: user.username,
          contactNumber: user.contactNumber,
          country: user.country,
          emailVerified: user.emailVerified,
          picture: user.picture,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin
        }
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

/* Update user profile */
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

    const { name, contactNumber, country } = req.body;
    const user = req.currentUser;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found in request'
      });
    }

    // Get Auth0 Management API token
    const managementToken = await getAuth0ManagementToken();

    // Update user in Auth0
    await axios.patch(`${process.env.AUTH0_DOMAIN}api/v2/users/${user.auth0Id}`, {
      name,
      user_metadata: {
        contactNumber,
        country
      }
    }, {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Update user in local database
    user.name = name || user.name;
    user.contactNumber = contactNumber || user.contactNumber;
    user.country = country || user.country;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name,
          username: user.username,
          contactNumber: user.contactNumber,
          country: user.country,
          emailVerified: user.emailVerified,
          picture: user.picture,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

/* Refresh access token (placeholder - Auth0 handles this) */
const refreshToken = async (req, res) => {
  try {
    res.status(400).json({
      status: 'error',
      message: 'Token refresh is handled by Auth0 client-side'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Token refresh failed'
    });
  }
};

/* Logout user */
const logout = async (req, res) => {
  try {
    const user = req.currentUser;
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found in request'
      });
    }
    
    // Log the logout event
    console.log(`User ${user.username} logged out at ${new Date().toISOString()}`);

    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
};

/* Request password reset */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    // Get Auth0 Management API token
    const managementToken = await getAuth0ManagementToken();

    // Request password reset from Auth0
    await axios.post(`${process.env.AUTH0_DOMAIN}dbconnections/change_password`, {
      email,
      connection: 'Username-Password-Authentication',
      client_id: process.env.AUTH0_CLIENT_ID
    }, {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send password reset email'
    });
  }
};

/* Check authentication status */
const checkAuth = async (req, res) => {
  try {
    // Check if there's an authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        status: 'success',
        data: {
          isAuthenticated: false,
          user: null
        }
      });
    }

    // Try to verify the token and get user
    try {
      const token = authHeader.split(' ')[1];
      
      // You might want to verify the token here
      // For now, we'll assume if currentUser exists, user is authenticated
      if (req.currentUser) {
        return res.json({
          status: 'success',
          data: {
            isAuthenticated: true,
            user: req.currentUser
          }
        });
      }
    } catch (tokenError) {
      console.log('Token verification failed in checkAuth:', tokenError.message);
    }

    res.json({
      status: 'success',
      data: {
        isAuthenticated: false,
        user: null
      }
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.json({
      status: 'error',
      data: {
        isAuthenticated: false,
        user: null
      }
    });
  }
};

// Helper function to get Auth0 Management API token
async function getAuth0ManagementToken() {
  try {
    const response = await axios.post(`${process.env.AUTH0_DOMAIN}oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_DOMAIN}api/v2/`,
      grant_type: 'client_credentials'
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get Auth0 management token:', error.response?.data || error.message);
    throw new Error('Failed to get Auth0 management token');
  }
}

// Helper function to create/update user in database
async function createOrUpdateUser(userInfo) {
  try {
    let user = await User.findOne({ auth0Id: userInfo.sub });

    if (!user) {
      // Try to find by email (for existing users)
      user = await User.findOne({ email: userInfo.email });

      if (user) {
        // Update existing user with Auth0 ID
        user.auth0Id = userInfo.sub;
        user.emailVerified = userInfo.email_verified || true;
        user.lastLogin = new Date();
        user.isActive = true; // Ensure user is active
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          auth0Id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name || userInfo.nickname || userInfo.email.split('@')[0],
          username: userInfo.nickname || userInfo.preferred_username || userInfo.email.split('@')[0],
          emailVerified: userInfo.email_verified || true,
          picture: userInfo.picture || '',
          contactNumber: userInfo.user_metadata?.contactNumber || '',
          country: userInfo.user_metadata?.country || '',
          isActive: true,
          lastLogin: new Date()
        });
      }
    } else {
      // Update existing user
      user.name = userInfo.name || user.name;
      user.email = userInfo.email || user.email;
      user.emailVerified = userInfo.email_verified || user.emailVerified;
      user.picture = userInfo.picture || user.picture;
      user.lastLogin = new Date();
      user.isActive = true; // Ensure user remains active
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
  requestPasswordReset,
  checkAuth
};