# Email Configuration Guide for AgriBuddy Uganda

This guide will help you set up email functionality for the AgriBuddy Uganda backend using Nodemailer.

## Overview

The email system includes:
- Welcome emails for new users
- Password reset emails
- Crop alerts and notifications
- Weather alerts
- Livestock health reminders
- Rate limiting to prevent spam
- Beautiful HTML email templates

## Email Service Providers

### 1. Gmail (Recommended for Development)

**Setup Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Update your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=AgriBuddy Uganda
ENABLE_EMAIL_NOTIFICATIONS=true
```

### 2. Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_EMAIL=your_email@outlook.com
SMTP_PASSWORD=your_password
```

### 3. Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_EMAIL=your_email@yahoo.com
SMTP_PASSWORD=your_app_password
```

### 4. Custom SMTP Server

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_EMAIL=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

### 5. Professional Email Services

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_EMAIL=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_EMAIL=postmaster@your_domain
SMTP_PASSWORD=your_mailgun_password
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Email Configuration
EMAIL_FROM=noreply@agribuddy.com
EMAIL_FROM_NAME=AgriBuddy Uganda
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Email Features
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RATE_LIMIT=10  # Max emails per hour per user

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Email Templates

The system includes responsive HTML email templates for:

1. **Welcome Email** - Sent when users register
2. **Password Reset** - Sent when users request password reset
3. **Crop Alerts** - Notifications about crop status
4. **Weather Alerts** - Weather warnings and updates
5. **Livestock Reminders** - Vaccination and health reminders

## API Endpoints

### Authentication Emails
- Welcome email: Automatically sent on registration
- Password reset: `POST /api/auth/forgot-password`

### Development Testing (Development mode only)
- `GET /api/email/test-connection` - Test SMTP connection
- `POST /api/email/test-welcome` - Send test welcome email
- `POST /api/email/test-password-reset` - Send test password reset
- `POST /api/email/test-crop-alert` - Send test crop alert
- `POST /api/email/test-weather-alert` - Send test weather alert
- `POST /api/email/test-livestock-reminder` - Send test livestock reminder
- `GET /api/email/stats` - Get email statistics

## Testing Email Configuration

### 1. Start the Server
```bash
cd backend
npm install
npm run dev
```

### 2. Test SMTP Connection
```bash
curl -X GET http://localhost:5000/api/email/test-connection \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Send Test Email
```bash
curl -X POST http://localhost:5000/api/email/test-welcome \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"email": "test@example.com"}'
```

## Development Mode

For development without real email setup, the system can use Ethereal Email (fake SMTP):
- Set `ENABLE_EMAIL_NOTIFICATIONS=false` to disable emails
- Or leave SMTP settings empty to use Ethereal (preview URLs in logs)

## Rate Limiting

Email sending is rate-limited to prevent abuse:
- Default: 10 emails per hour per user
- Configurable via `EMAIL_RATE_LIMIT` environment variable
- Resets every hour

## Troubleshooting

### Common Issues

1. **"Invalid login" with Gmail**
   - Ensure 2FA is enabled
   - Use App Password, not regular password
   - Check if "Less secure app access" is needed

2. **Emails not sending**
   - Check SMTP credentials
   - Verify network connectivity
   - Check server logs for detailed errors

3. **Emails going to spam**
   - Set up SPF, DKIM, and DMARC records
   - Use a reputable SMTP service
   - Avoid spam trigger words

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
```

Check logs in:
- Console output
- `logs/all.log`
- `logs/error.log`

## Production Recommendations

1. **Use Professional Email Service**
   - SendGrid, Mailgun, Amazon SES
   - Better deliverability and reliability

2. **Domain Authentication**
   - Set up SPF records
   - Configure DKIM signing
   - Implement DMARC policy

3. **Email Queue**
   - Implement job queue (Bull, Agenda)
   - Handle email failures gracefully
   - Retry mechanisms

4. **Monitoring**
   - Track email delivery rates
   - Monitor bounce rates
   - Set up alerts for failures

## Email Content Guidelines

- Keep subject lines under 50 characters
- Use responsive HTML templates
- Include plain text version
- Add unsubscribe links
- Test across different email clients

## Security Considerations

- Store SMTP credentials securely
- Use environment variables
- Enable SMTP authentication
- Use TLS/SSL encryption
- Implement rate limiting
- Validate email addresses

## Support

For issues or questions:
1. Check server logs
2. Test SMTP connection
3. Verify environment variables
4. Review email templates
5. Contact development team

---

## Quick Start Checklist

- [ ] Install nodemailer: `npm install nodemailer`
- [ ] Copy `.env.example` to `.env`
- [ ] Configure SMTP settings
- [ ] Set `ENABLE_EMAIL_NOTIFICATIONS=true`
- [ ] Test connection: `/api/email/test-connection`
- [ ] Send test email: `/api/email/test-welcome`
- [ ] Register new user to test welcome email
- [ ] Test password reset flow

Your email system is now ready! 📧✨