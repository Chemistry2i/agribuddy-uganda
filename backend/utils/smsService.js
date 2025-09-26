const AfricasTalking = require('africastalking');
const twilio = require('twilio');
const axios = require('axios');
const logger = require('./logger');

class SMSService {
  constructor() {
    this.providers = [];
    this.initializeProviders();
  }

  // Initialize all SMS providers
  initializeProviders() {
    try {
      // Africa's Talking (Primary for East Africa)
      if (process.env.AFRICASTALKING_USERNAME && process.env.AFRICASTALKING_API_KEY &&
          process.env.AFRICASTALKING_USERNAME !== 'your-username' &&
          process.env.AFRICASTALKING_API_KEY !== 'your-api-key') {
        try {
          const africasTalking = AfricasTalking({
            apiKey: process.env.AFRICASTALKING_API_KEY,
            username: process.env.AFRICASTALKING_USERNAME,
          });
          
          this.providers.push({
            name: 'AfricasTalking',
            service: africasTalking.SMS,
            priority: 1,
            countries: ['UG', 'KE', 'TZ', 'RW', 'MW', 'ZM', 'GH', 'NG'],
            sendMethod: this.sendAfricasTalking.bind(this)
          });
          
          logger.info('✅ Africa\'s Talking SMS provider initialized');
        } catch (error) {
          logger.warn('⚠️ Africa\'s Talking initialization failed:', error.message);
        }
      }

      // Twilio (International fallback)
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
          process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && 
          process.env.TWILIO_AUTH_TOKEN.length > 20) {
        try {
          const twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
          );
          
          this.providers.push({
            name: 'Twilio',
            service: twilioClient,
            priority: 2,
            countries: ['*'], // Works globally
            sendMethod: this.sendTwilio.bind(this)
          });
          
          logger.info('✅ Twilio SMS provider initialized');
        } catch (error) {
          logger.warn('⚠️ Twilio initialization failed (invalid credentials):', error.message);
        }
      }

      // MTN API (Direct integration)
      if (process.env.MTN_API_KEY && process.env.MTN_API_SECRET) {
        this.providers.push({
          name: 'MTN',
          service: null, // Uses axios for API calls
          priority: 3,
          countries: ['UG', 'GH', 'CM', 'CI', 'BJ', 'RW', 'ZM', 'SS'],
          sendMethod: this.sendMTN.bind(this)
        });
        
        logger.info('✅ MTN SMS provider initialized');
      }

      // Airtel API (Direct integration)
      if (process.env.AIRTEL_API_KEY && process.env.AIRTEL_API_SECRET) {
        this.providers.push({
          name: 'Airtel',
          service: null, // Uses axios for API calls
          priority: 4,
          countries: ['UG', 'KE', 'TZ', 'RW', 'ZM', 'MW', 'MG', 'TD', 'NE', 'GA'],
          sendMethod: this.sendAirtel.bind(this)
        });
        
        logger.info('✅ Airtel SMS provider initialized');
      }

      // Mock provider for development
      if (process.env.NODE_ENV === 'development' && this.providers.length === 0) {
        this.providers.push({
          name: 'MockSMS',
          service: null,
          priority: 999,
          countries: ['*'],
          sendMethod: this.sendMockSMS.bind(this)
        });
        
        logger.info('✅ Mock SMS provider initialized for development');
      }

      // Sort providers by priority
      this.providers.sort((a, b) => a.priority - b.priority);
      
