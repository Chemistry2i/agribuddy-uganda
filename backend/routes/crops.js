const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { protect } = require('../middleware/auth');

// Crop management routes
router.route('/')
  .get(protect, cropController.getAllCrops)
  .post(protect, cropController.createCrop);

router.route('/:id')
  .get(protect, cropController.getCrop)
  .patch(protect, cropController.updateCrop)
  .delete(protect, cropController.deleteCrop);

// Crop analytics and calendar
router.get('/analytics/yield', protect, cropController.getYieldAnalytics);
router.get('/calendar/planting', protect, cropController.getPlantingSchedule);
router.get('/active/dashboard', protect, cropController.getActiveCrops);

module.exports = router;