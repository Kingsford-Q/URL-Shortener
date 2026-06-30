/**
 * Minimal in-memory TTL cache for the MVP. Swap this module's internals for a
 * Redis client (e.g. ioredis) without changing call sites if/when the app
 * scales past a single process.
 */
const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

function set(key, value, ttlMs = 60_000) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function del(key) {
  store.delete(key);
}

function clear() {
  store.clear();
}

module.exports = { get, set, del, clear };
