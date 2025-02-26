import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import { NewOrderRequestBody } from "../types/types";
import ErrorHandler from "../utils/utility-class";
import Order from "../models/order";
import {
  invalidateCache,
  myCache,
  reduceProductStock,
} from "../utils/features";

export const newOrder = TryCatch(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      subtotal,
      tax,
      shippingCharges,
      total,
      user,
      orderItems,
    } = req.body;
    if (!shippingInfo || !subtotal || !tax || !total || !user || !orderItems) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    const order = await Order.create({
      shippingInfo,
      subtotal,
      tax,
      shippingCharges,
      total,
      user,
      orderItems,
    });
    reduceProductStock(orderItems);
    invalidateCache({ product: true, order: true, admin: true, productId: orderItems.map(item => String(item.productId)) });
    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);

export const getAllAdminOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let orders;
    const key = "admin-orders";
    if (myCache.has(key)) {
      orders = JSON.parse(myCache.get(key) as string);
    } else {
      orders = await Order.find().populate("user", "name");
      myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const getUserOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    if (!id) {
      return next(new ErrorHandler("User id is required", 400));
    }
    let orders = [];
    const key = `user-order-${id}`;

    if (myCache.has(key)) {
      orders = JSON.parse(myCache.get(key) as string);
    } else {
      orders = await Order.find({ user: id });
    }

    if (!orders) {
      return next(new ErrorHandler("No orders found", 404));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const getOrderDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Order id is required", 400));
    }

    let order;
    const key = `order-${id}`;
    if(myCache.has(key)){
     order = JSON.parse(myCache.get(key) as string);
       
    }else{
        order = await Order.findById(id).populate("user", "name");
        myCache.set(key, JSON.stringify(order));
    }

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  }
);

export const processOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Order id is required", 400));
    }
    const order = await Order.findById(id);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }
    await order.save();
    invalidateCache({
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });
    return res.status(200).json({
      success: true,
      message: "Order Processed Successfully",
    });
  }
);

export const deleteOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Order id is required", 400));
    }

    const order = await Order.findById(id);
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    await order.deleteOne();
    invalidateCache({
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
    });
    return res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
  }
);

// const updateOrder = TryCatch(
//     async(req: Request, res: Response, next: NextFunction) => {
//         const {id} = req.params;
//         if(!id){
//             return next(new ErrorHandler("Order id is required", 400))
//         }
//         const {shippingInfo, quantity, } = req.body
//     }
// )
