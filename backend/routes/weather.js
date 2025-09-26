const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

// Weather information routes
router.get('/current/:location', protect, weatherController.getCurrentWeather);
router.get('/forecast/:location', protect, weatherController.getWeatherForecast);
router.get('/alerts/:location', protect, weatherController.getWeatherAlerts);
router.get('/irrigation/schedule', protect, weatherController.getIrrigationSchedule);
router.get('/seasonal/calendar', protect, weatherController.getSeasonalCalendar);
router.get('/map/:region', protect, weatherController.getWeatherMap);

module.exports = router;