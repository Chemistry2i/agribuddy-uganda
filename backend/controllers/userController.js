const asyncHandler = require('express-async-handler');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/apiResponse');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone || '+256 700 000 000',
    location: req.user.location || 'Kampala, Uganda',
    farmSize: req.user.farmSize || 5.5,
    role: req.user.role,
    joinedDate: '2024-01-15'
  };
  
  sendSuccessResponse(res, 200, 'Profile retrieved successfully', user);
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'location', 'farmSize'];
  const updates = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  // In a real app, you would update the user in the database
  const updatedUser = { ...req.user, ...updates };
  
  sendSuccessResponse(res, 200, 'Profile updated successfully', updatedUser);
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
const deleteProfile = asyncHandler(async (req, res) => {
  // In a real app, you would delete the user from the database
  sendSuccessResponse(res, 200, 'Profile deleted successfully');
});

// @desc    Get dashboard metrics
// @route   GET /api/users/dashboard/metrics
// @access  Private
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = {
    totalCrops: 5,
    totalLivestock: 12,
    farmSize: 5.5,
    monthlyYield: 2500,
    weatherAlerts: 2,
    upcomingTasks: 8
  };
  
  sendSuccessResponse(res, 200, 'Dashboard metrics retrieved', metrics);
});

// @desc    Get community activities
// @route   GET /api/users/dashboard/activities
// @access  Private
const getCommunityActivities = asyncHandler(async (req, res) => {
  const activities = [
    {
      id: 1,
      type: 'tip',
      title: 'New pest control technique shared',
      user: 'John Mubiru',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 15
    },
    {
      id: 2,
      type: 'question',
      title: 'Best time to plant coffee in central Uganda?',
      user: 'Sarah Nalongo',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      responses: 8
    }
  ];
  
  sendSuccessResponse(res, 200, 'Community activities retrieved', activities);
});

// @desc    Get user alerts
// @route   GET /api/users/alerts
// @access  Private
const getUserAlerts = asyncHandler(async (req, res) => {
  const alerts = [
    {
      id: 1,
      type: 'weather',
      title: 'Heavy rain expected tomorrow',
      message: 'Consider postponing field activities',
      priority: 'high',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'crop',
      title: 'Maize ready for harvest',
      message: 'Your maize crop planted in March is ready for harvest',
      priority: 'medium',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false
    }
  ];
  
  sendSuccessResponse(res, 200, 'User alerts retrieved', alerts);
});

// @desc    Get extension contacts
// @route   GET /api/users/extension/contacts
// @access  Private
const getExtensionContacts = asyncHandler(async (req, res) => {
  const contacts = [
    {
      id: 1,
      name: 'James Okello',
      title: 'Agricultural Extension Officer',
      organization: 'MAAIF',
      phone: '+256 700 111 222',
      email: 'j.okello@maaif.go.ug',
      specialization: 'Crop Management'
    },
    {
      id: 2,
      name: 'Dr. Mary Nabirye',
      title: 'Livestock Specialist',
      organization: 'NAGRC&DB',
      phone: '+256 700 333 444',
      email: 'm.nabirye@nagrc.go.ug',
      specialization: 'Animal Health'
    }
  ];
  
  sendSuccessResponse(res, 200, 'Extension contacts retrieved', contacts);
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Mock users data for admin
  const users = [
    {
      id: 1,
      name: 'John Farmer',
      email: 'john@example.com',
      role: 'farmer',
      location: 'Kampala',
      joinedDate: '2024-01-15'
    }
  ];
  
  sendSuccessResponse(res, 200, 'Users retrieved successfully', users);
});

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!['farmer', 'extension_officer', 'admin'].includes(role)) {
    return sendErrorResponse(res, 400, 'Invalid role');
  }
  
  // In a real app, you would update the user role in the database
  sendSuccessResponse(res, 200, 'User role updated successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getDashboardMetrics,
  getCommunityActivities,
  getUserAlerts,
  getExtensionContacts,
  getAllUsers,
  updateUserRole
};