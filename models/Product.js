const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      maxlengh: [100, "Name must be less than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlengh: [1000, "Product description must be less than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["office", "kitchen", "bedroom"],
        message: "{VALUE} is not a valid category",
      },
    },
    company: {
      type: String,
      required: [true, "Product company is required"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not a valid company",
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews:{
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true} }
);

ProductSchema.virtual('reviews',{
  ref: 'review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
})

ProductSchema.pre('findOneAndDelete', async function(next){
  const productId = this.getFilter()["_id"]
  // In query middleware like (e.g., pre('findOneAndDelete'), pre('deleteOne')),  this is the query object that will be executed not the actual document. this._id will be undefined
  // await mongoose.model('review').deleteMany({product: this._id});
  await mongoose.model('review').deleteMany({product: productId});
  next();
})

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
