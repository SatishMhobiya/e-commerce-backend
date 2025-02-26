import express from "express";
import {
  getBarCharts,
  getDashboardStats,
  getLineChats,
  getPieCharts,
} from "../controllers/stats";
import { adminOnly } from "../middlewares/auth";

const app = express.Router();

app.get("/stats", adminOnly, getDashboardStats);
app.get("/pie", adminOnly, getPieCharts);
app.get("/bar", adminOnly, getBarCharts);
app.get("/line", adminOnly, getLineChats);

export default app;
