const asyncWrapper = require("../utils/asyncWrapper");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../errors");
const {checkPermisstions} = require("../utils")

const createReview = asyncWrapper(async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct)
    throw new NotFoundError(
      `NotFoundError: No product found with id: ${productId}`
    );
  const isAlreadyReviewedByUser = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (isAlreadyReviewedByUser)
    throw new BadRequestError(
      "BadRequestError: You have already submitted a review for this product."
    );
  req.body.user = req.user.userId;
  const review = await Review.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Review submitted successfully.",
    data: {
      review,
    },
    timestamp: new Date().toISOString(),
  });
});
const getAllReviews = asyncWrapper(async (req, res) => {
  const reviews = await Review.find({}).populate('product','name price');
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Reviews fetched successfully.",
    data: {
      reviews,
      totalCount: reviews.length,
    },
    timestamp: new Date().toISOString(),
  });
});
const getSingleReview = asyncWrapper(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review)
    throw new NotFoundError(
      `NoFoundError: No review found with this id: ${reviewId}`
    );
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Review fetched successfully",
    data: { review },
    timestamp: new Date().toISOString(),
  });
  res.send("Get Single Review");
});
const updateReview = asyncWrapper(async (req, res) => {
    const {body:{title, comment, rating},params: {id: reviewId}, user} = req;
    const review = await Review.findById(reviewId);
    if(!review) throw new NotFoundError(`NotFoundError: Review not found with id: ${reviewId}`);
    checkPermisstions(user, review.user);
    title && (review.title = title);
    comment && (review.comment = comment);
    rating && (review.rating = rating)
    const result = await review.save()
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Review updated successfully.',
        data: { review: result},
        timestamp: new Date().toISOString()
    })
});
const deleteReview = asyncWrapper(async (req, res) => {
  const {
    user,
    params: { id: reviewId },
  } = req;
  const review = await Review.findById(reviewId);
  if(!review) throw new NotFoundError(`NotFoundError: Review not found with id: ${reviewId}`);
  checkPermisstions(user, review.user)
  await review.deleteOne()
  res.json({
    status: "success",
    message: "Review deleted successfully.",
    timestamp: new Date().toISOString(),
    data: {
      
    },
  });
});

const getSingleProductReview = asyncWrapper(async (req, res) =>{
    const {id: productId} = req.params;
    const reviews = await Review.find({product: productId});
    if(!reviews) throw new NotFoundError(`NotFoundError: No product found with id: ${productId}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Product reviews fetched successfully.',
        data: { reviews, totalCount: reviews.length},
        timestamp: new Date().toISOString()
    })
})

module.exports = {
  createReview,
  getAllReviews,
  getSingleProductReview,
  getSingleReview,
  updateReview,
  deleteReview,
};
