import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter the product name"],
    },
    photos: [
      {
        public_id: {
          type: String,
          required: [true, "Please upload the product public id"],
        },
        url: {
          type: String,
          required: [true, "Please Add the product url"],
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Please enter the product price"],
    },
    category: {
      type: String,
      required: [true, "Please enter the product category"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter the product stock"],
    },
    description: {
      type: String,
      required: [true, "Please enter the product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfRatings: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", schema);

export default Product;
