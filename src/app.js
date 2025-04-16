import express, { urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./database/connectDB.js";

const app = express();

config({ path: "./.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URI,
  })
);

connectDB();

// import Routes
import userRoute from "./routes/user.route.js";

// Acces Routes
app.use("/api/v1/user", userRoute);

export default app;
