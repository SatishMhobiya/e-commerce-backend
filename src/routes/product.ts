import express from "express";
import {
  deleteProduct,
  deleteReview,
  getAdminProducts,
  getAllReviewsOfProduct,
  getFilterProducts,
  getLatestProducts,
  getProductDetails,
  getProductsCategories,
  newProduct,
  newReview,
  updateProduct,
} from "../controllers/product";
import { adminOnly } from "../middlewares/auth";
import myUploadMiddleware, { multiUpload } from "../middlewares/multer";
// import upload from "../middlewares/multer";

const app = express.Router();

// route - /api/v1/product/new
// app.post("/new", upload.single("photo"), newProduct);
app.post("/new", multiUpload, newProduct);

// route - /api/v1/product/latest
app.get("/latest", getLatestProducts);

// route - /api/v1/product/categories
app.get("/categories", getProductsCategories);

// route - /api/v1/product/all
app.get("/admin-products", adminOnly, getAdminProducts);

// route - /api/v1/product/filter?search=something
app.get("/all", getFilterProducts);

app.get("/review/new/:id", newReview);
app.get("/reviews/:id", getAllReviewsOfProduct)
app.delete("/review/:id", deleteReview);


// route - /api/v1/product/:id
app
  .route("/:id")
  .get(getProductDetails)
  .put(adminOnly, multiUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
