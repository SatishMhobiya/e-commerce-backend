import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "please enter the product name"]
    },
    photo: {
        type: String,
        required: [true, "Please upload the product photo"]
    },
    price: {
        type: Number,
        required: [true, "Please enter the product price"]
    },
    category: {
        type: String,
        required: [true, "Please enter the product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter the product stock"],
    }
}, {
    timestamps: true
})

const Product = mongoose.model("Product", schema);

export default Product;