import { Router } from "express";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import {
  addProduct,
  filterProducts,
  getAdminProducts,
  getAllProduct,
  getSingleProduct,
} from "../controller/product.controller.js";

const router = Router();

router.route("/add-product").post(verifyJWT, isAdmin, addProduct);

router.route("/products").get(getAllProduct);
router.get("/admin-products", verifyJWT, isAdmin, getAdminProducts);
router.route("/product").get(getSingleProduct);
router.get("/filter", filterProducts);

export default router;
