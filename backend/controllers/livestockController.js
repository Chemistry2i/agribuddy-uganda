const asyncHandler = require('express-async-handler');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/apiResponse');

// Mock livestock data
const mockLivestock = [
  {
    id: 1,
    type: 'Cattle',
    breed: 'Ankole',
    age: 3,
    weight: 450,
    healthStatus: 'Healthy',
    lastVaccination: '2024-01-15',
    userId: 1
  }
];

// @desc    Get all livestock
// @route   GET /api/livestock
// @access  Private
const getAllLivestock = asyncHandler(async (req, res) => {
  const userLivestock = mockLivestock.filter(animal => animal.userId === req.user.id);
  sendSuccessResponse(res, 200, 'Livestock retrieved successfully', userLivestock);
});

// @desc    Add new animal
// @route   POST /api/livestock
// @access  Private
const addAnimal = asyncHandler(async (req, res) => {
  const newAnimal = {
    id: mockLivestock.length + 1,
    ...req.body,
    userId: req.user.id
  };
  
  mockLivestock.push(newAnimal);
  sendSuccessResponse(res, 201, 'Animal added successfully', newAnimal);
});

// @desc    Get single animal
// @route   GET /api/livestock/:id
// @access  Private
const getAnimal = asyncHandler(async (req, res) => {
  const animal = mockLivestock.find(a => a.id === parseInt(req.params.id) && a.userId === req.user.id);
  
  if (!animal) {
    return sendErrorResponse(res, 404, 'Animal not found');
  }
  
  sendSuccessResponse(res, 200, 'Animal retrieved successfully', animal);
});

// @desc    Update animal
// @route   PATCH /api/livestock/:id
// @access  Private
const updateAnimal = asyncHandler(async (req, res) => {
  const animalIndex = mockLivestock.findIndex(a => a.id === parseInt(req.params.id) && a.userId === req.user.id);
  
  if (animalIndex === -1) {
    return sendErrorResponse(res, 404, 'Animal not found');
  }
  
  mockLivestock[animalIndex] = { ...mockLivestock[animalIndex], ...req.body };
  sendSuccessResponse(res, 200, 'Animal updated successfully', mockLivestock[animalIndex]);
});

// @desc    Remove animal
// @route   DELETE /api/livestock/:id
// @access  Private
const removeAnimal = asyncHandler(async (req, res) => {
  const animalIndex = mockLivestock.findIndex(a => a.id === parseInt(req.params.id) && a.userId === req.user.id);
  
  if (animalIndex === -1) {
    return sendErrorResponse(res, 404, 'Animal not found');
  }
  
  mockLivestock.splice(animalIndex, 1);
  sendSuccessResponse(res, 200, 'Animal removed successfully');
});

// @desc    Get herd statistics
// @route   GET /api/livestock/statistics/herd
// @access  Private
const getHerdStatistics = asyncHandler(async (req, res) => {
  const userLivestock = mockLivestock.filter(animal => animal.userId === req.user.id);
  
  const stats = {
    totalAnimals: userLivestock.length,
    byType: userLivestock.reduce((acc, animal) => {
      acc[animal.type] = (acc[animal.type] || 0) + 1;
      return acc;
    }, {}),
    healthyAnimals: userLivestock.filter(a => a.healthStatus === 'Healthy').length
  };
  
  sendSuccessResponse(res, 200, 'Herd statistics retrieved', stats);
});

// @desc    Get breeding calendar
// @route   GET /api/livestock/calendar/breeding
// @access  Private
const getBreedingCalendar = asyncHandler(async (req, res) => {
  // Mock breeding calendar data
  const breedingCalendar = [];
  sendSuccessResponse(res, 200, 'Breeding calendar retrieved', breedingCalendar);
});

// @desc    Get vaccination calendar
// @route   GET /api/livestock/calendar/vaccination
// @access  Private
const getVaccinationCalendar = asyncHandler(async (req, res) => {
  const userLivestock = mockLivestock.filter(animal => animal.userId === req.user.id);
  
  const vaccinationCalendar = userLivestock.map(animal => ({
    animalId: animal.id,
    type: animal.type,
    lastVaccination: animal.lastVaccination,
    nextVaccination: new Date(new Date(animal.lastVaccination).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
  
  sendSuccessResponse(res, 200, 'Vaccination calendar retrieved', vaccinationCalendar);
});

// @desc    Get veterinarian directory
// @route   GET /api/livestock/veterinarians/directory
// @access  Private
const getVeterinarianDirectory = asyncHandler(async (req, res) => {
  // Mock veterinarian data
  const veterinarians = [
    {
      id: 1,
      name: 'Dr. Sarah Nakato',
      specialization: 'Large Animals',
      phone: '+256 700 123 456',
      location: 'Kampala',
      rating: 4.8
    }
  ];
  
  sendSuccessResponse(res, 200, 'Veterinarian directory retrieved', veterinarians);
});

module.exports = {
  getAllLivestock,
  addAnimal,
  getAnimal,
  updateAnimal,
  removeAnimal,
  getHerdStatistics,
  getBreedingCalendar,
  getVaccinationCalendar,
  getVeterinarianDirectory
};