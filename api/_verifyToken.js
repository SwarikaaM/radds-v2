import { createHmac } from "crypto";

export function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expires = Number(payload);
  if (isNaN(expires) || Date.now() > expires) return false;
  const expected = createHmac("sha256", process.env.ADMIN_PASSWORD)
    .update(payload)
    .digest("hex");
  return sig === expected;
}
