import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error";
import { connectDB } from "./utils/features";
import Stripe from "stripe";
import cors from "cors";
import { v2 as cloudinary} from "cloudinary";

// Importing Routes
import userRoute from "./routes/user";
import productRoute from "./routes/product";
import orderRoute from "./routes/order";
import statsRoute from "./routes/stats";
import paymentRoute from "./routes/payment";

config({ path: "./.env" });

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

connectDB(MONGO_URI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();

export const stripe = new Stripe(STRIPE_SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/dashboard", statsRoute);
app.use("/api/v1/payment", paymentRoute);

// Error Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Express is working on ${PORT}`);
});
