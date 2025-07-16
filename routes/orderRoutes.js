const express = require("express");
const {
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
} = require("../controller/orderController");
const {
  authUser,
  authorizePermissons,
} = require("../middleware/authentication");

const router = express.Router();

router
  .route("/")
  .get(authUser, authorizePermissons("admin"), getAllOrders)
  .post(authUser, createOrder);
router.route("/my-orders").get(authUser, getCurrentUserOrders);
router.route("/:id").get(authUser, getSingleOrder).patch(authUser, updateOrder);

module.exports = router;
