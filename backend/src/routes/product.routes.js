import express from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, getProduct, getTopSellingProducts, getPublicProducts } from "../controllers/product.controller.js";
import auth from "../middleware/auth.js";


const router = express.Router();

// Public route (no auth)
router.get("/public/:shopId", getPublicProducts);

router.use(auth);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
