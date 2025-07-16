const { StatusCodes } = require("http-status-codes");

class AppError extends Error {
  constructor(
    message = "A server error occurred. Please try again later.",
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = AppError;
