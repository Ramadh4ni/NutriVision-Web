function notFoundHandler(req, _res, next) {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found.`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error.",
    errors: error.details || null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
