import express from "express";
import {
  addColor,
  getAllColors,
  addSize,
  getAllSizes,
  addStyle,
  getAllStyles,
  getAllOptions,
} from "../controller/filters.controller.js";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Color Routes
router.post(
  "/color",
  verifyJWT,
  isAdmin,
  upload.array("productImages", 5),
  addColor
);
router.get("/color", getAllColors);

// Size Routes
router.post("/size", verifyJWT, isAdmin, addSize);
router.get("/size", getAllSizes);

// Style Routes
router.post("/style", verifyJWT, isAdmin, addStyle);
router.get("/style", getAllStyles);
router.get("/all-options", getAllOptions);

export default router;
