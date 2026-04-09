import { redis, getKey } from '../config/redis.js';

/**
 * Clear cache keys matching a prefix.
 * Uses redis.keys() only as a fallback. For well-known patterns we delete
 * specific keys directly to avoid the O(N) keyspace scan on Upstash REST.
 *
 * Convention: all keys are stored as `prefix:qualifier`
 * e.g. invoices:shopId:all  |  products:shopId:searchTerm
 */
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

/**
 * Fast targeted delete — remove specific well-known cache keys without a scan.
 * Use this when you know the exact keys that need to be evicted.
 * Deletes up to 3 keys in a single redis.del() call.
 */
export const deleteCacheKeys = async (...keys) => {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) return;
    const fullKeys = keys.map(k => getKey(k));
    if (fullKeys.length > 0) await redis.del(...fullKeys);
  } catch (error) {
    // Non-fatal
  }
};
