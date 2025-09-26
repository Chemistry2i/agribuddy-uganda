# 🚀 AgriBuddy Uganda - GitHub Codespaces Setup Guide

## 📋 Current Status
- ✅ **Environment**: GitHub Codespaces (Ubuntu 24.04.2 LTS)
- ✅ **Backend**: Node.js Express server running on port 5000
- ✅ **Database**: SQLite (development) - perfect for Codespaces
- ✅ **SMS Integration**: Multi-provider support (Africa's Talking, Twilio, MTN, Airtel)
- ✅ **Email Service**: Nodemailer with mock fallback
- ✅ **Authentication**: JWT-based auth system

## 🌐 Accessing Your Application

### **Backend API**
Your backend is running on port 5000. In Codespaces, you can access it via:

- **Local**: `http://localhost:5000`
- **Codespaces URL**: GitHub will provide a forwarded URL like:
  - `https://animated-space-carnival-xxxxx-5000.app.github.dev`

### **Health Check**
Test your backend: `GET /health`

## 📱 SMS Integration Features

### **Supported Providers** (Priority Order):
1. **Africa's Talking** (Primary - Best for East Africa)
2. **Twilio** (International backup)
3. **MTN Uganda** (Direct carrier)
4. **Airtel Uganda** (Direct carrier)
5. **Mock SMS** (Development - Currently active)

### **SMS Templates Available**:
- `weather_alert` - Weather warnings
- `planting_reminder` - Crop planting notifications
- `harvest_reminder` - Harvest time alerts
- `vaccination_reminder` - Livestock vaccination
- `market_prices` - Market price updates
- `welcome` - New user welcome
- `account_verification` - Account verification codes
- `password_reset` - Password reset codes

## 🔑 Authentication

### **Default Test Users**:
```
Admin: admin@agribuddy.com / admin123456
Farmer: farmer@example.com / farmer123456
```

### **Getting JWT Token** (for API testing):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@agribuddy.com", "password": "admin123456"}'
```

## 📡 SMS API Endpoints

### **1. Get SMS Templates** (No auth needed for testing)
```bash
curl -X GET http://localhost:5000/api/sms/templates
```

### **2. Send Test SMS** (Admin only)
```bash
curl -X POST http://localhost:5000/api/sms/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+256700123456", "country": "UG"}'
```

### **3. Send Single SMS**
```bash
curl -X POST http://localhost:5000/api/sms/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+256700123456",
    "templateName": "weather_alert",
    "data": {
      "weatherCondition": "Heavy Rain",
      "location": "Kampala",
      "date": "Tomorrow",
      "actionAdvice": "Protect your crops"
    }
  }'
```

### **4. Send Weather Alert to Region**
```bash
curl -X POST http://localhost:5000/api/sms/weather-alert \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Kampala",
    "weatherData": {
      "condition": "Heavy Rain Expected",
      "date": "Tomorrow",
      "actionAdvice": "Cover crops and secure livestock"
    }
  }'
```

## 🏗️ Production Deployment from Codespaces

### **1. SMS Provider Setup** (When ready for production):

#### **Africa's Talking** (Recommended for Uganda):
1. Sign up at [africastalking.com](https://africastalking.com)
2. Get API credentials
3. Update `.env`:
```env
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key
```

#### **Twilio** (International backup):
1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Update `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### **2. Email Configuration** (Optional):
Update `.env` with real SMTP credentials:
```env
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## ⚙️ Codespaces-Specific Benefits

### **✅ Advantages**:
- **No Local Setup**: Everything works out of the box
- **Cloud Database**: SQLite perfect for development
- **Port Forwarding**: Automatic HTTPS URLs
- **Git Integration**: Direct push/pull to your repo
- **Collaborative**: Easy to share development environment

### **🔧 Development Workflow**:
1. **Make changes** in Codespaces editor
2. **Server auto-restarts** (nodemon)
3. **Test APIs** using forwarded URLs
4. **Commit & push** directly from Codespaces

## 📊 Testing & Monitoring

### **Check Server Status**:
```bash
curl http://localhost:5000/health
```

### **View Server Logs**:
Server logs show SMS attempts in development:
```
📱 Mock email sent: { to: '+256700123456', subject: 'Weather Alert' }
```

### **Database Management**:
```bash
# Reset database
node scripts/resetDatabase.js

# Setup fresh database
node scripts/setupDatabase.js
```

## 🚀 Next Steps

### **For Development**:
1. ✅ Backend is fully functional
2. ✅ SMS system works with mock provider
3. ✅ All APIs documented and testable
4. 🔄 **Add Frontend**: React app to consume these APIs
5. 🔄 **Add Real SMS**: Configure Africa's Talking when ready

### **For Production**:
1. 🔄 **Deploy Backend**: Railway, Heroku, or DigitalOcean
2. 🔄 **Setup MySQL**: Production database
3. 🔄 **Configure SMS**: Real provider credentials
4. 🔄 **Domain & SSL**: Custom domain setup

## 💡 Codespaces Tips

### **Port Forwarding**:
- Port 5000 should auto-forward
- Click "Ports" tab to get public URL
- Make port public to test from external tools

### **Environment Variables**:
- `.env` file is already configured
- Add real credentials when ready for production
- Never commit real API keys to git

### **File Watching**:
- Nodemon watches for file changes
- Server restarts automatically
- Check terminal for restart notifications

---

**🎉 Your AgriBuddy Uganda backend is fully operational in GitHub Codespaces!**

The SMS system is ready with comprehensive templates and multi-provider support. Perfect for developing and testing the agricultural notification system for Ugandan farmers! 🌱📱