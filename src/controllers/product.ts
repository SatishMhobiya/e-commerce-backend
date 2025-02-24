import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import {
  NewProductRequestBody,
  ProductFilterBaseQuery,
  ProductFilterRequestQuery,
} from "../types/types";
import ErrorHandler from "../utils/utility-class";
import Product from "../models/product";
import { rm } from "fs";
import { invalidateCache, myCache } from "../utils/features";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    if (!photo) {
      return next(new ErrorHandler("Please add product photo", 400));
    }
    if (!name || !photo || !price || !category || !stock) {
      rm(photo.path, () => console.log("Photo deleted"));
      return next(new ErrorHandler("Please add all fields for product", 400));
    }

    const product = await Product.create({
      name,
      photo: photo.path,
      price,
      category,
      stock,
    });
    invalidateCache({ product: true });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  }
);

export const getLatestProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products;
    if (myCache.has("latestProducts")) {
      products = myCache.get("latestProducts");
    } else {
      products = await Product.find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
        .sort({ createdAt: -1 })
        .limit(5);
      myCache.set("latestProducts", products);
    }

    return res.status(200).json({
      success: true,
      message: "Latest Products",
      data: products,
    });
  }
);

export const getProductsCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let productCategories;
    if (myCache.has("productCategories")) {
      productCategories = myCache.get("productCategories" as string);
    } else {
      productCategories = await Product.distinct("category");
      myCache.set("productCategories", productCategories);
    }

    return res.status(200).json({
      success: true,
      message: "Product Categories",
      data: productCategories,
    });
  }
);

export const deleteProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Please provide the product id", 400));
    }
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 400));
    }
    await product.deleteOne();
    rm(product.photo, () => console.log("Product photo deleted"));
    invalidateCache({ product: true });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  }
);

//Revalidate myCache on New, update, delete product
export const getAdminProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products;
    if (myCache.has("adminProducts")) {
      products = myCache.get("adminProducts");
    } else {
      products = await Product.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
      myCache.set("adminProducts", products);
    }

    return res.status(200).json({
      success: true,
      message: "All Products",
      data: products,
    });
  }
);

export const getProductDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler("Please provide the product id", 400));
    }

    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    
    return res.status(200).json({
      success: true,
      message: "Product found",
      data: product,
    });
  }
);

export const updateProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Please provide the product id", 400));
    }

    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    const photo = req.file;
    if (photo) {
      rm(product.photo, () => console.log("Old photo deleted"));
      product.photo = photo.path;
    }

    const { name, price, category, stock } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    const updatedProduct = await product.save();
    invalidateCache({ product: true });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
);

export const getFilterProducts = TryCatch(
  async (
    req: Request<{}, {}, {}, ProductFilterRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { search, max_price, category, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const min_price = Number(req.query.min_price) || 0;

    const baseQuery: ProductFilterBaseQuery = {};

    const limit = Number(process.env.PRODUCTS_PER_PAGE) || 2;
    const skip = (page - 1) * limit;

    if (search) baseQuery.name = { $regex: search, $options: "i" };

    if (min_price > 0 && max_price) {
      baseQuery.price = { $gte: Number(min_price), $lte: Number(max_price) };
    } else if (min_price) {
      baseQuery.price = {
        $gte: Number(min_price),
        $lte: Number.MAX_SAFE_INTEGER,
      };
    } else if (max_price) {
      baseQuery.price = { $gte: 0, $lte: Number(max_price) };
    }

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const totalProductsPromise = Product.countDocuments(baseQuery);

    const [products, totalProducts] = await Promise.all([
      productsPromise,
      totalProductsPromise,
    ]);

    return res.status(200).json({
      success: true,
      message: "Searched Products",
      data: products,
      meta: {
        total_pages: Math.ceil(totalProducts / limit),
        current_page: page,
        total_data: totalProducts,
      },
    });
  }
);
