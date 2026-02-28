import express from "express";
import auth from "../middleware/auth.js";
import { chat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", auth, chat);

export default router;
