// config dotenv
import { config } from "dotenv";
config({ path: "./.env" });

import express, { urlencoded } from "express";
import cors from "cors";
import connectDB from "./database/connectDB.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
  })
);
app.use(cookieParser());

connectDB();

// import Routes
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import addressRoute from "./routes/address.route.js";
import { ApiError } from "./utils/ApiError.js";

// Acces Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/address", addressRoute);

// To make the apiError in json formate
app.use((err, req, res, next) => {
  console.error("APi Error: ", err); // For debugging (optional)

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      data: err.data,
    });
  }

  // Fallback for unknown errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
  });
});

export default app;
