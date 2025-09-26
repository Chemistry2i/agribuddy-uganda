const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const emailService = require('../utils/emailService');
const notificationService = require('../utils/notificationService');
const { protect, restrictTo } = require('../middleware/auth');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/apiResponse');

// Only enable in development mode
if (process.env.NODE_ENV === 'development') {
  
  // @desc    Test email configuration
  // @route   GET /api/email/test-connection
  // @access  Private/Admin
  router.get('/test-connection', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const isConnected = await emailService.verifyConnection();
    
    if (isConnected) {
      sendSuccessResponse(res, 200, 'Email service connection successful');
    } else {
      sendErrorResponse(res, 500, 'Email service connection failed');
    }
  }));

  // @desc    Send test welcome email
  // @route   POST /api/email/test-welcome
  // @access  Private/Admin
  router.post('/test-welcome', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return sendErrorResponse(res, 400, 'Email address required');
    }

    const mockUser = {
      name: 'Test User',
      email: email
    };

    const result = await emailService.sendWelcomeEmail(mockUser);
    
    if (result.success) {
      sendSuccessResponse(res, 200, 'Welcome email sent successfully', {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      });
    } else {
      sendErrorResponse(res, 500, 'Failed to send welcome email', result.error);
    }
  }));

  // @desc    Send test password reset email
  // @route   POST /api/email/test-password-reset
  // @access  Private/Admin
  router.post('/test-password-reset', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return sendErrorResponse(res, 400, 'Email address required');
    }

    const mockUser = {
      name: 'Test User',
      email: email
    };
    
    const resetToken = 'test-reset-token-12345';

    const result = await emailService.sendPasswordResetEmail(mockUser, resetToken);
    
    if (result.success) {
      sendSuccessResponse(res, 200, 'Password reset email sent successfully', {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      });
    } else {
      sendErrorResponse(res, 500, 'Failed to send password reset email', result.error);
    }
  }));

  // @desc    Send test crop alert email
  // @route   POST /api/email/test-crop-alert
  // @access  Private/Admin
  router.post('/test-crop-alert', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return sendErrorResponse(res, 400, 'Email address required');
    }

    const mockUser = {
      name: 'Test Farmer',
      email: email,
      location: 'Kampala, Uganda'
    };

    const mockAlert = {
      title: 'Harvest Time for Maize',
      priority: 'high',
      cropName: 'Maize (Hybrid 614)',
      message: 'Your maize crop planted in March is now ready for harvest. Weather conditions are optimal for the next 5 days.',
      action: 'Begin harvesting activities and ensure proper storage facilities are ready.'
    };

    const result = await emailService.sendCropAlertEmail(mockUser, mockAlert);
    
    if (result.success) {
      sendSuccessResponse(res, 200, 'Crop alert email sent successfully', {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      });
    } else {
      sendErrorResponse(res, 500, 'Failed to send crop alert email', result.error);
    }
  }));

  // @desc    Send test weather alert email
  // @route   POST /api/email/test-weather-alert
  // @access  Private/Admin
  router.post('/test-weather-alert', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return sendErrorResponse(res, 400, 'Email address required');
    }

    const mockUser = {
      name: 'Test Farmer',
      email: email,
      location: 'Kampala, Uganda'
    };

    const mockWeatherAlert = {
      type: 'Heavy Rain Warning',
      severity: 'moderate',
      description: 'Heavy rainfall expected in the next 24 hours. Rainfall amounts may reach 50-80mm. Consider postponing field activities and secure livestock.',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const result = await emailService.sendWeatherAlertEmail(mockUser, mockWeatherAlert);
    
    if (result.success) {
      sendSuccessResponse(res, 200, 'Weather alert email sent successfully', {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      });
    } else {
      sendErrorResponse(res, 500, 'Failed to send weather alert email', result.error);
    }
  }));

  // @desc    Send test livestock reminder email
  // @route   POST /api/email/test-livestock-reminder
  // @access  Private/Admin
  router.post('/test-livestock-reminder', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return sendErrorResponse(res, 400, 'Email address required');
    }

    const mockUser = {
      name: 'Test Farmer',
      email: email
    };

    const mockReminder = {
      type: 'Vaccination Due',
      animalType: 'Cattle',
      animalId: 'COW-001',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Your cattle (COW-001) is due for FMD vaccination. Schedule an appointment with your veterinarian.',
      veterinarian: 'Dr. Sarah Nakato (+256 700 123 456)'
    };

    const result = await emailService.sendLivestockHealthReminderEmail(mockUser, mockReminder);
    
    if (result.success) {
      sendSuccessResponse(res, 200, 'Livestock reminder email sent successfully', {
        messageId: result.messageId,
        previewUrl: result.previewUrl
      });
    } else {
      sendErrorResponse(res, 500, 'Failed to send livestock reminder email', result.error);
    }
  }));

  // @desc    Get email statistics
  // @route   GET /api/email/stats
  // @access  Private/Admin
  router.get('/stats', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
    const stats = notificationService.getEmailStats();
    sendSuccessResponse(res, 200, 'Email statistics retrieved', stats);
  }));

} else {
  // In production, return 404 for all email test routes
  router.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Email test routes are only available in development mode'
    });
  });
}

module.exports = router;