import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addUserAddress } from "../controller/address.controller.js";

const router = Router();

router.route("/add-address").post(verifyJWT, addUserAddress);

export default router;
