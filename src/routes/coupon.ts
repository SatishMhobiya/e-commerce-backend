import express from "express";
import {
  deleteCoupon,
  getAllCoupons,
  getSingleCouponDetails,
  newCoupon,
  updateCoupon,
} from "../controllers/coupon";
import { adminOnly } from "../middlewares/auth";

const app = express.Router();

//route -> /api/v1/coupon/new
app.post("/new", adminOnly, newCoupon);

//route -> /api/v1/coupon/all
app.get("/all", adminOnly, getAllCoupons);

//route -> /api/v1/coupon/:id
app
  .route("/:id")
  .get(getSingleCouponDetails)
  .put(adminOnly, updateCoupon)
  .delete(adminOnly, deleteCoupon);

export default app;
