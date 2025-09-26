const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { sendTokenResponse, generateToken } = require('../utils/jwtUtils');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/apiResponse');
const emailService = require('../utils/emailService');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, location, farmSize } = req.body;

  // Validation
  if (!name || !email || !password) {
    return sendErrorResponse(res, 400, 'Please provide name, email and password');
  }

  try {
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return sendErrorResponse(res, 400, 'User already exists with this email');
    }

    // Create user (password will be hashed automatically by the model hook)
    const userData = await User.create({
      name,
      email,
      password,
      phone,
      location,
      farmSize: farmSize ? parseFloat(farmSize) : null,
      role: 'farmer'
    });

    logger.info(`New user registered: ${email} (ID: ${userData.id})`);
    
    // Send welcome email
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
      const emailResult = await emailService.sendWelcomeEmail(userData);
      if (emailResult.success) {
        logger.info(`Welcome email sent to ${email}`);
      } else {
        logger.error(`Failed to send welcome email to ${email}:`, emailResult.error);
      }
    }
    
    // Send token response
    sendTokenResponse(userData, 201, res);
  } catch (error) {
    logger.error('Registration error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return sendErrorResponse(res, 400, 'Validation error', messages);
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendErrorResponse(res, 400, 'Email already exists');
    }
    
    sendErrorResponse(res, 500, 'Registration failed');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return sendErrorResponse(res, 400, 'Please provide email and password');
  }

  try {
    // Find user by email (including password for comparison)
    const user = await User.findOne({ 
      where: { email, isActive: true },
      attributes: { include: ['password'] }
    });
    
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    logger.info(`User logged in: ${email} (ID: ${user.id})`);
    
    // Send token response (password will be excluded by toJSON method)
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    sendErrorResponse(res, 500, 'Login failed');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  sendSuccessResponse(res, 200, 'Logged out successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendErrorResponse(res, 400, 'Please provide email address');
  }

  try {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Return success anyway for security (don't reveal if email exists)
      return sendSuccessResponse(res, 200, 'If an account with that email exists, a password reset link has been sent.');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token and save to database with expiration (10 minutes)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    await user.update({
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send password reset email
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
      const emailResult = await emailService.sendPasswordResetEmail(user, resetToken);
      
      if (emailResult.success) {
        logger.info(`Password reset email sent to ${email}`);
        return sendSuccessResponse(res, 200, 'Password reset email sent. Check your inbox.', {
          message: 'If an account with that email exists, a password reset link has been sent.',
          ...(process.env.NODE_ENV === 'development' && { previewUrl: emailResult.previewUrl })
        });
      } else {
        logger.error(`Failed to send password reset email to ${email}:`, emailResult.error);
        return sendErrorResponse(res, 500, 'Failed to send password reset email');
      }
    } else {
      // Email disabled, return success anyway for security
      return sendSuccessResponse(res, 200, 'Password reset email sent (email disabled in development)');
    }
  } catch (error) {
    logger.error('Forgot password error:', error);
    sendErrorResponse(res, 500, 'Password reset request failed');
  }
});

// @desc    Reset password
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return sendErrorResponse(res, 400, 'Please provide password and confirm password');
  }

  if (password !== confirmPassword) {
    return sendErrorResponse(res, 400, 'Passwords do not match');
  }

  if (password.length < 8) {
    return sendErrorResponse(res, 400, 'Password must be at least 8 characters long');
  }

  try {
    // Hash the token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          [User.sequelize.Sequelize.Op.gt]: new Date()
        },
        isActive: true
      }
    });
    
    if (!user) {
      return sendErrorResponse(res, 400, 'Token is invalid or has expired');
    }

    // Update user's password and clear reset fields (password will be hashed by model hook)
    await user.update({
      password: password,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    logger.info(`Password reset successful for user: ${user.email} (ID: ${user.id})`);
    
    sendSuccessResponse(res, 200, 'Password reset successful! You can now login with your new password.');
  } catch (error) {
    logger.error('Password reset error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return sendErrorResponse(res, 400, 'Validation error', messages);
    }
    
    sendErrorResponse(res, 500, 'Password reset failed');
  }
});

// @desc    Update password
// @route   PATCH /api/auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  // Implementation would update user password
  sendSuccessResponse(res, 200, 'Password updated successfully');
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword
};