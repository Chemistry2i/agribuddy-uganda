const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

    // Create nodemailer transporter
  initializeTransporter() {
    try {
      logger.info('Initializing email transporter...');
      
      // Check environment variables
      const nodeEnv = process.env.NODE_ENV;
      const smtpEmail = process.env.SMTP_EMAIL;
      const smtpPassword = process.env.SMTP_PASSWORD;
      
      logger.info('Email config check:', {
        nodeEnv,
        hasSmtpEmail: !!smtpEmail,
        hasSmtpPassword: !!smtpPassword
      });

      // Always use mock transporter for development unless real credentials are provided
      if (smtpEmail && smtpPassword) {
        // Use real SMTP settings
        logger.info('Creating real SMTP transporter...');
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpEmail,
            pass: smtpPassword
          }
        });
        logger.info('✅ Real email transporter created successfully');
      } else {
        // Mock transporter for development/testing
        logger.info('Creating mock email transporter...');
        this.transporter = {
          sendMail: async (mailOptions) => {
            logger.info('📧 Mock email sent:', { 
              to: mailOptions.to, 
              subject: mailOptions.subject,
              from: mailOptions.from 
            });
            return { messageId: 'mock-' + Date.now() };
          },
          verify: async () => {
            logger.info('✅ Mock transporter verification passed');
            return true;
          }
        };
        logger.info('✅ Mock email transporter created successfully');
      }
    } catch (error) {
      logger.error('Failed to create email transporter:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      // Create mock transporter as fallback
      this.transporter = {
        sendMail: async (mailOptions) => {
          logger.info('Fallback mock email sent:', { to: mailOptions.to, subject: mailOptions.subject });
          return { messageId: 'fallback-' + Date.now() };
        }
      };
    }
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }
      
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service verification failed:', error);
      return false;
    }
  }

  // Send email
  async sendEmail(options) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'AgriBuddy Uganda'} <${process.env.EMAIL_FROM || process.env.SMTP_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments || []
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info(`Email sent successfully to ${options.to}: ${options.subject}`);
      
      // For development with Ethereal, log the preview URL
      if (process.env.NODE_ENV === 'development') {
        const previewUrl = nodemailer.getTestMessageUrl(result);
        if (previewUrl) {
          logger.info(`Preview URL: ${previewUrl}`);
        }
      }

      return {
        success: true,
        messageId: result.messageId,
        previewUrl: nodemailer.getTestMessageUrl(result)
      };
    } catch (error) {
      logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const htmlContent = this.generateWelcomeEmailTemplate(user);
    
    return await this.sendEmail({
      to: user.email,
      subject: 'Welcome to AgriBuddy Uganda! 🌱',
      html: htmlContent,
      text: `Welcome to AgriBuddy Uganda, ${user.name}! We're excited to help you with your agricultural journey.`
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const htmlContent = this.generatePasswordResetTemplate(user, resetUrl);
    
    return await this.sendEmail({
      to: user.email,
      subject: 'Reset Your AgriBuddy Uganda Password 🔐',
      html: htmlContent,
      text: `Hello ${user.name}, you requested a password reset. Click here to reset: ${resetUrl}`
    });
  }

  // Send crop alert notification
  async sendCropAlertEmail(user, alert) {
    const htmlContent = this.generateCropAlertTemplate(user, alert);
    
    return await this.sendEmail({
      to: user.email,
      subject: `🌾 Crop Alert: ${alert.title}`,
      html: htmlContent,
      text: `Hello ${user.name}, ${alert.message}`
    });
  }

  // Send weather alert notification
  async sendWeatherAlertEmail(user, weatherAlert) {
    const htmlContent = this.generateWeatherAlertTemplate(user, weatherAlert);
    
    return await this.sendEmail({
      to: user.email,
      subject: `🌦️ Weather Alert: ${weatherAlert.type}`,
      html: htmlContent,
      text: `Hello ${user.name}, Weather Alert: ${weatherAlert.description}`
    });
  }

  // Send livestock health reminder
  async sendLivestockHealthReminderEmail(user, reminder) {
    const htmlContent = this.generateLivestockReminderTemplate(user, reminder);
    
    return await this.sendEmail({
      to: user.email,
      subject: `🐄 Livestock Health Reminder: ${reminder.type}`,
      html: htmlContent,
      text: `Hello ${user.name}, Reminder: ${reminder.message}`
    });
  }

  // Generate welcome email template
  generateWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AgriBuddy Uganda</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Welcome to AgriBuddy Uganda!</h1>
          <p>Your Smart Agricultural Companion</p>
        </div>
        
        <div class="content">
          <h2>Hello ${user.name}! 👋</h2>
          
          <p>Welcome to AgriBuddy Uganda! We're thrilled to have you join our community of smart farmers who are transforming agriculture across Uganda.</p>
          
          <div class="feature">
            <h3>🌾 Crop Management</h3>
            <p>Track your crops, get planting schedules, and monitor yield analytics.</p>
          </div>
          
          <div class="feature">
            <h3>🐄 Livestock Tracking</h3>
            <p>Manage your animals, vaccination schedules, and health records.</p>
          </div>
          
          <div class="feature">
            <h3>🌤️ Weather Insights</h3>
            <p>Get real-time weather data, forecasts, and agricultural alerts.</p>
          </div>
          
          <div class="feature">
            <h3>🔬 Disease Detection</h3>
            <p>AI-powered plant disease identification to protect your crops.</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL}/login" class="button">Get Started Now</a>
          
          <p>If you have any questions, our support team is here to help. Contact us anytime!</p>
          
          <p>Happy farming! 🚜</p>
        </div>
        
        <div class="footer">
          <p>© 2024 AgriBuddy Uganda. All rights reserved.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate password reset template
  generatePasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${user.name},</h2>
          
          <p>We received a request to reset your AgriBuddy Uganda account password.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 10 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          
          <p>If you need help, contact our support team.</p>
        </div>
        
        <div class="footer">
          <p>© 2024 AgriBuddy Uganda. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate crop alert template
  generateCropAlertTemplate(user, alert) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Crop Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌾 Crop Alert</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${user.name},</h2>
          
          <div class="alert-box">
            <h3>${alert.title}</h3>
            <p><strong>Priority:</strong> ${alert.priority}</p>
            <p><strong>Crop:</strong> ${alert.cropName || 'Multiple crops'}</p>
            <p><strong>Message:</strong> ${alert.message}</p>
            ${alert.action ? `<p><strong>Recommended Action:</strong> ${alert.action}</p>` : ''}
          </div>
          
          <a href="${process.env.FRONTEND_URL}/crop-management" class="button">View Crop Dashboard</a>
          
          <p>Stay on top of your crop management with AgriBuddy Uganda!</p>
        </div>
        
        <div class="footer">
          <p>© 2024 AgriBuddy Uganda. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate weather alert template
  generateWeatherAlertTemplate(user, weatherAlert) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #dbeafe; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .severe { background: #fecaca; border-color: #ef4444; }
          .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌦️ Weather Alert</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${user.name},</h2>
          
          <div class="alert-box ${weatherAlert.severity === 'severe' ? 'severe' : ''}">
            <h3>${weatherAlert.type}</h3>
            <p><strong>Severity:</strong> ${weatherAlert.severity}</p>
            <p><strong>Location:</strong> ${user.location}</p>
            <p><strong>Description:</strong> ${weatherAlert.description}</p>
            <p><strong>Valid:</strong> ${new Date(weatherAlert.startTime).toLocaleString()} - ${new Date(weatherAlert.endTime).toLocaleString()}</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL}/weather-dashboard" class="button">View Weather Dashboard</a>
          
          <p>Stay safe and protect your crops with timely weather information!</p>
        </div>
        
        <div class="footer">
          <p>© 2024 AgriBuddy Uganda. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate livestock reminder template
  generateLivestockReminderTemplate(user, reminder) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Livestock Health Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .reminder-box { background: #f3e8ff; border: 1px solid #8b5cf6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐄 Livestock Health Reminder</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${user.name},</h2>
          
          <div class="reminder-box">
            <h3>${reminder.type}</h3>
            <p><strong>Animal:</strong> ${reminder.animalType} - ${reminder.animalId}</p>
            <p><strong>Due Date:</strong> ${new Date(reminder.dueDate).toLocaleDateString()}</p>
            <p><strong>Message:</strong> ${reminder.message}</p>
            ${reminder.veterinarian ? `<p><strong>Recommended Vet:</strong> ${reminder.veterinarian}</p>` : ''}
          </div>
          
          <a href="${process.env.FRONTEND_URL}/livestock-management" class="button">View Livestock Dashboard</a>
          
          <p>Keep your animals healthy with timely care and vaccinations!</p>
        </div>
        
        <div class="footer">
          <p>© 2024 AgriBuddy Uganda. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();