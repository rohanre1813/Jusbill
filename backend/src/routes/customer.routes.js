import express from "express";
import auth from "../middleware/auth.js";
import { addCustomer, getCustomers, updateCustomer, deleteCustomer } from "../controllers/customer.controller.js";


const router = express.Router();

router.post("/", auth, addCustomer);
router.get("/", auth, getCustomers);
router.put("/:id", auth, updateCustomer);
router.delete("/:id", auth, deleteCustomer);

export default router;