      logger.info(`📱 SMS Service initialized with ${this.providers.length} providers:`, 
        this.providers.map(p => p.name).join(', '));

    } catch (error) {
      logger.error('❌ Error initializing SMS providers:', error);
    }
  }

  // Main send SMS method with fallback logic
  async sendSMS(phoneNumber, message, options = {}) {
    const {
      country = 'UG',
      sender = process.env.SMS_SENDER_ID || 'AgriBuddy',
      priority = 'normal',
      retryCount = 2
    } = options;

    logger.info('📱 Attempting to send SMS:', {
      to: phoneNumber,
      message: message.substring(0, 50) + '...',
      country,
      sender
    });

    // Validate phone number
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber, country);
    if (!normalizedPhone) {
      throw new Error('Invalid phone number format');
    }

    // Filter providers based on country support
    const availableProviders = this.providers.filter(provider => 
      provider.countries.includes('*') || provider.countries.includes(country)
    );

    if (availableProviders.length === 0) {
      throw new Error(`No SMS providers available for country: ${country}`);
    }

    let lastError = null;
    
    // Try each provider in order of priority
    for (const provider of availableProviders) {
      try {
        logger.info(`📡 Trying SMS provider: ${provider.name}`);
        
        const result = await provider.sendMethod(normalizedPhone, message, {
          sender,
          country,
          retryCount
        });
        
        logger.info(`✅ SMS sent successfully via ${provider.name}:`, {
          messageId: result.messageId,
          cost: result.cost,
          status: result.status
        });
        
        return {
          success: true,
          provider: provider.name,
          messageId: result.messageId,
          cost: result.cost,
          status: result.status
        };
        
      } catch (error) {
        lastError = error;
        logger.warn(`❌ SMS failed via ${provider.name}:`, error.message);
        
        // If this isn't the last provider, continue to next one
        if (provider !== availableProviders[availableProviders.length - 1]) {
          logger.info('🔄 Trying next SMS provider...');
          continue;
        }
      }
    }
    
    // All providers failed
    logger.error('❌ All SMS providers failed:', lastError);
    throw new Error(`SMS delivery failed: ${lastError?.message || 'Unknown error'}`);
  }

  // Africa's Talking implementation
  async sendAfricasTalking(phoneNumber, message, options) {
    const provider = this.providers.find(p => p.name === 'AfricasTalking');
    
    const result = await provider.service.send({
      to: [phoneNumber],
      message: message,
      from: options.sender
    });
    
    const recipient = result.SMSMessageData.Recipients[0];
    
    if (recipient.status !== 'Success') {
      throw new Error(`Africa's Talking error: ${recipient.status}`);
    }
    
    return {
      messageId: recipient.messageId,
      cost: recipient.cost,
      status: recipient.status
    };
  }

  // Twilio implementation
  async sendTwilio(phoneNumber, message, options) {
    const provider = this.providers.find(p => p.name === 'Twilio');
    
    const result = await provider.service.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    return {
      messageId: result.sid,
      cost: result.price || 'N/A',
      status: result.status
    };
  }

  // MTN API implementation (placeholder - requires actual MTN API documentation)
  async sendMTN(phoneNumber, message, options) {
    try {
      // This is a placeholder implementation
      // You'll need to implement based on MTN's actual API documentation
      const response = await axios.post(process.env.MTN_API_URL || 'https://api.mtn.com/sms/send', {
        to: phoneNumber,
        message: message,
        from: options.sender
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MTN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        messageId: response.data.messageId || 'mtn-' + Date.now(),
        cost: response.data.cost || 'N/A',
        status: response.data.status || 'sent'
      };
    } catch (error) {
      throw new Error(`MTN SMS error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Airtel API implementation (placeholder - requires actual Airtel API documentation)
  async sendAirtel(phoneNumber, message, options) {
    try {
      // This is a placeholder implementation
      // You'll need to implement based on Airtel's actual API documentation
      const response = await axios.post(process.env.AIRTEL_API_URL || 'https://api.airtel.com/sms/send', {
        msisdn: phoneNumber,
        message: message,
        sender_id: options.sender
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTEL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        messageId: response.data.transaction_id || 'airtel-' + Date.now(),
        cost: response.data.cost || 'N/A',
        status: response.data.status || 'sent'
      };
    } catch (error) {
      throw new Error(`Airtel SMS error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Mock SMS for development
  async sendMockSMS(phoneNumber, message, options) {
    logger.info('📱 Mock SMS sent:', {
      to: phoneNumber,
      message: message,
      sender: options.sender,
      timestamp: new Date().toISOString()
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      messageId: 'mock-' + Date.now(),
      cost: 'FREE',
      status: 'delivered'
    };
  }

  // Normalize phone number to international format
  normalizePhoneNumber(phoneNumber, country = 'UG') {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Country-specific formatting
    const countryFormats = {
      'UG': { // Uganda
        prefix: '256',
        length: 12,
        localPrefixes: ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79']
      },
      'KE': { // Kenya
        prefix: '254',
        length: 12,
        localPrefixes: ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79']
      },
      'TZ': { // Tanzania
        prefix: '255',
        length: 12,
        localPrefixes: ['71', '73', '74', '75', '76', '77', '78']
      }
    };
    
    const format = countryFormats[country];
    if (!format) {
      // Default international format
      return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
    }
    
    // Remove country code if present
    if (cleaned.startsWith(format.prefix)) {
      cleaned = cleaned.substring(format.prefix.length);
    }
    
    // Remove leading zero
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Validate length and format
    if (cleaned.length !== (format.length - format.prefix.length)) {
      return null;
    }
    
    // Check if starts with valid prefix
    const startsWithValidPrefix = format.localPrefixes.some(prefix => 
      cleaned.startsWith(prefix)
    );
    
    if (!startsWithValidPrefix) {
      return null;
    }
    
    return '+' + format.prefix + cleaned;
  }

  // Bulk SMS sending
  async sendBulkSMS(phoneNumbers, message, options = {}) {
    const results = [];
    const batchSize = options.batchSize || 10;
    const delay = options.delay || 1000; // 1 second delay between batches
    
    logger.info(`📱 Sending bulk SMS to ${phoneNumbers.length} recipients`);
    
    for (let i = 0; i < phoneNumbers.length; i += batchSize) {
      const batch = phoneNumbers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (phoneNumber) => {
        try {
          const result = await this.sendSMS(phoneNumber, message, options);
          return { phoneNumber, success: true, ...result };
        } catch (error) {
          return { phoneNumber, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < phoneNumbers.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    logger.info(`📱 Bulk SMS completed: ${successful} successful, ${failed} failed`);
    
    return {
      total: phoneNumbers.length,
      successful,
      failed,
      results
    };
  }

  // Get provider status
  getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      priority: provider.priority,
      countries: provider.countries,
      available: true // You could add health checks here
    }));
  }
}

module.exports = new SMSService();