const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class BadRequestError extends AppError {
  constructor(
    message = "The request could not be understood or was missing required parameters."
  ) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}

module.exports = BadRequestError;
