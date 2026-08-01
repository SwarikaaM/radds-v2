import { isRateLimited } from "./_rateLimit.js";
import { createHmac } from "crypto";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "https://raddscapital.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (await isRateLimited(ip, { maxHits: 3, windowSec: 3600, prefix: "admin-auth" })) {
    return res.status(429).json({ error: "Too many attempts. Try again in 1 hour." });
  }

  const { password } = req.body || {};
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  // Create a token: HMAC of timestamp, valid for 24h
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  const payload = String(expires);
  const sig = createHmac("sha256", process.env.ADMIN_PASSWORD)
    .update(payload)
    .digest("hex");
  const token = `${payload}.${sig}`;

  return res.status(200).json({ token });
}
