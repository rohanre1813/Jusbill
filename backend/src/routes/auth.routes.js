import express from "express";
import { register, login, logout, verifyUser } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, verifyUser);

export default router;
