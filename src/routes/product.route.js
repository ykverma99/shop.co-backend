import { Router } from "express";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import { addProduct } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/add-product")
  .post(verifyJWT, isAdmin, upload.array("productImages", 5), addProduct);

export default router;
