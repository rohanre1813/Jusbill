import User from "../models/user.js";

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    if (req.files) {
      if (req.files.profileImage) updates.profileImage = req.files.profileImage[0].path;
      if (req.files.qrCode) updates.qrCode = req.files.qrCode[0].path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
