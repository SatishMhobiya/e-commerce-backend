import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";
import { User } from "../models/user";

export const adminOnly = async(req: Request, res: Response, next: NextFunction) => {
    const {id} = req.query;
    if(!id){
        return next(new ErrorHandler("Please provide a valid admin id", 400))
    }
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }
    if(user.role !== "admin"){
        return next(new ErrorHandler("You are not authorized to access this resource", 403));
    }
    next();
}