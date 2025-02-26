import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  photo: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

export type ShippingInfoType = {
  address: string,
  city: string,
  state: string,
  country: string,
  pinCode: number
}

export type OrderItemType = {
  name: string,
  price: number,
  quantity: number,
  photo: string,
  productId: string
}

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  total: number;
  user: string;
  orderItems: OrderItemType[];
}

export interface NewCouponRequestBody {
  code: string;
  amount: number;
}

export interface NewReviewRequestBody {
  comment: string;
  rating: number;
  user: string;
  product: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export interface ProductFilterRequestQuery {
  search ?: string;
  max_price ?: string;
  min_price ?: string;
  category ?: string;
  sort ?: string;
  page?: number;
}

export interface ProductFilterBaseQuery {
  name?: { $regex: string; $options: string };
  price?: { $gte: number; $lte: number };
  category?: string;
  sort?: string;
}

export interface InvalidateCacheProps {
  product ?: boolean;
  order ?: boolean;
  admin ?: boolean;
  productId ?: string[];
  userId ?: string;
  orderId ?: string;
}