// Lightweight in-memory cache for the browser session (no persistence).
const store = new Map();

// Returns cached data if present and not expired, otherwise undefined.
export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.data;
}

// Store data with an optional TTL (default 90 seconds).
export function setCached(key, data, ttlMs = 90_000) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// Remove a specific key from the cache.
export function invalidateCache(key) {
  store.delete(key);
}

// Remove all keys that start with the given prefix.
export function invalidatePrefix(prefix) {
  for (const k of store.keys()) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}
