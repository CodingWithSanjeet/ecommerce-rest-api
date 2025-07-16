const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class UnauthorizedError extends AppError{
    constructor(message = "UnauthorizedError: You are not authorized to access this resource.") {
        super(message, StatusCodes.FORBIDDEN);
        this.name = "UnauthorizedError";
    }
}

module.exports = UnauthorizedError