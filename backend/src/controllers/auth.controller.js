import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../models/user.js";

const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  // Changed for EC2 testing: Browsers block 'secure: true' on plain HTTP IPs.
  // Revert back to 'secure: isProd' and 'sameSite: isProd ? "none" : "lax"' when using HTTPS/Render!
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
};

export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, companyName } = req.body;

    if (!name || !email || !password || !mobile || !companyName) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, password: hashed, mobile, companyName,
      shopId: nanoid(10) // Beautiful 10-character shopId
    });

    const token = jwt.sign(
      { id: user._id, shopId: user.shopId },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ msg: "Registration successful", user: { email: user.email, shopId: user.shopId } });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ msg: `${field} already exists` });
    }
    res.status(500).json({ msg: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, shopId: user.shopId },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ msg: "Login successful", user: { email: user.email, shopId: user.shopId } });
  } catch (error) {
    res.status(500).json({ msg: "Login failed", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    ...COOKIE_OPTIONS,
    maxAge: 0
  });
  res.json({ msg: "Logged out" });
};

export const verifyUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Not authorized" });
    // Prevent browser caching — a stale 304 with no CORS headers causes
    // cross-origin failures that silently log users out on reload
    res.setHeader("Cache-Control", "no-store, max-age=0");
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Verification failed", error: error.message });
  }
};
