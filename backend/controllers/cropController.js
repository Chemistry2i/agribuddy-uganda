const asyncHandler = require('express-async-handler');
const { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Mock data for demonstration
const mockCrops = [
  {
    id: 1,
    name: 'Maize',
    variety: 'Hybrid 614',
    plantingDate: '2024-03-15',
    expectedHarvest: '2024-07-15',
    area: 2.5,
    status: 'growing',
    userId: 1
  },
  {
    id: 2,
    name: 'Coffee',
    variety: 'Arabica',
    plantingDate: '2023-01-10',
    expectedHarvest: '2024-12-01',
    area: 1.8,
    status: 'mature',
    userId: 1
  }
];

// @desc    Get all crops for user
// @route   GET /api/crops
// @access  Private
const getAllCrops = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.user.id;

  // Filter crops by user (in real app, this would be a database query)
  const userCrops = mockCrops.filter(crop => crop.userId === userId);
  
  sendPaginatedResponse(res, userCrops, page, limit, userCrops.length);
});

// @desc    Get single crop
// @route   GET /api/crops/:id
// @access  Private
const getCrop = asyncHandler(async (req, res) => {
  const cropId = parseInt(req.params.id);
  const crop = mockCrops.find(c => c.id === cropId && c.userId === req.user.id);

  if (!crop) {
    return sendErrorResponse(res, 404, 'Crop not found');
  }

  sendSuccessResponse(res, 200, 'Crop retrieved successfully', crop);
});

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
const createCrop = asyncHandler(async (req, res) => {
  const { name, variety, plantingDate, expectedHarvest, area } = req.body;

  if (!name || !plantingDate || !area) {
    return sendErrorResponse(res, 400, 'Please provide crop name, planting date, and area');
  }

  const newCrop = {
    id: mockCrops.length + 1,
    name,
    variety,
    plantingDate,
    expectedHarvest,
    area: parseFloat(area),
    status: 'planted',
    userId: req.user.id
  };

  mockCrops.push(newCrop);
  logger.info(`New crop created: ${name} by user ${req.user.id}`);

  sendSuccessResponse(res, 201, 'Crop created successfully', newCrop);
});

// @desc    Update crop
// @route   PATCH /api/crops/:id
// @access  Private
const updateCrop = asyncHandler(async (req, res) => {
  const cropId = parseInt(req.params.id);
  const cropIndex = mockCrops.findIndex(c => c.id === cropId && c.userId === req.user.id);

  if (cropIndex === -1) {
    return sendErrorResponse(res, 404, 'Crop not found');
  }

  mockCrops[cropIndex] = { ...mockCrops[cropIndex], ...req.body };
  
  sendSuccessResponse(res, 200, 'Crop updated successfully', mockCrops[cropIndex]);
});

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = asyncHandler(async (req, res) => {
  const cropId = parseInt(req.params.id);
  const cropIndex = mockCrops.findIndex(c => c.id === cropId && c.userId === req.user.id);

  if (cropIndex === -1) {
    return sendErrorResponse(res, 404, 'Crop not found');
  }

  mockCrops.splice(cropIndex, 1);
  
  sendSuccessResponse(res, 200, 'Crop deleted successfully');
});

// @desc    Get yield analytics
// @route   GET /api/crops/analytics/yield
// @access  Private
const getYieldAnalytics = asyncHandler(async (req, res) => {
  const analytics = {
    totalCrops: mockCrops.filter(c => c.userId === req.user.id).length,
    totalArea: mockCrops.filter(c => c.userId === req.user.id).reduce((sum, crop) => sum + crop.area, 0),
    cropsByStatus: {
      planted: mockCrops.filter(c => c.userId === req.user.id && c.status === 'planted').length,
      growing: mockCrops.filter(c => c.userId === req.user.id && c.status === 'growing').length,
      mature: mockCrops.filter(c => c.userId === req.user.id && c.status === 'mature').length,
      harvested: mockCrops.filter(c => c.userId === req.user.id && c.status === 'harvested').length
    }
  };

  sendSuccessResponse(res, 200, 'Yield analytics retrieved', analytics);
});

// @desc    Get planting schedule
// @route   GET /api/crops/calendar/planting
// @access  Private
const getPlantingSchedule = asyncHandler(async (req, res) => {
  const schedule = mockCrops
    .filter(c => c.userId === req.user.id)
    .map(crop => ({
      id: crop.id,
      name: crop.name,
      plantingDate: crop.plantingDate,
      expectedHarvest: crop.expectedHarvest
    }));

  sendSuccessResponse(res, 200, 'Planting schedule retrieved', schedule);
});

// @desc    Get active crops for dashboard
// @route   GET /api/crops/active/dashboard
// @access  Private
const getActiveCrops = asyncHandler(async (req, res) => {
  const activeCrops = mockCrops.filter(c => 
    c.userId === req.user.id && 
    ['planted', 'growing', 'mature'].includes(c.status)
  );

  sendSuccessResponse(res, 200, 'Active crops retrieved', activeCrops);
});

module.exports = {
  getAllCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  getYieldAnalytics,
  getPlantingSchedule,
  getActiveCrops
};