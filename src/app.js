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
    credentials: true,
    origin: process.env.CLIENT_URI,
  })
);
app.use(cookieParser());

connectDB();

// import Routes
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";

// Acces Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

export default app;
