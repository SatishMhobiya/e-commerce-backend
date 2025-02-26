import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user"; // Ensure .js extension is present
import { adminOnly } from "../middlewares/auth";
import myUploadMiddleware from "../middlewares/multer";
// import upload from "../middlewares/multer";

const app = express.Router();

// route - /api/v1/user/new
// app.post("/new",upload.single("photo"), newUser);
app.post("/new",myUploadMiddleware, newUser);

// route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers)

// route - /api/v1/user/:id
app.route("/:id").get(getUser).delete(adminOnly, deleteUser)

export default app;
