import express from "express";
import { createPurchase, getPurchases, deletePurchase, sendPurchaseReport } from "../controllers/purchase.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);
router.post("/", createPurchase);
router.get("/", getPurchases);
router.delete("/:id", deletePurchase);
router.post("/send-report", sendPurchaseReport);


export default router;
