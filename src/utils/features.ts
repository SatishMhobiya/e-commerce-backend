import { NextFunction, Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import NodeCache from "node-cache";
import { InvalidateCacheProps, OrderItemsType } from "../types/types";
import Product from "../models/product";

export const myCache = new NodeCache();

export const connectDB = async (uri: string) => {
  try {
    const connection = await mongoose.connect(uri, {
      dbName: "e-backend",
    });
    console.log(`connect DB to ${connection.connection.host}`);
  } catch (error) {
    console.log("MongoDB Error", error);
  }
};

export const invalidateCache = ({
  product,
  order,
  admin,
  productId,
  orderId,
  userId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latestProducts",
      "productCategories",
      "adminProducts",
    ];
    if (productId) {
      productId.forEach((i) => productKeys.push(`product-${i}`));
    }

    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "admin-orders",
      `user-order-${userId}`,
      `order-${orderId}`,
    ];
    myCache.del(orderKeys);
  }
};

export const reduceProductStock = async (orderItems: OrderItemsType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (product) {
      product.stock -= order.quantity;
      await product.save();
    }
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percentage = (thisMonth / lastMonth) * 100;
  return Number(percentage.toFixed(2));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {

  const productCategoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category: category })
  );

  const productCategoriesCount = await Promise.all(
    productCategoriesCountPromise
  );

  let categoryCount: Record<string, number>[] = [];

  categories.forEach((category, index) => {
    categoryCount.push({
      [category]:
        Math.round((productCategoriesCount[index] / productsCount) * 100),
    });
  });
  
  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};
export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};
