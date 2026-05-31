function validateBody(requiredFields = []) {
  return (req, _res, next) => {
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.details = missingFields.map((field) => ({
        field,
        message: `${field} is required.`,
      }));
      return next(error);
    }

    return next();
  };
}

module.exports = {
  validateBody,
};
