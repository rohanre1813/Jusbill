import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { redis, getKey } from "../config/redis.js";

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cacheKey = getKey(`user:${decoded.id}`);

    let user = null;

    // 1. Try Redis first — skip the DB entirely on warm requests
    try {
      user = await redis.get(cacheKey);
    } catch (redisError) {
      // Redis unavailable — fall through to DB
    }

    // 2. Cache miss — hit MongoDB and populate the cache
    if (!user) {
      user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ msg: "User not found" });
      try {
        await redis.set(cacheKey, user, { ex: 300 }); // 5-min TTL
      } catch (redisError) {
        // Cache write failure is non-fatal
      }
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
