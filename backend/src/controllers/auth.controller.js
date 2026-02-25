import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";

const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
};

export const register = async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    ...req.body,
    password: hashed,
    shopId: crypto.randomUUID()
  });

  const token = jwt.sign(
    { id: user._id, shopId: user.shopId },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);

  res.json({ msg: "Registration successful", user: { email: user.email, shopId: user.shopId } });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json("Invalid credentials");

  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.status(400).json("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, shopId: user.shopId },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);

  res.json({ msg: "Login successful", user: { email: user.email, shopId: user.shopId } });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    ...COOKIE_OPTIONS,
    maxAge: 0
  });
  res.json({ msg: "Logged out" });
};

export const verifyUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ msg: "Not authorized" });
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
