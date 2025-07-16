const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating between 1 and 5"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a title for your review"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment for your review"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log(productId, "Product ID");
  try {
    const result = await this.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: productId,
          numOfReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    const updatedProduct = await mongoose
      .model("product")
      .findOneAndUpdate(
        { _id: productId },
        {
          numOfReviews: result?.[0]?.numOfReviews || 0,
          averageRating: result?.[0]?.averageRating || 0,
        },
        { new: true }
      );
    console.log(updatedProduct,"Updated Product");
  } catch (error) {
    console.log(error);
  }
};
ReviewSchema.post("save", async function () {
  console.log("POST SAVE");
  this.constructor.calculateAverageRating(this.product);
});

/*
this.constructor inside query middleware like deleteOne is undefined because it is a query object, not a document.
this.constructor refers to the Query class, not Mongoose model.
so this.constructor.calculateAverageRating is undefined, causing the error:
    this.constructor.calculateAverageRating is not a function

Solution: 
Use Review model instead of this.constructor to access the static method.
e.g., this.model("review").calculateAverageRating(this.getQuery()["_id"])

*/
ReviewSchema.post("deleteOne",{document: true}, async function (deletedDoc, next) {
  console.log("POST DEL",deletedDoc);
  const Review = mongoose.model("review"); // Get model here
  await Review.calculateAverageRating(deletedDoc.product); //Call static method on model
});

// const Review = mongoose.model("review", ReviewSchema);
// module.exports = Review;
module.exports = mongoose.model("review", ReviewSchema);
