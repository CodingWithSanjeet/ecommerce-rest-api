const User = require("../models/User");
const { BadRequestError, AuthenticationError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { asyncWrapper, attachCookiesToResponse, createTokenUser } = require("../utils");

const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new BadRequestError("Name, Email and Password are required.");
  const isEmailAlreadyExist = await User.findOne({ email });
  if (isEmailAlreadyExist)
    throw new BadRequestError(
      "A user with this email address already exists. Please use a different email."
    );
  const userCount = await User.countDocuments({});
  const isFirstUser = userCount === 0;
  const role = isFirstUser ? "admin" : "user";
  const user = await User.create({ email, name, password, role });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "User created successfully.",
    data: {
      user: tokenUser,
    },
    timestamp: new Date().toISOString(),
  });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Bad Request: Email and password are required.");
  const user = await User.findOne({ email });
  if (!user)
    throw new AuthenticationError(
      "Authentication Failed: The email or password you entered is incorrect. Please try again."
    );
  if (!await user.comparePassword(password)) {
    throw new AuthenticationError(
      "Authentication Failed: The email or password you entered is incorrect. Please try again."
    );
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Logged in successfully.",
    data: {
      user: tokenUser,
    },
    timestamp: new Date().toISOString(),
  });
});

const logout = asyncWrapper(async (req, res) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "User logged out successfully.",
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  register,
  login,
  logout,
};
