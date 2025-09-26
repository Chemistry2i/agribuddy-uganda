# AgriBuddy Uganda Backend

Backend API for the AgriBuddy Uganda agricultural management platform.

## Features

- User authentication and authorization
- Crop management and analytics
- Livestock tracking and health monitoring
- Weather information and alerts
- Agricultural extension services
- Plant disease detection
- Community features

## Tech Stack

- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing
- Winston for logging
- Helmet for security

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Weather API key (OpenWeatherMap)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Database credentials
   - JWT secret
   - Weather API key
   - Email configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

6. The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `PATCH /api/auth/reset-password/:token` - Reset password
- `PATCH /api/auth/update-password` - Update password

### Crops
- `GET /api/crops` - Get all user crops
- `POST /api/crops` - Create new crop
- `GET /api/crops/:id` - Get single crop
- `PATCH /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop
- `GET /api/crops/analytics/yield` - Get yield analytics
- `GET /api/crops/calendar/planting` - Get planting schedule
- `GET /api/crops/active/dashboard` - Get active crops

### Livestock
- `GET /api/livestock` - Get all livestock
- `POST /api/livestock` - Add new animal
- `GET /api/livestock/:id` - Get single animal
- `PATCH /api/livestock/:id` - Update animal
- `DELETE /api/livestock/:id` - Remove animal
- `GET /api/livestock/statistics/herd` - Get herd statistics
- `GET /api/livestock/calendar/breeding` - Get breeding calendar
- `GET /api/livestock/calendar/vaccination` - Get vaccination calendar
- `GET /api/livestock/veterinarians/directory` - Get veterinarian directory

### Weather
- `GET /api/weather/current/:location` - Get current weather
- `GET /api/weather/forecast/:location` - Get weather forecast
- `GET /api/weather/alerts/:location` - Get weather alerts
- `GET /api/weather/irrigation/schedule` - Get irrigation schedule
- `GET /api/weather/seasonal/calendar` - Get seasonal calendar
- `GET /api/weather/map/:region` - Get weather map data

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user profile
- `GET /api/users/dashboard/metrics` - Get dashboard metrics
- `GET /api/users/dashboard/activities` - Get community activities
- `GET /api/users/alerts` - Get user alerts
- `GET /api/users/extension/contacts` - Get extension contacts
- `GET /api/users` - Get all users (Admin)
- `PATCH /api/users/:id/role` - Update user role (Admin)

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting
- Data sanitization (NoSQL injection, XSS, HPP)
- JWT token authentication
- Password hashing with bcrypt
- Input validation

## Error Handling

The API uses a centralized error handling middleware that:
- Logs errors using Winston
- Returns consistent error responses
- Handles different types of errors (validation, database, JWT, etc.)
- Provides appropriate HTTP status codes

## Logging

Winston is used for logging with different levels:
- Error logs saved to `logs/error.log`
- All logs saved to `logs/all.log`
- Console logging in development mode

## Development

```bash
# Install dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run in production mode
npm start

# Run tests (when implemented)
npm test
```

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC License - see package.json for details