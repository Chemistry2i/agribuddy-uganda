// Success response
const sendSuccessResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    status: 'success',
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response
const sendErrorResponse = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  const response = {
    status: 'error',
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Paginated response
const sendPaginatedResponse = (res, data, page, limit, total, statusCode = 200) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.status(statusCode).json({
    status: 'success',
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage
    }
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse
};