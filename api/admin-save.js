import { verifyToken } from "./_verifyToken.js";

const GITHUB_API = "https://api.github.com";

async function getFile() {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const path = "public/blogs/posts.json";
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
  return { content, sha: data.sha };
}

async function putFile(content, sha, message) {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const path = "public/blogs/posts.json";
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: encoded, sha, branch }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${err}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "https://raddscapital.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!verifyToken(token)) return res.status(401).json({ error: "Unauthorized" });

  const post = req.body?.post;
  if (!post || !post.slug || !post.title) {
    return res.status(400).json({ error: "Post data incomplete" });
  }

  try {
    const { content: posts, sha } = await getFile();
    const idx = posts.findIndex(p => p.id === post.id);
    const now = new Date().toISOString();

    if (idx >= 0) {
      // Update existing
      posts[idx] = { ...post, updatedAt: now };
    } else {
      // New post — assign id
      const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
      posts.unshift({ ...post, id: maxId + 1, createdAt: now, updatedAt: now });
    }

    await putFile(posts, sha, `Blog: ${idx >= 0 ? "update" : "add"} "${post.title}"`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("admin-save error:", err.message);
    return res.status(500).json({ error: "Failed to save post." });
  }
}
