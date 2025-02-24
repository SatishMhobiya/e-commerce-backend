import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import ErrorHandler from "../utils/utility-class";
import { stripe } from "../app";

export const createPaymentIntent = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    if (!amount) return next(new ErrorHandler("Amount is required", 400));

    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: amount * 100,
            currency: "inr"
        }
    )

    return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
    })
  }
);
