import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addOrUpdateCart,
  clearCart,
  getUserCart,
  removeItemFromCart,
} from "../controller/cart.controller.js";

const router = Router();

router.route("/").post(verifyJWT, addOrUpdateCart);
router.route("/").get(verifyJWT, getUserCart);
router.route("/:productId").post(verifyJWT, removeItemFromCart);
router.route("/").post(verifyJWT, clearCart);
