const smsService = require('./smsService');
const emailService = require('./emailService');
const logger = require('./logger');

class NotificationService {
  constructor() {
    this.emailRateLimit = new Map(); // Simple rate limiting
    this.templates = {
      // Weather Alerts
      weather_alert: {
        sms: 'Weather Alert: {weatherCondition} expected in {location} on {date}. {actionAdvice}',
        email: {
          subject: 'Weather Alert for {location}',
          template: 'weather-alert'
        }
      },
      
      // Crop Management
      planting_reminder: {
        sms: 'AgriBuddy: Time to plant {cropName} in {location}. Best planting window: {plantingWindow}.',
        email: {
          subject: 'Planting Reminder - {cropName}',
          template: 'planting-reminder'
        }
      },
      
      harvest_reminder: {
        sms: 'AgriBuddy: Your {cropName} is ready for harvest! Planted on {plantingDate}. Contact: {extensionOfficer}',
        email: {
          subject: 'Harvest Time - {cropName}',
          template: 'harvest-reminder'
        }
      },
      
      fertilizer_reminder: {
        sms: 'AgriBuddy: Apply fertilizer to your {cropName}. Type: {fertilizerType}. Rate: {applicationRate}.',
        email: {
          subject: 'Fertilizer Application Reminder',
          template: 'fertilizer-reminder'
        }
      },
      
      pest_alert: {
        sms: 'Pest Alert: {pestName} detected in {location}. Affects {cropName}. Action: {treatment}. Info: {helpline}',
        email: {
          subject: 'Pest Alert - {pestName}',
          template: 'pest-alert'
        }
      },
      
      // Livestock Management
      vaccination_reminder: {
        sms: 'AgriBuddy: Vaccinate {animalType} (Tag: {tagNumber}) by {dueDate}. Vaccine: {vaccineName}. Vet: {vetContact}',
        email: {
          subject: 'Vaccination Reminder - {animalType}',
          template: 'vaccination-reminder'
        }
      },
      
      // Market Information
      market_prices: {
        sms: 'Market Prices ({location}): {cropName} - {price} UGX/kg. Trend: {trend}. Best market: {marketName}',
        email: {
          subject: 'Market Price Update - {location}',
          template: 'market-prices'
        }
      },
      
      // System Notifications
      welcome: {
        sms: 'Welcome to AgriBuddy Uganda! Your account is active. Get farming tips, weather alerts & market prices. Help: {helpline}',
        email: {
          subject: 'Welcome to AgriBuddy Uganda!',
          template: 'welcome'
        }
      },
      
      account_verification: {
        sms: 'AgriBuddy: Verify your account with code: {verificationCode}. Valid for 10 minutes.',
        email: {
          subject: 'Account Verification - AgriBuddy',
          template: 'account-verification'
        }
      },
      
      password_reset: {
        sms: 'AgriBuddy: Password reset code: {resetCode}. Valid for 10 minutes. Keep this code secure.',
        email: {
          subject: 'Password Reset - AgriBuddy',
          template: 'password-reset'
        }
      }
    };
  }

