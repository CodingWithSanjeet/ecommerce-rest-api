const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controller/userController");
const { authUser, authorizePermissons } = require("../middleware/authentication");

const router = express.Router();

router.route("/").get(authUser, authorizePermissons("admin"), getAllUsers);
router.route("/showMe").get(authUser, showCurrentUser);
router.route("/updateUser").patch(authUser, updateUser);
router.route("/updateUserPassword").patch(authUser, updateUserPassword);
router.route("/:id").get(authUser, authorizePermissons("admin","user"), getSingleUser);

module.exports = router;
