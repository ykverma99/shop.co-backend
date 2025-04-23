import { Router } from "express";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import {
  addProduct,
  getAllProduct,
  getSingleprodcut,
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/add-product")
  .post(verifyJWT, isAdmin, upload.array("productImages", 5), addProduct);

router.route("/products").get(getAllProduct);
router.route("/product").get(getSingleprodcut);

export default router;
