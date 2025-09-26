const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController.simple');
const auth = require('../middleware/auth');

// @route   POST /api/sms/send
// @desc    Send SMS to single recipient
// @access  Private (Admin/Extension Officer)
router.post('/send', auth.protect, smsController.sendSMS);

// @route   POST /api/sms/bulk
// @desc    Send bulk SMS to multiple recipients
// @access  Private (Admin/Extension Officer)
router.post('/bulk', auth.protect, smsController.sendBulkSMS);

// @route   POST /api/sms/weather-alert
// @desc    Send weather alert SMS to farmers in a region
// @access  Private (Admin/Extension Officer)
router.post('/weather-alert', auth.protect, smsController.sendWeatherAlert);

// @route   POST /api/sms/crop-reminder
// @desc    Send crop management reminder SMS
// @access  Private (Admin/Extension Officer)
router.post('/crop-reminder', auth.protect, smsController.sendCropReminder);

// @route   POST /api/sms/livestock-reminder
// @desc    Send livestock management reminder SMS
// @access  Private (Admin/Extension Officer)
router.post('/livestock-reminder', auth.protect, smsController.sendLivestockReminder);

// @route   POST /api/sms/market-prices
// @desc    Send market price update SMS
// @access  Private (Admin/Extension Officer)
router.post('/market-prices', auth.protect, smsController.sendMarketPrices);

// @route   GET /api/sms/templates
// @desc    Get available SMS templates
// @access  Private
router.get('/templates', auth.protect, smsController.getTemplates);

// @route   GET /api/sms/providers
// @desc    Get SMS provider status
// @access  Private (Admin)
router.get('/providers', auth.protect, smsController.getProviderStatus);

// @route   POST /api/sms/test
// @desc    Test SMS functionality
// @access  Private (Admin)
router.post('/test', auth.protect, smsController.testSMS);

// @route   GET /api/sms/stats
// @desc    Get SMS usage statistics
// @access  Private (Admin)
router.get('/stats', auth.protect, smsController.getSMSStats);

module.exports = router;