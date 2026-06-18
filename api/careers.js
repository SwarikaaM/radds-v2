import nodemailer from "nodemailer";
import { IncomingForm } from "formidable";
import { readFileSync } from "fs";
import { isRateLimited } from "./_rateLimit.js";

export const config = { api: { bodyParser: false } };

function sanitize(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "https://raddscapital.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (await isRateLimited(ip, { maxHits: 3, windowSec: 3600, prefix: "careers" })) {
    return res.status(429).json({ error: "Too many applications. Please try again later." });
  }

  const form = new IncomingForm({ maxFileSize: MAX_SIZE_BYTES, keepExtensions: true });

  let fields, files;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fl) => (err ? reject(err) : resolve([f, fl])));
    });
  } catch {
    return res.status(400).json({ error: "File too large or invalid form. Max 5MB." });
  }

  const getField = (k) => (Array.isArray(fields[k]) ? fields[k][0] : fields[k] || "");

  if (getField("honeypot")) return res.status(200).json({ ok: true });

  const cleanName     = sanitize(getField("name"), 100);
  const cleanEmail    = sanitize(getField("email"), 100);
  const cleanPhone    = sanitize(getField("phone"), 20);
  const cleanPosition = sanitize(getField("position"), 200);
  const cleanExp      = sanitize(getField("experience"), 50);
  const cleanLinkedin = sanitize(getField("linkedin"), 200);
  const cleanMessage  = sanitize(getField("message"), 2000);

  if (!cleanName || !cleanEmail || !cleanPosition) {
    return res.status(400).json({ error: "Name, email and position are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const resumeFile = files.resume
    ? Array.isArray(files.resume) ? files.resume[0] : files.resume
    : null;
  let attachments = [];

  if (resumeFile) {
    if (!ALLOWED_MIME.includes(resumeFile.mimetype)) {
      return res.status(400).json({ error: "Resume must be PDF or Word (.pdf, .doc, .docx)." });
    }
    try {
      attachments = [{
        filename: resumeFile.originalFilename || `resume_${cleanName}.pdf`,
        content: readFileSync(resumeFile.filepath),
        contentType: resumeFile.mimetype,
      }];
    } catch {
      return res.status(500).json({ error: "Failed to read resume file." });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_HOST || "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: { user: process.env.ZOHO_USER, pass: process.env.ZOHO_PASS },
    });

    await transporter.sendMail({
      from: `"Radds Capital Careers" <${process.env.ZOHO_USER}>`,
      to: "deven@raddscapital.com",
      replyTo: cleanEmail,
      subject: `[Career] ${cleanPosition} — ${cleanName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#22568F;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:18px;">New Career Application</h2>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Radds Capital — Careers</p>
          </div>
          <div style="background:#F4F8FC;padding:24px;border-radius:0 0 8px 8px;border:1px solid #E2EBF5;border-top:none;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;width:130px;">Name</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;">${cleanName}</td></tr>
              <tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
              ${cleanPhone ? `<tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Phone</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;">${cleanPhone}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Position</td><td style="padding:8px 0;font-weight:600;color:#0D1B2E;">${cleanPosition}</td></tr>
              ${cleanExp ? `<tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Experience</td><td style="padding:8px 0;color:#0D1B2E;">${cleanExp}</td></tr>` : ""}
              ${cleanLinkedin ? `<tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">LinkedIn</td><td style="padding:8px 0;color:#0D1B2E;"><a href="${cleanLinkedin}">${cleanLinkedin}</a></td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6B7E99;font-size:13px;">Resume</td><td style="padding:8px 0;color:#0D1B2E;">${resumeFile ? "✅ Attached" : "Not provided"}</td></tr>
            </table>
            ${cleanMessage ? `
            <hr style="border:none;border-top:1px solid #E2EBF5;margin:16px 0;" />
            <p style="color:#6B7E99;font-size:13px;margin:0 0 8px;">Cover Letter</p>
            <div style="background:#fff;border:1px solid #E2EBF5;border-radius:6px;padding:16px;color:#0D1B2E;font-size:14px;line-height:1.6;white-space:pre-wrap;">${cleanMessage}</div>` : ""}
          </div>
        </div>`,
      attachments,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Careers email error:", err.message);
    return res.status(500).json({ error: "Failed to submit. Please try again." });
  }
}
