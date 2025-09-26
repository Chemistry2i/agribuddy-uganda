const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

// User profile routes
router.get('/profile', protect, userController.getProfile);
router.patch('/profile', protect, userController.updateProfile);
router.delete('/profile', protect, userController.deleteProfile);

// User dashboard data
router.get('/dashboard/metrics', protect, userController.getDashboardMetrics);
router.get('/dashboard/activities', protect, userController.getCommunityActivities);
router.get('/alerts', protect, userController.getUserAlerts);
router.get('/extension/contacts', protect, userController.getExtensionContacts);

// Admin routes
router.get('/', protect, restrictTo('admin'), userController.getAllUsers);
router.patch('/:id/role', protect, restrictTo('admin'), userController.updateUserRole);

module.exports = router;