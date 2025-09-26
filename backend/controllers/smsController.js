const smsService = require('../utils/smsService');
const notificationService = require('../utils/notificationService');
const { User } = require('../models');
const logger = require('../utils/logger');

class SMSController {
  // Send SMS to single recipient
  async sendSMS(req, res) {
    try {
      const { phone, message, templateName, data, country = 'UG', priority = 'normal' } = req.body;

      // Validate required fields
      if (!phone || (!message && !templateName)) {
        return res.status(400).json({
          status: 'error',
          message: 'Phone number and either message or templateName are required'
        });
      }

      // Check if user has permission (admin or extension officer)
      if (req.user.role !== 'admin' && req.user.role !== 'extension_officer') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin or extension officer role required.'
        });
      }

      let result;

      if (templateName) {
        // Use template-based SMS
        result = await notificationService.sendSMSAlert(phone, templateName, data || {}, {
          country,
          priority
        });
      } else {
        // Send direct message
        result = await smsService.sendSMS(phone, message, {
          country,
          priority,
          sender: process.env.SMS_SENDER_ID || 'AgriBuddy'
        });
      }

      logger.info(`SMS sent by user ${req.user.id} to ${phone}`);

      res.status(200).json({
        status: 'success',
        message: 'SMS sent successfully',
        data: result
      });

    } catch (error) {
      logger.error('SMS send error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send SMS',
        error: error.message
      });
    }
  }

  // Send bulk SMS
  async sendBulkSMS(req, res) {
    try {
      const { recipients, message, templateName, data, country = 'UG', priority = 'normal' } = req.body;

      // Validate required fields
      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Recipients array is required and must not be empty'
        });
      }

      if (!message && !templateName) {
        return res.status(400).json({
          status: 'error',
          message: 'Either message or templateName is required'
        });
      }

      // Check if user has permission (admin or extension officer)
      if (req.user.role !== 'admin' && req.user.role !== 'extension_officer') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin or extension officer role required.'
        });
      }

      let result;

      if (templateName) {
        // Use template-based bulk SMS
        const recipientData = recipients.map(recipient => ({
          phone: recipient.phone,
          data: { ...data, ...recipient.data }
        }));

        const results = [];
        for (const recipient of recipientData) {
          try {
            const smsResult = await notificationService.sendSMSAlert(
              recipient.phone, 
              templateName, 
              recipient.data, 
              { country, priority }
            );
            results.push({ phone: recipient.phone, success: true, ...smsResult });
          } catch (error) {
            results.push({ phone: recipient.phone, success: false, error: error.message });
          }
        }

        result = {
          total: recipients.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results
        };

      } else {
        // Send direct bulk message
        const phoneNumbers = recipients.map(r => r.phone);
        result = await smsService.sendBulkSMS(phoneNumbers, message, {
          country,
          priority,
          sender: process.env.SMS_SENDER_ID || 'AgriBuddy'
        });
      }

      logger.info(`Bulk SMS sent by user ${req.user.id} to ${recipients.length} recipients`);

      res.status(200).json({
        status: 'success',
        message: 'Bulk SMS processed',
        data: result
      });

    } catch (error) {
      logger.error('Bulk SMS error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send bulk SMS',
        error: error.message
      });
    }
  }

  // Send weather alert SMS
  async sendWeatherAlert(req, res) {
    try {
      const { location, weatherData, targetUsers } = req.body;

      // Validate required fields
      if (!location || !weatherData) {
        return res.status(400).json({
          status: 'error',
          message: 'Location and weather data are required'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'extension_officer') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin or extension officer role required.'
        });
      }

      let recipients;

      if (targetUsers && Array.isArray(targetUsers)) {
        // Use provided user list
        recipients = targetUsers.filter(user => user.phone);
      } else {
        // Find users in the specified location
        const users = await User.findAll({
          where: {
            location: {
              [require('sequelize').Op.like]: `%${location}%`
            },
            isActive: true
          },
          attributes: ['id', 'phone', 'location']
        });

        recipients = users.filter(user => user.phone).map(user => ({
          phone: user.phone,
          location: user.location
        }));
      }

      if (recipients.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No users with phone numbers found for the specified location'
        });
      }

      const result = await notificationService.sendWeatherAlertSMS(recipients, {
        condition: weatherData.condition,
        location: location,
        date: weatherData.date,
        actionAdvice: weatherData.actionAdvice || 'Take necessary precautions'
      });

      logger.info(`Weather alert SMS sent by user ${req.user.id} to ${recipients.length} users in ${location}`);

      res.status(200).json({
        status: 'success',
        message: 'Weather alert SMS sent',
        data: {
          location,
          totalRecipients: recipients.length,
          results: result
        }
      });

    } catch (error) {
      logger.error('Weather alert SMS error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send weather alert SMS',
        error: error.message
      });
    }
  }

  // Send crop reminder SMS
  async sendCropReminder(req, res) {
    try {
      const { cropData, targetUsers, reminderType = 'planting_reminder' } = req.body;

      if (!cropData || !targetUsers || !Array.isArray(targetUsers)) {
        return res.status(400).json({
          status: 'error',
          message: 'Crop data and target users are required'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'extension_officer') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin or extension officer role required.'
        });
      }

      const recipients = targetUsers.filter(user => user.phone);

      if (recipients.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No users with phone numbers found'
        });
      }

      let result;

      if (reminderType === 'planting_reminder') {
        result = await notificationService.sendPlantingReminderSMS(recipients, cropData);
      } else if (reminderType === 'harvest_reminder') {
        result = await notificationService.sendSMSAlert(recipients[0].phone, 'harvest_reminder', {
          cropName: cropData.name,
          plantingDate: cropData.plantingDate,
          extensionOfficer: process.env.DEFAULT_EXTENSION_CONTACT || '+256-700-000-000'
        });
      }

      logger.info(`Crop reminder SMS sent by user ${req.user.id} to ${recipients.length} users`);

      res.status(200).json({
        status: 'success',
        message: 'Crop reminder SMS sent',
        data: {
          reminderType,
          totalRecipients: recipients.length,
          results: result
        }
      });

    } catch (error) {
      logger.error('Crop reminder SMS error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send crop reminder SMS',
        error: error.message
      });
    }
  }

  // Send livestock reminder SMS
  async sendLivestockReminder(req, res) {
    try {
      const { livestockData, targetUsers, reminderType = 'vaccination_reminder' } = req.body;

      if (!livestockData || !targetUsers || !Array.isArray(targetUsers)) {
        return res.status(400).json({
          status: 'error',
          message: 'Livestock data and target users are required'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'extension_officer') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin or extension officer role required.'
        });
      }

      const recipients = targetUsers.filter(user => user.phone);

      if (recipients.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No users with phone numbers found'
        });
      }

      const result = await notificationService.sendVaccinationReminderSMS(recipients, {
        type: livestockData.type,
        tagNumber: livestockData.tagNumber,
        vaccinationDueDate: livestockData.vaccinationDueDate,
        vaccineName: livestockData.vaccineName
      });

      logger.info(`Livestock reminder SMS sent by user ${req.user.id} to ${recipients.length} users`);

      res.status(200).json({
        status: 'success',
        message: 'Livestock reminder SMS sent',
        data: {
          reminderType,
          totalRecipients: recipients.length,
          results: result
        }
      });

    } catch (error) {
      logger.error('Livestock reminder SMS error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send livestock reminder SMS',
        error: error.message
      });
    }
  }

  // Send market prices SMS
  async sendMarketPrices(req, res) {
    try {
      const { marketData, targetUsers } = req.body;

      if (!marketData || !targetUsers || !Array.isArray(targetUsers)) {
        return res.status(400).json({
          status: 'error',
          message: 'Market data and target users are required'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'extension_officer') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin or extension officer role required.'
        });
      }

      const recipients = targetUsers.filter(user => user.phone);

      if (recipients.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No users with phone numbers found'
        });
      }

      const result = await notificationService.sendMarketPriceSMS(recipients, marketData);

      logger.info(`Market price SMS sent by user ${req.user.id} to ${recipients.length} users`);

      res.status(200).json({
        status: 'success',
        message: 'Market price SMS sent',
        data: {
          totalRecipients: recipients.length,
          results: result
        }
      });

    } catch (error) {
      logger.error('Market price SMS error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send market price SMS',
        error: error.message
      });
    }
  }

  // Get available SMS templates
  async getTemplates(req, res) {
    try {
      const templates = notificationService.getTemplates();

      res.status(200).json({
        status: 'success',
        message: 'SMS templates retrieved',
        data: templates
      });

    } catch (error) {
      logger.error('Get templates error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get SMS templates',
        error: error.message
      });
    }
  }

  // Get SMS provider status
  async getProviderStatus(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin role required.'
        });
      }

      const providers = smsService.getProviderStatus();

      res.status(200).json({
        status: 'success',
        message: 'SMS provider status retrieved',
        data: providers
      });

    } catch (error) {
      logger.error('Get provider status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get provider status',
        error: error.message
      });
    }
  }

  // Test SMS functionality
  async testSMS(req, res) {
    try {
      const { phone, country = 'UG' } = req.body;

      if (!phone) {
        return res.status(400).json({
          status: 'error',
          message: 'Phone number is required'
        });
      }

      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin role required.'
        });
      }

      const result = await notificationService.testSMS(phone, country);

      logger.info(`Test SMS sent by admin ${req.user.id} to ${phone}`);

      res.status(200).json({
        status: 'success',
        message: 'Test SMS sent successfully',
        data: result
      });

    } catch (error) {
      logger.error('Test SMS error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send test SMS',
        error: error.message
      });
    }
  }

  // Get SMS usage statistics
  async getSMSStats(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Admin role required.'
        });
      }

      // This is a placeholder - in a real implementation, you'd store SMS stats in database
      const stats = {
        totalSMSSent: 0,
        successfulSMS: 0,
        failedSMS: 0,
        totalCost: 0,
        providers: smsService.getProviderStatus(),
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        status: 'success',
        message: 'SMS statistics retrieved',
        data: stats
      });

    } catch (error) {
      logger.error('Get SMS stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get SMS statistics',
        error: error.message
      });
    }
  }
}

module.exports = new SMSController();