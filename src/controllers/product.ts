import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import {
  NewProductRequestBody,
  ProductFilterBaseQuery,
  ProductFilterRequestQuery,
} from "../types/types";
import ErrorHandler from "../utils/utility-class";
import Product from "../models/product";
import {
  deleteFromCloudinary,
  findAverageRating,
  invalidateCache,
  myCache,
  uploadToCloudinary,
} from "../utils/features";
import { User } from "../models/user";
import { Review } from "../models/review";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, category, stock, description } = req.body;

    const photos = req.files as Express.Multer.File[] | undefined;

    if (!photos) {
      return next(new ErrorHandler("Please add product photo", 400));
    }

    if (photos.length < 1) {
      return next(new ErrorHandler("Please add atleaset one photo", 400));
    }

    if (photos.length > 5) {
      return next(new ErrorHandler("ypu can only upload 5 photos", 400));
    }
    if (!name || !photos || !price || !category || !stock || !description) {
      return next(new ErrorHandler("Please add all fields for product", 400));
    }

    const photoURL = await uploadToCloudinary(photos);

    await Product.create({
      name,
      photos: photoURL,
      price,
      category,
      stock,
      description,
    });
    invalidateCache({ product: true });
    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      photoURL,
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
      products,
    });
  }
);

export const getProductsCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let categories;
    if (myCache.has("categories")) {
      categories = myCache.get("categories" as string);
    } else {
      categories = await Product.distinct("category");
      myCache.set("categories", categories);
    }

    return res.status(200).json({
      success: true,
      categories,
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
    const ids = product.photos.map((i) => i.public_id);
    await deleteFromCloudinary(ids);
    await product.deleteOne();
    // rm(product.photo, () => console.log("Product photo deleted"));
    invalidateCache({ product: true });

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
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
      products,
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
      product,
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
    // if (photo) {
    //   rm(product.photo, () => console.log("Old photo deleted"));
    //   product.photo = photo.path;
    // }

    const photos = req.files as Express.Multer.File[] | undefined;

    if (photos && photos.length > 0) {
      const photosURL = await uploadToCloudinary(photos);
      const ids = product.photos.map((i) => i.public_id);
      const deleteResult = await deleteFromCloudinary(ids); //remove old photos
      product.set("photos", photosURL);
      // product.photos = photosURL;

      // return next(new ErrorHandler("Please add atleaset one photo", 400));
    }
    const { name, price, category, stock, description } = req.body;
    if (!name && !price && !category && !stock && !photos && !description) {
      return next(
        new ErrorHandler("Please add atleast one thing to update", 400)
      );
    }
    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (description) product.description = description;

    await product.save();
    invalidateCache({ product: true });
    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
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
      products,
      totalPage: Math.ceil(totalProducts / limit),
    });
  }
);

export const newReview = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const { id } = req.query;
    if (!id) {
      return next(new ErrorHandler("Not Logged in", 400));
    }
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    const { rating, comment } = req.body;
    const isAlreadyReviewed = await Review.findOne({
      user: user._id,
      product: product._id,
    });
    if (isAlreadyReviewed) {
      isAlreadyReviewed.rating = rating;
      isAlreadyReviewed.comment = comment;
      await isAlreadyReviewed.save();
    } else {
      await Review.create({
        user: user._id,
        product: product._id,
        rating,
        comment,
      });
    }
    const { averageRating, numOfReviews } = await findAverageRating(
      product._id
    );
    product.ratings = averageRating;
    product.numOfRatings = numOfReviews;
    await product.save();

    return res.status(isAlreadyReviewed ? 200 : 201).json({
      success: true,
      message: isAlreadyReviewed
        ? "Review updated successfully"
        : "Review added successfully",
    });
  }
);

export const deleteReview = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id;
    const { id } = req.query;
    if (!id) {
      return next(new ErrorHandler("Not Logged in", 400));
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isAuthenticate =
      review.user.toString() === id || user.role === "admin";

    if (!isAuthenticate) {
      return next(new ErrorHandler("Not Authorized", 403));
    }
    await review.deleteOne();
    const product = await Product.findById(review.product);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    const { averageRating, numOfReviews } = await findAverageRating(
      product._id
    );
    product.ratings = averageRating;
    product.numOfRatings = numOfReviews;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  }
);

export const getAllReviewsOfProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId });
    return res.status(200).json({
      success: true,
      reviews,
    });
  }
);
