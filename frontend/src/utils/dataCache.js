/**
 * Lightweight in-memory stale-while-revalidate cache.
 * Lives for the browser session — no persistence.
 *
 * Usage:
 *   const stale = getCached('products');
 *   if (stale) setProducts(stale);   // show instantly
 *   const fresh = await getProducts();
 *   setProducts(fresh.data);
 *   setCached('products', fresh.data);
 */

const store = new Map();

/**
 * Returns cached data if present and not expired, otherwise undefined.
 */
export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.data;
}

/**
 * Store data with an optional TTL (default 90 seconds).
 */
export function setCached(key, data, ttlMs = 90_000) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Remove a specific key from the cache.
 */
export function invalidateCache(key) {
  store.delete(key);
}

/**
 * Remove all keys that start with the given prefix.
 * Useful for clearing a whole category (e.g. 'invoices').
 */
export function invalidatePrefix(prefix) {
  for (const k of store.keys()) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}
