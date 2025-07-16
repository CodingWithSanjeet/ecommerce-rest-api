const { asyncWrapper } = require("../utils");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError, AppError } = require("../errors");
const path = require("path");

const createProduct = asyncWrapper(async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Product created successfully.",
    data: { product },
    timestamp: new Date().toISOString(),
  });
});
const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find({}).populate('reviews','rating title comment -product');
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Products fetched successfully.",
    data: { products, totalCount: products.length },
    timestamp: new Date().toISOString(),
  });
});
const getSingleProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');
  if (!product)
    throw new NotFoundError(
      `Not Found: No product found with the ID :  ${req.params.id}`
    );
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Product fetched successfully.",
    data: { product },
    timestamp: new Date().toISOString(),
  });
});
const updateProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!product)
    throw new NotFoundError(`Not Found: No product found with ID ${productId}`);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Product updated successfully.",
    data: { product },
    timestamp: new Date().toISOString(),
  });
});
const deleteProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product)
    throw new NotFoundError(
      `NotFoundError: No product with ID ${productId} found.`
    );
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Product deleted successfully.",
    data: {},
    timestamp: new Date().toISOString(),
  });
});
const uploadImage = asyncWrapper(async (req, res) => {
  if (!req.files)
    throw new BadRequestError("No file uploaded. Please upload an image.");
  const productImage = req.files.productImage;
  if (!productImage?.mimetype?.startsWith("image"))
    throw new BadRequestError(
      `BadRequestError: File type ${productImage?.mimetype} not supported. Please upload a valid image. (e.g., jpg, jpeg, gif)`
    );
  const maxFileSize = 1024 * 1024; //1MB
  console.log(productImage, "imgFIle");
  if (productImage.size > maxFileSize)
    throw new BadRequestError(
      "File size is too large. Please upload an image lesser than 1MB"
    );
  const uploadPath = path.join(__dirname, "../public/uploads", productImage.name);
  await productImage.mv(uploadPath, (err) => {
    if (err) throw new AppError(err.message);
  });
  res.json({
    status: "success",
    message: "File uploaded successfully.",
    data: {
      image: `/uploads/${productImage.name}`,
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
