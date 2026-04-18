import express from "express";
import auth from "../middleware/auth.js";
import { createInvoice, getInvoices, updatePaymentStatus, sendInvoiceEmail, sendSalesReport } from "../controllers/invoice.controller.js";


const router = express.Router();

router.post("/create", auth, createInvoice);
router.get("/", auth, getInvoices);
router.patch("/:id/payment-status", auth, updatePaymentStatus);

router.post("/send-email", auth, sendInvoiceEmail);
router.post("/send-report", auth, sendSalesReport);


export default router;
