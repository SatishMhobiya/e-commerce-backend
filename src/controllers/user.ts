import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { NewUserRequestBody } from "../types/types";
import { TryCatch } from "../middlewares/error";
import ErrorHandler from "../utils/utility-class";
import { rm } from "fs";

// export const newUser = TryCatch(
//   async (
//     req: Request<{}, {}, NewUserRequestBody>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const { name, email, photo, gender, _id, dob } = req.body;

//     let user = await User.findById(_id);

//     if (user)
//       return res.status(200).json({
//         success: true,
//         message: `Welcome, ${user.name}`,
//       });

//     if (!_id || !name || !email || !photo || !gender || !dob)
//       return next(new ErrorHandler("Please add all fields", 400));

//     user = await User.create({
//       name,
//       email,
//       photo,
//       gender,
//       _id,
//       dob: new Date(dob),
//     });

//     return res.status(201).json({
//       success: true,
//       message: `Welcome, ${user.name}`,
//     });
//   }
// );

export const newUser = TryCatch(
    async(req: Request<{}, {}, NewUserRequestBody>, res: Response, next: NextFunction)=>{
        const { name, email, photo, gender, _id, dob } = req.body;
        let user = await User.findById(_id);
        if (user)
            return res.status(200).json({
              success: true,
              message: `Welcome, ${user.name}`,
            });
      
        if(!_id || !name || !email || !photo || !gender || !dob){
            return next(new ErrorHandler("Please enter all fields", 400))
        }
        user = await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob: new Date(dob)
        })
        return res.status(201).json({
          success: true,
          message: `Welcome, ${user.name}`,
        });
    }
)

export const getAllUsers = TryCatch(
    async(req: Request, res: Response, next: NextFunction) => {
        const quary = req.query;
        console.log(quary)
        const users = await User.find({}, {createdAt: 0, updatedAt: 0, __v: 0});
        return res.status(200).json({
          success: true,
          users,
        });
    }
)

export const getUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction)=>{
        console.log("errorCheck", req.params)
        const {id} = req.params;
        const user = await User.findById({_id: id}, {createdAt: 0, updatedAt: 0, __v: 0});
        if(!user) {
            return next(new ErrorHandler("User not found", 404))
        }
        return res.status(200).json({
          success: true,
          user,
        });
    }
)

export const deleteUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        const user = await User.findByIdAndDelete({_id: id});
        if(!user){
            return next(new ErrorHandler("User not found", 404))
        }
        return res.status(200).json({
          success: true,
          message: "User Deleted Successfully",
        });
    }
)