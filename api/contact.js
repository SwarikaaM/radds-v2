import nodemailer from "nodemailer";
import { isRateLimited } from "./_rateLimit.js";

function sanitize(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "https://raddscapital.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (await isRateLimited(ip, { maxHits: 5, windowSec: 3600, prefix: "contact" })) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const { name, email, phone, subject, message, honeypot } = req.body || {};

  // Honeypot — silent reject (don't reveal to bots)
  if (honeypot) return res.status(200).json({ ok: true });

  const cleanName    = sanitize(name, 100);
  const cleanEmail   = sanitize(email, 100);
  const cleanPhone   = sanitize(phone, 20);
  const cleanSubject = sanitize(subject, 200);
  const cleanMessage = sanitize(message, 2000);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (cleanMessage.length < 10) {
    return res.status(400).json({ error: "Message is too short." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_HOST || "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: { user: process.env.ZOHO_USER, pass: process.env.ZOHO_PASS },
    });

    await transporter.sendMail({
      from: `"Radds Capital Website" <${process.env.ZOHO_USER}>`,
      to: "deven@raddscapital.com",
      replyTo: cleanEmail,
      subject: `[Contact] ${cleanSubject || "New Message"} — ${cleanName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#22568F;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:18px;">New Contact Form Submission</h2>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Radds Capital Website</p>
          </div>
          <div style="background:#F4F8FC;padding:24px;border-radius:0 0 8px 8px;border:1px solid #E2EBF5;border-top:none;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;">${cleanName}</td></tr>
              <tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
              ${cleanPhone ? `<tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Phone</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;">${cleanPhone}</td></tr>` : ""}
              ${cleanSubject ? `<tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Subject</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;">${cleanSubject}</td></tr>` : ""}
            </table>
            <hr style="border:none;border-top:1px solid #E2EBF5;margin:16px 0;" />
            <p style="color:#6B7E99;font-size:13px;margin:0 0 8px;">Message</p>
            <div style="background:#fff;border:1px solid #E2EBF5;border-radius:6px;padding:16px;color:#0D1B2E;font-size:14px;line-height:1.6;white-space:pre-wrap;">${cleanMessage}</div>
          </div>
        </div>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err.message);
    return res.status(500).json({ error: "Failed to send message. Please try again." });
  }
}
