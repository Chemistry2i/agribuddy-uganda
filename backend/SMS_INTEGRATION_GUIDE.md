# 📱 SMS Integration Guide - AgriBuddy Uganda

## 🌟 Overview

AgriBuddy Uganda now supports comprehensive SMS notifications with multiple provider support and automatic failover. This system is designed specifically for Ugandan farmers and can send notifications for weather alerts, crop management, livestock care, and market prices.

## 🚀 SMS Providers Supported

### 1. **Africa's Talking** (Primary - East Africa)
- **Best for**: Uganda, Kenya, Tanzania, Rwanda, Ghana, Nigeria
- **Setup**: Get API credentials from [africastalking.com](https://africastalking.com)
- **Cost**: Very competitive rates for East Africa

### 2. **Twilio** (International Fallback)
- **Best for**: Global coverage, high reliability
- **Setup**: Get credentials from [twilio.com](https://twilio.com)
- **Cost**: Higher but excellent global coverage

### 3. **MTN Uganda** (Direct Carrier)
- **Best for**: MTN subscribers in Uganda
- **Setup**: Contact MTN Business for API access
- **Cost**: Carrier rates

### 4. **Airtel Uganda** (Direct Carrier)
- **Best for**: Airtel subscribers in Uganda
- **Setup**: Contact Airtel Business for API access
- **Cost**: Carrier rates

## 🔧 Setup Instructions

### 1. Get API Credentials

#### Africa's Talking Setup:
1. Sign up at [africastalking.com](https://africastalking.com)
2. Verify your account
3. Get your `username` and `API key`
4. Add credits to your account

#### Twilio Setup:
1. Sign up at [twilio.com](https://twilio.com)
2. Get your `Account SID` and `Auth Token`
3. Get a Twilio phone number
4. Add credits to your account

### 2. Configure Environment Variables

Update your `.env` file with your SMS provider credentials:

```env
# SMS Configuration
SMS_SENDER_ID=AgriBuddy

# Africa's Talking (Primary SMS provider)
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key

# Twilio (International SMS provider)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# MTN SMS API (Contact MTN for credentials)
MTN_API_KEY=your-mtn-api-key
MTN_API_SECRET=your-mtn-api-secret
MTN_API_URL=https://api.mtn.com/sms/send

# Airtel SMS API (Contact Airtel for credentials)
AIRTEL_API_KEY=your-airtel-api-key
AIRTEL_API_SECRET=your-airtel-api-secret
AIRTEL_API_URL=https://api.airtel.com/sms/send
```

## 📡 API Endpoints

### Send Single SMS
```http
POST /api/sms/send
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "phone": "+256700123456",
  "templateName": "weather_alert",
  "data": {
    "weatherCondition": "Heavy Rain",
    "location": "Kampala",
    "date": "Tomorrow",
    "actionAdvice": "Cover your crops"
  },
  "country": "UG",
  "priority": "high"
}
```

### Send Bulk SMS
```http
POST /api/sms/bulk
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "recipients": [
    {
      "phone": "+256700123456",
      "data": {"farmerName": "John"}
    },
    {
      "phone": "+256700123457", 
      "data": {"farmerName": "Mary"}
    }
  ],
  "templateName": "planting_reminder",
  "data": {
    "cropName": "Maize",
    "location": "Mukono",
    "plantingWindow": "March-April"
  }
}
```

### Weather Alert SMS
```http
POST /api/sms/weather-alert
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "location": "Kampala",
  "weatherData": {
    "condition": "Heavy Rain Expected",
    "date": "Tomorrow",
    "actionAdvice": "Protect your crops and livestock"
  }
}
```

### Market Price SMS
```http
POST /api/sms/market-prices
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "marketData": {
    "location": "Nakasero Market",
    "cropName": "Maize",
    "currentPrice": "2500",
    "trend": "rising",
    "bestMarket": "Nakasero Market"
  },
  "targetUsers": [
    {"phone": "+256700123456"},
    {"phone": "+256700123457"}
  ]
}
```

## 📋 SMS Templates Available

### 1. Weather Alerts
- `weather_alert`: Weather warnings and advisories

### 2. Crop Management
- `planting_reminder`: Optimal planting time notifications
- `harvest_reminder`: Harvest time alerts
- `fertilizer_reminder`: Fertilizer application reminders
- `pest_alert`: Pest and disease warnings

### 3. Livestock Management
- `vaccination_reminder`: Animal vaccination schedules
- `breeding_reminder`: Breeding time notifications
- `health_alert`: Livestock health warnings

### 4. Market Information
- `market_prices`: Current market price updates

### 5. System Notifications
- `welcome`: New user welcome message
- `account_verification`: Account verification codes
- `password_reset`: Password reset codes

## 🧪 Testing SMS System

### Test Single SMS
```http
POST /api/sms/test
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "phone": "+256700123456",
  "country": "UG"
}
```

### Get SMS Templates
```http
GET /api/sms/templates
Authorization: Bearer {jwt_token}
```

### Check Provider Status
```http
GET /api/sms/providers
Authorization: Bearer {admin_jwt_token}
```

## 📱 Phone Number Format

The system automatically formats phone numbers for Uganda:

**Accepted formats:**
- `+256700123456` (International format)
- `256700123456` (Without +)
- `0700123456` (Local format)
- `700123456` (Without leading 0)

**Supported Ugandan prefixes:**
- MTN: 77, 78, 76
- Airtel: 70, 75, 74
- UTL: 71, 72
- Others: 73, 79

## 💰 Cost Optimization

### Provider Priority (Automatic Failover):
1. **Africa's Talking** (Lowest cost for East Africa)
2. **Twilio** (Higher cost but reliable)
3. **MTN Direct** (Carrier rates)
4. **Airtel Direct** (Carrier rates)

### Cost-Saving Tips:
- Use Africa's Talking for bulk SMS to East Africa
- Set up bulk sending with delays to avoid rate limits
- Monitor SMS costs through provider dashboards
- Use templates to ensure consistent messaging

## 🔐 Security & Permissions

### Required Roles:
- **Admin**: Can send any SMS, view statistics, test system
- **Extension Officer**: Can send alerts and reminders to farmers
- **Farmer**: Cannot send SMS (receive only)

### Rate Limiting:
- Built-in rate limiting to prevent abuse
- Automatic delays between batch sends
- Provider-level rate limiting respected

## 🚨 Error Handling

### Automatic Failover:
1. Try primary provider (Africa's Talking)
2. If failed, try secondary provider (Twilio)
3. If failed, try carrier-specific providers
4. Log all failures for monitoring

### Common Error Messages:
- `Invalid phone number format`
- `SMS delivery failed: [reason]`
- `Rate limit exceeded`
- `Insufficient credits`

## 📊 Monitoring & Analytics

### Available Endpoints:
- `GET /api/sms/stats` - SMS usage statistics
- `GET /api/sms/providers` - Provider status and health

### Key Metrics:
- Total SMS sent
- Success/failure rates
- Cost per SMS
- Popular templates
- Geographic distribution

## 🌍 Multi-Country Support

Currently optimized for:
- **Uganda** (Primary market)
- **Kenya** (Africa's Talking)
- **Tanzania** (Africa's Talking)
- **Rwanda** (Africa's Talking)

Easy to extend to other African countries by updating phone number validation.

## 🚀 Production Deployment

### Before Going Live:
1. **Get real API credentials** from SMS providers
2. **Add sufficient credits** to your accounts
3. **Test with small batches** first
4. **Set up monitoring** and alerting
5. **Configure proper sender IDs** for branding

### Recommended Setup:
- Africa's Talking as primary (cheap, reliable in East Africa)
- Twilio as backup (global coverage)
- Monitor costs and adjust provider priority as needed

## 📞 Support Contacts

### For Issues:
- **Africa's Talking**: support@africastalking.com
- **Twilio**: support@twilio.com
- **MTN Uganda**: Contact your business account manager
- **Airtel Uganda**: Contact your business account manager

---

**Ready to send SMS notifications to Ugandan farmers! 🌱📱**

This comprehensive SMS system will help you reach farmers instantly with critical information about weather, crops, livestock, and market prices.