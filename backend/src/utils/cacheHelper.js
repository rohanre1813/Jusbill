import { redis, getKey } from "../config/redis.js";

/**
 * Fetches data from Redis cache if available, otherwise executes the fetchCallback
 * and caches the result for the specified ttl (time to live in seconds).
 * 
 * @param {string} rawKey - The cache key before applying the project prefix.
 * @param {number} ttl - Time to live in seconds.
 * @param {Function} fetchCallback - Async function returning the data if cache misses.
 * @returns {Promise<any>} The cached or freshly fetched data.
 */
export const fetchWithCache = async (rawKey, ttl, fetchCallback) => {
  const cacheKey = getKey(rawKey);

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Redis Cache Hit: ${rawKey.split(':')[0]}`);
      return cached;
    }
  } catch (error) {
    console.error(`Redis Get Error (${rawKey}):`, error.message);
  }

  const data = await fetchCallback();

  try {
    await redis.set(cacheKey, data, { ex: ttl });
    console.log(`Redis Cache Miss: ${rawKey.split(':')[0]}. Cached result.`);
  } catch (error) {
    console.error(`Redis Set Error (${rawKey}):`, error.message);
  }

  return data;
};
