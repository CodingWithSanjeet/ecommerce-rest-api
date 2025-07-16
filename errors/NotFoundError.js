const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class NotFoundError extends AppError {
  constructor(message = "The requested resource could not be found.") {
    super(message, StatusCodes.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

module.exports = NotFoundError;
