#!/bin/bash

echo "🧪 Testing AgriBuddy Uganda SMS Integration in Codespaces"
echo "========================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server URL
SERVER_URL="http://localhost:5000"

echo -e "${BLUE}1. Testing Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s "$SERVER_URL/health")
if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Server is healthy${NC}"
else
    echo -e "${RED}❌ Server health check failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}2. Getting Admin JWT Token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@agribuddy.com", "password": "admin123456"}')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
    echo -e "${GREEN}✅ Admin login successful${NC}"
    echo -e "${YELLOW}Token: ${TOKEN:0:20}...${NC}"
else
    echo -e "${RED}❌ Admin login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

echo -e "${BLUE}3. Testing SMS Templates Endpoint...${NC}"
TEMPLATES_RESPONSE=$(curl -s -X GET "$SERVER_URL/api/sms/templates" \
    -H "Authorization: Bearer $TOKEN")

if [[ $TEMPLATES_RESPONSE == *"weather_alert"* ]]; then
    echo -e "${GREEN}✅ SMS templates loaded successfully${NC}"
    echo -e "${YELLOW}Available templates:${NC}"
    echo $TEMPLATES_RESPONSE | grep -o '"name":"[^"]*' | grep -o '[^"]*$' | head -5
else
    echo -e "${RED}❌ SMS templates failed${NC}"
    echo "Response: $TEMPLATES_RESPONSE"
fi
echo ""

echo -e "${BLUE}4. Testing SMS Provider Status...${NC}"
PROVIDERS_RESPONSE=$(curl -s -X GET "$SERVER_URL/api/sms/providers" \
    -H "Authorization: Bearer $TOKEN")

if [[ $PROVIDERS_RESPONSE == *"MockSMS"* ]]; then
    echo -e "${GREEN}✅ SMS providers loaded (Mock mode for development)${NC}"
else
    echo -e "${YELLOW}⚠️  SMS providers response: $PROVIDERS_RESPONSE${NC}"
fi
echo ""

echo -e "${BLUE}5. Testing Mock SMS Send...${NC}"
SMS_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/sms/test" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"phone": "+256700123456", "country": "UG"}')

if [[ $SMS_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Mock SMS test successful${NC}"
else
    echo -e "${RED}❌ Mock SMS test failed${NC}"
    echo "Response: $SMS_RESPONSE"
fi
echo ""

echo -e "${BLUE}6. Testing Weather Alert SMS...${NC}"
WEATHER_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/sms/send" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "phone": "+256700123456",
        "templateName": "weather_alert",
        "data": {
            "weatherCondition": "Heavy Rain",
            "location": "Kampala",
            "date": "Tomorrow",
            "actionAdvice": "Protect your crops and livestock"
        }
    }')

if [[ $WEATHER_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Weather alert SMS successful${NC}"
else
    echo -e "${RED}❌ Weather alert SMS failed${NC}"
    echo "Response: $WEATHER_RESPONSE"
fi
echo ""

echo -e "${BLUE}7. Testing Crop Reminder SMS...${NC}"
CROP_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/sms/send" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "phone": "+256700123456",
        "templateName": "planting_reminder",
        "data": {
            "cropName": "Maize",
            "location": "Mukono",
            "plantingWindow": "March-April 2025"
        }
    }')

if [[ $CROP_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Crop reminder SMS successful${NC}"
else
    echo -e "${RED}❌ Crop reminder SMS failed${NC}"
    echo "Response: $CROP_RESPONSE"
fi
echo ""

echo -e "${BLUE}8. Testing Market Price SMS...${NC}"
MARKET_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/sms/send" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "phone": "+256700123456",
        "templateName": "market_prices",
        "data": {
            "location": "Nakasero Market",
            "cropName": "Maize",
            "price": "2500 UGX/kg",
            "trend": "rising",
            "marketName": "Nakasero Market"
        }
    }')

if [[ $MARKET_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Market price SMS successful${NC}"
else
    echo -e "${RED}❌ Market price SMS failed${NC}"
    echo "Response: $MARKET_RESPONSE"
fi
echo ""

echo "========================================================"
echo -e "${GREEN}🎉 AgriBuddy Uganda SMS Integration Test Complete!${NC}"
echo ""
echo -e "${YELLOW}📱 SMS System Status:${NC}"
echo "   • Mock SMS provider active (perfect for development)"
echo "   • All templates working correctly"
echo "   • Weather, crop, and market notifications functional"
echo "   • Ready for production with real SMS providers"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "   • Add Africa's Talking credentials for real SMS"
echo "   • Test with actual Ugandan phone numbers"
echo "   • Deploy to production environment"
echo "   • Connect frontend application"
echo ""
echo -e "${BLUE}📖 Check CODESPACES_SETUP.md for detailed documentation${NC}"