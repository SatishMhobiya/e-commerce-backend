import express from "express";
import {
  deleteOrder,
  getAllAdminOrders,
  getOrderDetails,
  getUserOrders,
  newOrder,
  processOrder,
} from "../controllers/order";
import { adminOnly } from "../middlewares/auth";

const app = express.Router();

//route -> /api/v1/order/new
app.post("/new", newOrder);

app.get("/my", getUserOrders);
//route -> /api/v1/order/all
app.get("/all", adminOnly, getAllAdminOrders);

//route -> /api/v1/order/:id
app
  .route("/:id")
  .get(getOrderDetails)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);
export default app;
