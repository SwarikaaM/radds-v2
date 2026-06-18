/**
 * Rate limiter with two-tier fallback:
 * 1. Vercel KV (if configured) — persists across function instances
 * 2. In-memory Map (fallback for local dev or if KV not set up)
 *
 * Vercel KV setup: vercel.com → your project → Storage → Create KV Database → link it
 * That automatically adds KV_REST_API_URL + KV_REST_API_TOKEN to env vars. That's all.
 */

const memoryMap = new Map();

async function isRateLimited(ip, { maxHits = 5, windowSec = 3600, prefix = "rl" } = {}) {
  const key = `${prefix}:${ip}`;
  const now = Math.floor(Date.now() / 1000);

  // Try Vercel KV first
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const base = process.env.KV_REST_API_URL;
      const token = process.env.KV_REST_API_TOKEN;
      const headers = { Authorization: `Bearer ${token}` };

      // INCR key
      const incrRes = await fetch(`${base}/incr/${key}`, { method: "POST", headers });
      const { result: count } = await incrRes.json();

      // Set expiry on first hit
      if (count === 1) {
        await fetch(`${base}/expire/${key}/${windowSec}`, { method: "POST", headers });
      }

      return count > maxHits;
    } catch {
      // Fall through to memory fallback
    }
  }

  // Memory fallback
  const windowMs = windowSec * 1000;
  const hits = (memoryMap.get(key) || []).filter(t => now * 1000 - t < windowMs);
  if (hits.length >= maxHits) return true;
  memoryMap.set(key, [...hits, now * 1000]);
  return false;
}

export { isRateLimited };
