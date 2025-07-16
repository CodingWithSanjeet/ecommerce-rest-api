const { AuthenticationError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils");

const authUser = async (req, res, next) => {
  // Always access signed cookies using req.signedCookies, not req.cookies
  const token = req.signedCookies.token;
  if (!token)
    throw new AuthenticationError(
      "Authentication Failed: No authentication token provided"
    );
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new AuthenticationError(
      "Authentication Failed: Invalid or expired authentication token"
    );
  }
};

const authorizePermissons = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError(
        "Unauthorized Access: You do not have permission to access this resource"
      );
    next();
  };
};

module.exports = { authUser, authorizePermissons };
