const asyncyWrapper = require("../utils/asyncWrapper");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermisstions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomString";
  return { client_secret, amount, currency };
};

const createOrder = asyncyWrapper(async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1)
    throw new BadRequestError(`BadRequestError: No cart items provided.`);
  if (!tax || !shippingFee)
    throw new BadRequestError(
      `BadRequestError: No tax or shipping fee provided`
    );
  let subtotal = 0;
  let orderItems = [];
  for (const item of cartItems) {
    const { name, price, image, amount, product } = item;
    const dbProduct = await Product.findById(product);
    if (!dbProduct)
      throw new NotFoundError(
        `NotFoundError: No product found with id : ${item.product}`
      );
    // const singleOrderItem ={
    //     name: item
    // }
    orderItems = [...orderItems, { name, price, image, amount, product }];
    // Calculating subtotal
    subtotal += amount * price;
  }
  //   calculating total
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: "usd" });
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Order created successfully",
    data: { order, clientSecret: paymentIntent.client_secret },
  });
});

const getAllOrders = asyncyWrapper(async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Orders fetched successfully",
    data: { orders, totalCount: orders.length },
    timestamp: new Date().toISOString(),
  });
});

const getSingleOrder = asyncyWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order)
    throw new NotFoundError(
      `NotFoundError: No order found with id: ${orderId}`
    );
  checkPermisstions(req.user, order.user);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Order fetched successfully",
    data: { order },
    timestamp: new Date().toISOString(),
  });
});

const getCurrentUserOrders = asyncyWrapper(async (req, res) => {
  const {
    user: { userId },
  } = req;
  console.log(userId, "ORDER ID");
  const orders = await Order.find({ user: userId });
  if (!orders)
    throw new NotFoundError(
      `NotFoundError: No order found for the current user.`
    );
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Order for current user fetched successfully",
    data: { orders, totalCount: orders.length },
    timestamp: new Date().toISOString(),
  });
});

const updateOrder = asyncyWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order)
    throw new NotFoundError(
      `NotFoundError: No order found with id: ${orderId}`
    );
  checkPermisstions(req.user, order.user);
  order.paymentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Order updated successfully.",
    data: { order },
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
