const mongoose = require("mongoose");

const OrderItem = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: { type: mongoose.Types.ObjectId, ref: "product", required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: {
      type: [OrderItem],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "failed", "paid", "delivered", "canceled"],
        message: `{VALUE} is not supported`,
      },
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);
