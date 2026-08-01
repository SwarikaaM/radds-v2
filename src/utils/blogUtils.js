// Fetch posts from public/blogs/posts.json at runtime
// Falls back to empty array on error

let _cache = null;

export async function fetchPosts() {
  if (_cache) return _cache;
  try {
    const res = await fetch("/blogs/posts.json?t=" + Date.now());
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    _cache = data.filter(p => p.published !== false);
    return _cache;
  } catch (e) {
    console.error("blogUtils: failed to load posts", e);
    return [];
  }
}

export async function fetchAllPosts() {
  // For admin — includes unpublished
  const res = await fetch("/blogs/posts.json?t=" + Date.now());
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateId(posts) {
  return posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
}
