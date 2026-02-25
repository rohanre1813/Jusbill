import express from "express";
import { updateProfile, getProfile } from "../controllers/user.controller.js";
import { upload } from "../config/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put(
  "/profile",
  authMiddleware,
  (req, res, next) => {
    upload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "qrCode", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) return res.status(500).json({ message: "Image upload failed", error: err.message });
      next();
    });
  },
  updateProfile
);

export default router;
