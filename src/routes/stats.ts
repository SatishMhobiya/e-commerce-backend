import express from "express";
import { getBarCharts, getDashboardStats, getLineChats, getPieCharts } from "../controllers/stats";

const app = express.Router();

app.get("/dashboard", getDashboardStats);
app.get("/pie", getPieCharts);
app.get("/bar", getBarCharts);
app.get("/line", getLineChats)

export default app;