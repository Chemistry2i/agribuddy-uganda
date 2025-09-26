const emailService = require('./emailService');
const logger = require('./logger');

class NotificationService {
  constructor() {
    this.emailRateLimit = new Map(); // Simple rate limiting
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
}

module.exports = new NotificationService();