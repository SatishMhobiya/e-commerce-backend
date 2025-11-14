import express from "express";
import {
  getAllReviewsOfProduct,
  deleteProduct,
  deleteReview,
  getAdminProducts,
  getProductsCategories,
  getFilterProducts,
  getProductDetails,
  getLatestProducts,
  newProduct,
  newReview,
  updateProduct,
} from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { multiUpload } from "../middlewares/multer.js";

const app = express.Router();

//To Create New Product  - /api/v1/product/new
app.post("/new", adminOnly, multiUpload, newProduct);

//To get all Products with filters  - /api/v1/product/all
app.get("/all", getFilterProducts);

//To get last 10 Products  - /api/v1/product/latest
app.get("/latest", getLatestProducts);

//To get all unique Categories  - /api/v1/product/categories
app.get("/categories", getProductsCategories);

//To get all Products   - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);

// To get, update, delete Product
app
  .route("/:id")
  .get(getProductDetails)
  .put(adminOnly, multiUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

app.get("/reviews/:id", getAllReviewsOfProduct);
app.post("/review/new/:id", newReview);
app.delete("/review/:id", deleteReview);

export default app;
