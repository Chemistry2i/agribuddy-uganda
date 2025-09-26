const express = require('express');
const router = express.Router();
const livestockController = require('../controllers/livestockController');
const { protect } = require('../middleware/auth');

// Livestock management routes
router.route('/')
  .get(protect, livestockController.getAllLivestock)
  .post(protect, livestockController.addAnimal);

router.route('/:id')
  .get(protect, livestockController.getAnimal)
  .patch(protect, livestockController.updateAnimal)
  .delete(protect, livestockController.removeAnimal);

// Livestock specific features
router.get('/statistics/herd', protect, livestockController.getHerdStatistics);
router.get('/calendar/breeding', protect, livestockController.getBreedingCalendar);
router.get('/calendar/vaccination', protect, livestockController.getVaccinationCalendar);
router.get('/veterinarians/directory', protect, livestockController.getVeterinarianDirectory);

module.exports = router;