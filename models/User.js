const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
    minlength: [3, "Name should have at least 3 characters."],
    maxlength: [50, "Name should not exceed 50 characters."],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email address."],
    validate: {
      validator: isEmail,
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: [6, "Password should have at least 6 characters."],
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message:
        'Role "{VALUE}" is invalid. Allowed roles are "admin" or "user".',
    },
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  // console.log("Pre Save Hook Called...");
  // console.log(this.modifiedPaths());
  // console.log(this.isModified("password"));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
