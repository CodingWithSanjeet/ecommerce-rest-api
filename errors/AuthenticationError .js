const { StatusCodes } = require("http-status-codes");
const AppError = require("./AppError");

class AuthenticationError extends AppError{
    constructor(message = "AuthenticationError: Please log in to access this resource.") {
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = "AuthenticationError";
    }
}

module.exports = AuthenticationError