import { Router } from "express";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import {
  addProduct,
  filterProducts,
  getAdminProducts,
  getAllAndFilteredProduct,
  getSingleProduct,
} from "../controller/product.controller.js";

const router = Router();

router.route("/add-product").post(verifyJWT, isAdmin, addProduct);

router.route("/").get(getAllAndFilteredProduct);
router.get("/admin-products", verifyJWT, isAdmin, getAdminProducts);
router.route("/single").get(getSingleProduct);
router.get("/filter", filterProducts);

export default router;
