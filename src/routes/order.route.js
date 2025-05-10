import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createOrder, getMyOrders } from "../controller/order.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createOrder);
router.route("/").get(verifyJWT, getMyOrders);

export default router;
