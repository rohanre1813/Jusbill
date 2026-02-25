import { redis, getKey } from '../config/redis.js';

export const clearCache = async (pattern) => {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    const fullPattern = getKey(`${pattern}*`);
    const keys = await redis.keys(fullPattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (error) {
    console.error("Clear Cache Error:", error);
  }
};
