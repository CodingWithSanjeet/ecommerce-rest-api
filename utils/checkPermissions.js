const { UnauthorizedError } = require("../errors");

const checkPermisstions = (loggedInUser, requestedUserId) => {
//   console.log(requestedUserId,typeof requestedUserId)
  if (loggedInUser.role === "admin") return true;
  if (loggedInUser.userId === requestedUserId.toString()) return true;
  throw new UnauthorizedError("Unauthorized Access: You do not have permission to access this resource.")
};

module.exports = checkPermisstions;