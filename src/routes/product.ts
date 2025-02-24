import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getFilterProducts,
  getLatestProducts,
  getProductDetails,
  getProductsCategories,
  newProduct,
  updateProduct,
} from "../controllers/product";
import { adminOnly } from "../middlewares/auth";
import upload from "../middlewares/multer";

const app = express.Router();

// route - /api/v1/product/new
app.post("/new", upload.single("photo"), newProduct);

// route - /api/v1/product/latest
app.get("/latest", getLatestProducts);

// route - /api/v1/product/categories
app.get("/categories", getProductsCategories);

// route - /api/v1/product/all
app.get("/admin-products", adminOnly, getAdminProducts);

// route - /api/v1/product/filter?search=something
app.get("/filter", getFilterProducts);

// route - /api/v1/product/:id
app.route("/:id").get(getProductDetails).put(upload.single("photo"), updateProduct).delete(deleteProduct);

export default app;
