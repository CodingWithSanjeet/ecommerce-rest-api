const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { asyncWrapper, createTokenUser, attachCookiesToResponse, checkPermisstions } = require("../utils");
const {
  NotFoundError,
  BadRequestError,
  AuthenticationError,
} = require("../errors");

const getAllUsers = asyncWrapper(async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "All users fetched successfully.",
    data: { users, totalCount: users.length },
    timestamp: new Date().toISOString(),
  });
});
const getSingleUser = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id, role: "user" }).select(
    "-password"
  );
  if (!user) throw new NotFoundError(`No user found with ${id}`);
  checkPermisstions(req.user, user._id);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User fetched successfully",
    data: { user },
    timestamp: new Date().toISOString(),
  });
});
const showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Current user fetched successfully",
    data: { user: req.user },
    timestamp: new Date().toISOString(),
  });
};
const updateUser = asyncWrapper(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    throw new BadRequestError("Bad Request: Email and Name are required.");
  const user = await User.findById(req.user.userId);
  if (!user) throw new NotFoundError("Not Found: No user found.");
  user.email = email;
  user.name = name;
  console.log("USER: ",user);
  await user.save()
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User updated successfully",
    data: { user: tokenUser },
    timestamp: new Date().toISOString(),
  });
});
const updateUserPassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new BadRequestError(
      "Bad Request: Both old password and new password are required."
    );
  const user = await User.findById(req.user.userId);
  if (!user) throw new NotFoundError("Not Found: User not found.");
  const isCorrectPassword = await user.comparePassword(oldPassword);
  if (!isCorrectPassword)
    throw new AuthenticationError(
      "Authentication Failed: Invalid credentials."
    );
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Password updated successfully",
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// update user using User.findOneAndUpdate()

// const updateUser = asyncWrapper(async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email)
//     throw new BadRequestError("Bad Request: Email and Name are required.");
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   if (!user) throw new NotFoundError("Not Found: No user found.");
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({
//     status: "success",
//     message: "User updated successfully",
//     data: { user: tokenUser },
//     timestamp: new Date().toISOString(),
//   });
// });