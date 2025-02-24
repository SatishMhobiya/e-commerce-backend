import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import Product from "../models/product";
import Order from "../models/order";
import { User } from "../models/user";
import {
  calculatePercentage,
  getChartData,
  getInventories,
} from "../utils/features";

export const getDashboardStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1)),
      end: today,
    };

    const lastMonth = {
      start: new Date(Date.UTC(today.getFullYear(), today.getMonth() - 1)),
      end: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 0)),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransactionPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .sort({ createdAt: -1 })
      .limit(4);

    const [
      thisMonthProducts,
      lastMonthProducts,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthUsers,
      lastMonthUsers,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      lastMonthProductsPromise,
      thisMonthOrdersPromise,
      lastMonthOrdersPromise,
      thisMonthUsersPromise,
      lastMonthUsersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (acc, order) => acc + order.total,
      0
    );

    let percentage = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      products: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      orders: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
      users: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
    };
    const totalRevenue = allOrders.reduce((acc, order) => acc + order.total, 0);
    const counts = {
      products: productsCount,
      orders: allOrders.length,
      users: usersCount,
      revenue: totalRevenue,
    };

    const orderMonthlyCounts = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = new Date(order.createdAt);
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff >= 0 && monthDiff < 6) {
        orderMonthlyCounts[monthDiff] += 1;
        orderMonthlyRevenue[monthDiff] += order.total;
      }
    });

    const categoryCount: Record<string, number>[] = await getInventories({
      categories,
      productsCount,
    });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    const modifiedLatestTransactions = latestTransactions.map((item) => ({
      _id: item.id,
      discount: item.discount,
      quantity: item.orderItems.length,
      amount: item.total,
    }));

    return res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        latestTransactions: modifiedLatestTransactions,
        userRatio,
        categories,
        categoryCount,
        chart: {
          order: orderMonthlyCounts,
          revenue: orderMonthlyRevenue,
        },
        stats: {
          percentage,
          counts,
        },
      },
    });
  }
);

export const getPieCharts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderProcessingPromise = Order.countDocuments({
      status: "Processing",
    });
    const orderShippedPromise = Order.countDocuments({ status: "Shipped" });
    const orderDeliveredPromise = Order.countDocuments({ status: "Delivered" });
    const allOrdersPromise = Order.find({}).select([
      "total",
      "discount",
      "tax",
      "subtotal",
      "shippingCharges",
    ]);

    const [
      orderProcessing,
      orderShipped,
      orderDelivered,
      categories,
      productsCount,
      productsOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      orderProcessingPromise,
      orderShippedPromise,
      orderDeliveredPromise,
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrdersPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const fullfillmentRatio = {
      processing: orderProcessing,
      shipped: orderShipped,
      delivered: orderDelivered,
    };

    const inventoryRatio: Record<string, number>[] = await getInventories({
      categories,
      productsCount,
    });

    const stockAvailability = {
      outOfStock: productsOutOfStock,
      inStock: productsCount - productsOutOfStock,
    };

    const totalRevenue = allOrders.reduce(
      (acc, order) => acc + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (acc, order) => acc + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (acc, order) => acc + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce((acc, order) => acc + (order.tax || 0), 0);
    const marketingCost = Math.round(totalRevenue * (30 / 100));
    const netMargin =
      totalRevenue - discount - productionCost - burnt - marketingCost;
    const revenueDistribution = {
      netMargin,
      totalRevenue,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const ageDistribution = {
      teen: allUsers.filter((user) => user.age <= 20).length,
      adult: allUsers.filter((user) => user.age > 20 && user.age <= 45).length,
      elder: allUsers.filter((user) => user.age > 45).length,
    };
    return res.status(200).json({
      success: true,
      message: "Pie charts fetched successfully",
      data: {
        allUsers,
        fullfillmentRatio,
        inventoryRatio,
        stockAvailability,
        revenueDistribution,
        ageDistribution,
        users: {
          admin: adminUsers,
          customer: customerUsers,
        },
      },
    });
  }
);

export const getBarCharts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tweleveMonthsAgo = new Date();
    tweleveMonthsAgo.setMonth(tweleveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: tweleveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    const charts = {
      product: productCounts,
      users: usersCounts,
      orders: ordersCounts,
    };
    return res.status(200).json({
      success: true,
      message: "Bar charts fetched successfully",
      data: { charts },
    });
  }
);

export const getLineChats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const tweleveMonthsAgo = new Date();
    tweleveMonthsAgo.setMonth(tweleveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: tweleveMonthsAgo,
        $lte: today,
      },
    };

    const tweleveMonthProductsPromise =
      Product.find(baseQuery).select("createdAt");

    const tweleveMonthUsersPromise = User.find(baseQuery).select("createdAt");

    const tweleveMonthOrdersPromise = Order.find(baseQuery).select([
      "createdAt",
      "total",
      "discount",
    ]);

    const [products, users, orders] = await Promise.all([
      tweleveMonthProductsPromise,
      tweleveMonthUsersPromise,
      tweleveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    const charts = {
      product: productCounts,
      users: usersCounts,
      discount,
      revenue,
    };

    return res.status(200).json({
      success: true,
      message: "Line charts fetched successfully",
      data: { charts },
    });
  }
);
