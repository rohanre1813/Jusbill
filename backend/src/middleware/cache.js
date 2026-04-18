import { redis, getKey } from '../config/redis.js';

// Clear all Redis cache keys matching a given prefix.
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

// Delete specific cache keys without a pattern scan.
export const deleteCacheKeys = async (...keys) => {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    const fullKeys = keys.map(k => getKey(k));
    if (fullKeys.length > 0) await redis.del(...fullKeys);
  } catch {
    // Non-fatal
  }
};
