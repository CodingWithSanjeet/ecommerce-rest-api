const express = require("express");
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");
const {
  authorizePermissons,
  authUser,
} = require("../middleware/authentication");
const { getSingleProductReview } = require("../controller/reviewController");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post([authUser, authorizePermissons("admin")], createProduct);
router
  .route("/upload-image")
  .post([authUser, authorizePermissons("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authUser, authorizePermissons("admin")], updateProduct)
  .delete([authUser, authorizePermissons("admin")], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReview)

module.exports = router;