  // Send notification via SMS, Email, or both
  async sendNotification(options) {
    const {
      userId,
      phone,
      email,
      templateName,
      data,
      channels = ['sms'], // 'sms', 'email', or ['sms', 'email']
      priority = 'normal', // 'low', 'normal', 'high', 'urgent'
      country = 'UG'
    } = options;

    logger.info('📢 Sending notification:', {
      userId,
      templateName,
      channels,
      priority
    });

    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Unknown notification template: ${templateName}`);
    }

    const results = [];
    const channelList = Array.isArray(channels) ? channels : [channels];

    // Send SMS
    if (channelList.includes('sms') && phone && template.sms) {
      try {
        const smsMessage = this.fillTemplate(template.sms, data);
        const smsResult = await smsService.sendSMS(phone, smsMessage, {
          country,
          priority: this.getSMSPriority(priority)
        });
        
        results.push({
          channel: 'sms',
          success: true,
          ...smsResult
        });
        
      } catch (error) {
        logger.error('SMS notification failed:', error);
        results.push({
          channel: 'sms',
          success: false,
          error: error.message
        });
      }
    }

    // Send Email
    if (channelList.includes('email') && email && template.email) {
      try {
        const emailSubject = this.fillTemplate(template.email.subject, data);
        const emailResult = await emailService.sendTemplateEmail(
          email,
          emailSubject,
          template.email.template,
          data
        );
        
        results.push({
          channel: 'email',
          success: true,
          messageId: emailResult.messageId
        });
        
      } catch (error) {
        logger.error('Email notification failed:', error);
        results.push({
          channel: 'email',
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    logger.info(`📢 Notification sent: ${successCount} successful, ${failureCount} failed`);

    return {
      templateName,
      totalChannels: channelList.length,
      successful: successCount,
      failed: failureCount,
      results
    };
  }

  // Check if user can receive email (rate limiting)
  canSendEmail(userId) {
    const now = Date.now();
    const userLimit = this.emailRateLimit.get(userId) || { count: 0, resetTime: now + 3600000 }; // 1 hour

    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + 3600000;
    }

    const maxEmails = parseInt(process.env.EMAIL_RATE_LIMIT) || 10;
    
    if (userLimit.count >= maxEmails) {
      return false;
    }

    userLimit.count++;
    this.emailRateLimit.set(userId, userLimit);
    return true;
  }

  // Fill template with data
  fillTemplate(template, data) {
    let message = template;
    
    // Replace all placeholders with actual data
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      const value = data[key] || '';
      message = message.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Remove any unreplaced placeholders
    message = message.replace(/\{[^}]+\}/g, '');
    
    return message;
  }

  // Convert priority to SMS priority
  getSMSPriority(priority) {
    const priorityMap = {
      'low': 'normal',
      'normal': 'normal',
      'high': 'normal',
      'urgent': 'normal'
    };
    
    return priorityMap[priority] || 'normal';
  }

  // Send crop alert notification
  async sendCropAlert(user, alert) {
    try {
      if (!this.canSendEmail(user.id)) {
        logger.warn(`Email rate limit exceeded for user ${user.id}`);
        return { success: false, error: 'Rate limit exceeded' };
      }

      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.info('Email notifications disabled');
        return { success: false, error: 'Email notifications disabled' };
      }

      const result = await emailService.sendCropAlertEmail(user, alert);
      
      if (result.success) {
        logger.info(`Crop alert email sent to ${user.email}: ${alert.title}`);
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to send crop alert notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send weather alert notification
  async sendWeatherAlert(user, weatherAlert) {
    try {
      if (!this.canSendEmail(user.id)) {
        logger.warn(`Email rate limit exceeded for user ${user.id}`);
        return { success: false, error: 'Rate limit exceeded' };
      }

      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.info('Email notifications disabled');
        return { success: false, error: 'Email notifications disabled' };
      }

      const result = await emailService.sendWeatherAlertEmail(user, weatherAlert);
      
      if (result.success) {
        logger.info(`Weather alert email sent to ${user.email}: ${weatherAlert.type}`);
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to send weather alert notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send livestock health reminder
  async sendLivestockReminder(user, reminder) {
    try {
      if (!this.canSendEmail(user.id)) {
        logger.warn(`Email rate limit exceeded for user ${user.id}`);
        return { success: false, error: 'Rate limit exceeded' };
      }

      if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
        logger.info('Email notifications disabled');
        return { success: false, error: 'Email notifications disabled' };
      }

      const result = await emailService.sendLivestockHealthReminderEmail(user, reminder);
      
      if (result.success) {
        logger.info(`Livestock reminder email sent to ${user.email}: ${reminder.type}`);
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to send livestock reminder notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send batch notifications
  async sendBatchNotifications(users, notificationType, data) {
    const results = [];
    
    for (const user of users) {
      let result;
      
      switch (notificationType) {
        case 'crop_alert':
          result = await this.sendCropAlert(user, data);
          break;
        case 'weather_alert':
          result = await this.sendWeatherAlert(user, data);
          break;
        case 'livestock_reminder':
          result = await this.sendLivestockReminder(user, data);
          break;
        default:
          result = { success: false, error: 'Unknown notification type' };
      }
      
      results.push({
        userId: user.id,
        email: user.email,
        success: result.success,
        error: result.error
      });
      
      // Add delay between emails to avoid overwhelming SMTP server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    logger.info(`Batch notification completed: ${successful} successful, ${failed} failed`);
    
    return {
      total: results.length,
      successful,
      failed,
      results
    };
  }

  // Schedule notifications (this would typically use a job queue like Bull)
  async scheduleNotification(user, notificationType, data, delayMs = 0) {
    if (delayMs > 0) {
      setTimeout(async () => {
        switch (notificationType) {
          case 'crop_alert':
            await this.sendCropAlert(user, data);
            break;
          case 'weather_alert':
            await this.sendWeatherAlert(user, data);
            break;
          case 'livestock_reminder':
            await this.sendLivestockReminder(user, data);
            break;
        }
      }, delayMs);
      
      logger.info(`Notification scheduled for ${user.email} in ${delayMs}ms`);
      return { success: true, message: 'Notification scheduled' };
    } else {
      // Send immediately
      switch (notificationType) {
        case 'crop_alert':
          return await this.sendCropAlert(user, data);
        case 'weather_alert':
          return await this.sendWeatherAlert(user, data);
        case 'livestock_reminder':
          return await this.sendLivestockReminder(user, data);
        default:
          return { success: false, error: 'Unknown notification type' };
      }
    }
  }

  // Get email statistics
  getEmailStats() {
    const stats = {
      totalUsers: this.emailRateLimit.size,
      rateLimitedUsers: 0,
      emailsSentToday: 0
    };

    for (const [userId, limit] of this.emailRateLimit.entries()) {
      if (limit.count >= (parseInt(process.env.EMAIL_RATE_LIMIT) || 10)) {
        stats.rateLimitedUsers++;
      }
      stats.emailsSentToday += limit.count;
    }

    return stats;
  }

  // Reset rate limits (typically called daily)
  resetRateLimits() {
    this.emailRateLimit.clear();
    logger.info('Email rate limits reset');
  }

  // SMS-specific notification methods
  async sendSMSAlert(phone, templateName, data, options = {}) {
    return await this.sendNotification({
      phone,
      templateName,
      data,
      channels: ['sms'],
      country: options.country || 'UG',
      priority: options.priority || 'normal'
    });
  }

  // Weather Alert SMS
  async sendWeatherAlertSMS(recipients, weatherData) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSMSAlert(recipient.phone, 'weather_alert', {
          weatherCondition: weatherData.condition,
          location: weatherData.location,
          date: weatherData.date,
          actionAdvice: weatherData.actionAdvice
        }, { priority: 'high' });
        
        results.push({ phone: recipient.phone, success: true, ...result });
      } catch (error) {
        results.push({ phone: recipient.phone, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Crop Management SMS
  async sendPlantingReminderSMS(recipients, cropData) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSMSAlert(recipient.phone, 'planting_reminder', {
          cropName: cropData.name,
          location: recipient.location,
          plantingWindow: cropData.plantingWindow
        });
        
        results.push({ phone: recipient.phone, success: true, ...result });
      } catch (error) {
        results.push({ phone: recipient.phone, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Livestock SMS
  async sendVaccinationReminderSMS(recipients, livestockData) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSMSAlert(recipient.phone, 'vaccination_reminder', {
          animalType: livestockData.type,
          tagNumber: livestockData.tagNumber,
          dueDate: livestockData.vaccinationDueDate,
          vaccineName: livestockData.vaccineName,
          vetContact: recipient.vetContact || process.env.DEFAULT_VET_CONTACT || '+256-700-000-000'
        }, { priority: 'high' });
        
        results.push({ phone: recipient.phone, success: true, ...result });
      } catch (error) {
        results.push({ phone: recipient.phone, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Market Price SMS
  async sendMarketPriceSMS(recipients, marketData) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSMSAlert(recipient.phone, 'market_prices', {
          location: marketData.location,
          cropName: marketData.cropName,
          price: marketData.currentPrice,
          trend: marketData.trend,
          marketName: marketData.bestMarket
        });
        
        results.push({ phone: recipient.phone, success: true, ...result });
      } catch (error) {
        results.push({ phone: recipient.phone, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Test SMS system
  async testSMS(phone, country = 'UG') {
    logger.info('🧪 Testing SMS system...');
    
    return await this.sendSMSAlert(phone, 'welcome', {
      farmerName: 'Test Farmer',
      helpline: '+256-700-000-000'
    }, { country });
  }

  // Get available notification templates
  getTemplates() {
    return Object.keys(this.templates).map(name => ({
      name,
      channels: {
        sms: !!this.templates[name].sms,
        email: !!this.templates[name].email
      }
    }));
  }
}

module.exports = new NotificationService();