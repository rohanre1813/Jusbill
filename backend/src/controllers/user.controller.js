import User from "../models/user.js";
import { redis, getKey } from "../config/redis.js";

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    if (req.files) {
      if (req.files.profileImage) updates.profileImage = req.files.profileImage[0].path;
      if (req.files.qrCode) updates.qrCode = req.files.qrCode[0].path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // Invalidate the user cache so the auth middleware picks up fresh data
    try {
      await redis.del(getKey(`user:${req.user._id}`));
    } catch (redisError) {
      // Non-fatal
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  // req.user is already populated by auth middleware (from Redis or DB)
  // Just return it directly — no extra DB query needed
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
