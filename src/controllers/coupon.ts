import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import { NewCouponRequestBody } from "../types/types";
import ErrorHandler from "../utils/utility-class";
import Coupon from "../models/coupon";

export const newCoupon = TryCatch(
  async (
    req: Request<{}, {}, NewCouponRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { code, amount } = req.body;
    if (!code || !amount) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }
    const createdCoupon = await Coupon.create({ code, amount });
    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: createdCoupon,
    });
  }
);

export const getAllCoupons = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupons = await Coupon.find();
    return res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
    });
  }
);

export const getSingleCouponDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Please provide coupon id", 400));
    }
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return next(new ErrorHandler("Coupon not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: coupon,
    });
  }
);

export const updateCoupon = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Please provide coupon id", 400));
    }
    const { code, amount } = req.body;
    if (!code && !amount) {
      return next(new ErrorHandler("Please provide coupon or amount", 400));
    }
    const couponObj = await Coupon.findById(id);
    if (!couponObj) {
      return next(new ErrorHandler("Coupon not found", 404));
    }
    if (code) {
      couponObj.code = code;
    }
    if (amount) {
      couponObj.amount = amount;
    }
    const updatedCoupon = await couponObj.save();
    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  }
);

export const deleteCoupon = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Please provide coupon id", 400));
    }
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return next(new ErrorHandler("Coupon not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: coupon,
    });
  }
);
