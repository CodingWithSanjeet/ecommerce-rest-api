const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  console.log(err,"Error Handler")
  let customError = {};
  customError.statusCode = err.statusCode
    ? err.statusCode
    : StatusCodes.INTERNAL_SERVER_ERROR;
  customError.status = customError.statusCode < 500 ? "fail" : "error";
  customError.message =
    err.message ||
    "An unexpected error occurred. Please try again later or contact support if the issue persists.";
  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((err) => err.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.status = "fail";
  }
  res.status(customError.statusCode).json({
    status: customError.status,
    message: customError.message,
    error: err,
    data: {},
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
