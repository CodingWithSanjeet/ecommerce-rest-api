const express = require("express");

const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");
const { authUser } = require("../middleware/authentication");

router.route("/").post(authUser, createReview).get(getAllReviews);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authUser, updateReview)
  .delete(authUser, deleteReview);

module.exports = router;
