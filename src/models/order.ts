import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      pinCode: {
        type: Number,
        required: [true, "Pin code is required"],
      },
    },
    user: {
      type: String, //we are using string because we are storing the id of the user
      ref: "User",
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingCharges: {
      type: Number,
      required: true,
    },
    discount: { type: Number, default: 0 },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        photo: { type: String, required: true },
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", schema);

export default Order;
