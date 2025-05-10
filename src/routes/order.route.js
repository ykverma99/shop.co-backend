import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderItemById,
} from "../controller/order.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createOrder);
router.route("/").get(verifyJWT, getMyOrders);
router.get("/:orderId", verifyJWT, getOrderById);
router.get("/order-items/:itemId", verifyJWT, getOrderItemById);

export default router;
