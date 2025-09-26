const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Protect routes - require authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token using Sequelize
    const user = await User.findActiveById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'No user found with this token'
      });
    }

    // Update last login time
    await user.update({ lastLogin: new Date() });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    });
  }
});

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};