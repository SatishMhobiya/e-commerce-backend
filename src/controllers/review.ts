import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import { NewReviewRequestBody } from "../types/types";
import Product from "../models/product";
import { Review } from "../models/review";
import { User } from "../models/user";
import ErrorHandler from "../utils/utility-class";

export const newReview = TryCatch(
    async(req: Request<{}, {}, NewReviewRequestBody>, res: Response, next: NextFunction) =>{
        const {comment, rating, user, product} = req.body;

        if(!comment || !rating || !user || !product) {
            return next(new ErrorHandler("Please fill all the fields", 400))
        }
        console.log("payload", {comment, rating, user, product})
        const fetchedUser = await User.findById(user);
        if(!fetchedUser) {
            return next(new ErrorHandler("User not found", 400))
        }
        const fetchedProduct = await Product.findById(product)
        console.log("fetchedProduct", fetchedProduct)
        if(!fetchedProduct) {
            return next(new ErrorHandler("Product not found", 400))
        }
        const review = await Review.create({
            comment,
            rating,
            user,
            product
        })
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review,
            fetchedProduct
        })
    }
)

export const updateReview = TryCatch(
    async(req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        const {comment, rating} = req.body;
        if(!comment && !rating) {
            return next(new ErrorHandler("Please fill atleast one thing to update", 400))
        }
        const review = await Review.findById(id);
        if(!review){
            return next(new ErrorHandler("Review not found", 400))
        }
        if(comment){
            review.comment = comment;
        }
        if(rating){
            review.rating = rating;
        }
        await review.save();
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
        })
    }
)

export const deleteReview = TryCatch(
    async(req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        const review = await Review.findByIdAndDelete(id);
        if(!review){
            return next(new ErrorHandler("Review not found", 400))
        }
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        })
    }
)
