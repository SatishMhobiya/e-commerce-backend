import mongoose from "mongoose";

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon name is required"],
        unique: true,
    },
    amount:{
        type: Number,
        required: [true, "Coupon discount is required"]
    }
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", schema);

export default Coupon;