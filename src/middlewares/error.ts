import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";
import { ControllerType } from "../types/types";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // ✅ Ensure function returns `void`
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
// Fix TypeScript issues by explicitly typing the returned function
export const TryCatch = (func: ControllerType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
