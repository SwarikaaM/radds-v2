import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff, LogOut, ChevronDown, ChevronUp, Save, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { slugify } from "../utils/blogUtils";

const TOKEN_KEY = "radds_admin_token";
const CATEGORIES = ["SIP Investing", "Market Analysis", "Goal Planning", "Insurance", "Tax Planning", "Mutual Funds", "Financial Planning"];

// ── Token helpers ────────────────────────────────────────────────────────
function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const [payload] = raw.split(".");
    if (Date.now() > Number(payload)) { localStorage.removeItem(TOKEN_KEY); return null; }
    return raw;
  } catch { return null; }
}
function saveToken(t) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

// ── API helpers ──────────────────────────────────────────────────────────
async function apiFetch(url, body, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Empty post template ──────────────────────────────────────────────────
function emptyPost() {
  return {
    id: null,
    slug: "",
    title: "",
    excerpt: "",
    category: CATEGORIES[0],
    author: "Radds Research",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    readTime: "5 min read",
    coverImage: "",
    published: false,
    featured: false,
    content: [{ id: "", heading: "", body: "", points: [], callout: "" }],
  };
}

// ── Section editor ───────────────────────────────────────────────────────
function SectionEditor({ section, index, onChange, onRemove, canRemove }) {
  const [open, setOpen] = useState(true);
  const set = (field, val) => onChange(index, { ...section, [field]: val });

  return (
    <div className="border border-[#E2EBF5] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] cursor-pointer"
        onClick={() => setOpen(o => !o)}>
        <span className="font-medium text-sm text-[#0D1B2E]">
          Section {index + 1}{section.heading ? ` — ${section.heading.slice(0, 40)}` : ""}
        </span>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button type="button" onClick={e => { e.stopPropagation(); onRemove(index); }}
              className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={14} />
            </button>
          )}
          {open ? <ChevronUp size={16} className="text-[#6B7E99]" /> : <ChevronDown size={16} className="text-[#6B7E99]" />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-[#6B7E99] block mb-1">Heading *</label>
            <input value={section.heading} onChange={e => set("heading", e.target.value)}
              placeholder="Section heading"
              className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm outline-none focus:border-[#22568F]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7E99] block mb-1">Body *</label>
            <textarea value={section.body} onChange={e => set("body", e.target.value)}
              placeholder="Section body text" rows={4}
              className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm outline-none focus:border-[#22568F] resize-y" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7E99] block mb-1">Bullet Points (one per line)</label>
            <textarea
              value={(section.points || []).join("\n")}
              onChange={e => set("points", e.target.value.split("\n").filter(Boolean))}
              placeholder="Point 1&#10;Point 2&#10;Point 3" rows={3}
              className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm outline-none focus:border-[#22568F] resize-y font-mono" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7E99] block mb-1">Key Takeaway / Callout (optional)</label>
            <input value={section.callout || ""} onChange={e => set("callout", e.target.value)}
              placeholder="A memorable quote or takeaway"
              className="w-full border border-[#D1DDE8] rounded-lg p-2.5 text-sm outline-none focus:border-[#22568F]" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Post Form ────────────────────────────────────────────────────────────
function PostForm({ initial, onSave, onCancel, saving, error }) {
  const [post, setPost] = useState(initial);
  const [slugManual, setSlugManual] = useState(!!initial.id);

  const set = (field, val) => setPost(p => ({ ...p, [field]: val }));

  function handleTitle(val) {
    set("title", val);
    if (!slugManual) set("slug", slugify(val));
  }

  function updateSection(i, sec) {
    const updated = [...post.content];
    updated[i] = { ...sec, id: sec.id || slugify(sec.heading) };
    set("content", updated);
  }
  function addSection() { set("content", [...post.content, { id: "", heading: "", body: "", points: [], callout: "" }]); }
  function removeSection(i) { set("content", post.content.filter((_, idx) => idx !== i)); }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(post);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Title *</label>
          <input value={post.title} onChange={e => handleTitle(e.target.value)} required
            placeholder="Blog post title"
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F]" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Slug (URL)</label>
          <input value={post.slug} onChange={e => { setSlugManual(true); set("slug", e.target.value); }}
            placeholder="auto-generated-from-title"
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F] font-mono" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Category</label>
          <select value={post.category} onChange={e => set("category", e.target.value)}
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm bg-white outline-none focus:border-[#22568F]">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Author</label>
          <input value={post.author} onChange={e => set("author", e.target.value)}
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F]" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Date (display)</label>
          <input value={post.date} onChange={e => set("date", e.target.value)}
            placeholder="June 24, 2026"
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F]" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Read Time</label>
          <input value={post.readTime} onChange={e => set("readTime", e.target.value)}
            placeholder="5 min read"
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F]" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">
            Cover Image URL <span className="text-[#9BAAB8]">(leave blank to hide image on post)</span>
          </label>
          <input value={post.coverImage || ""} onChange={e => set("coverImage", e.target.value)}
            placeholder="https://... or leave blank"
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F]" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-[#6B7E99] block mb-1">Excerpt / Summary *</label>
          <textarea value={post.excerpt} onChange={e => set("excerpt", e.target.value)} required rows={3}
            placeholder="A short summary shown on the blog listing and at the top of the post"
            className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F] resize-y" />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: "Published", field: "published" },
          { label: "Featured", field: "featured" },
        ].map(({ label, field }) => (
          <label key={field} className="flex items-center gap-2 cursor-pointer">
            <button type="button" onClick={() => set(field, !post[field])}
              className={`relative w-10 h-5 rounded-full transition-colors ${post[field] ? "bg-[#22568F]" : "bg-gray-200"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${post[field] ? "translate-x-5" : ""}`} />
            </button>
            <span className="text-sm text-[#3D4F66] font-medium">{label}</span>
          </label>
        ))}
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-[#6B7E99] uppercase tracking-wide">Content Sections</label>
          <button type="button" onClick={addSection}
            className="flex items-center gap-1 text-xs text-[#22568F] font-medium hover:text-[#1a4070]">
            <Plus size={13} /> Add Section
          </button>
        </div>
        <div className="space-y-3">
          {post.content.map((sec, i) => (
            <SectionEditor key={i} section={sec} index={i}
              onChange={updateSection}
              onRemove={removeSection}
              canRemove={post.content.length > 1} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-[#22568F] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#1a4070] transition-colors text-sm disabled:opacity-60">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Post</>}
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-2 border border-[#D1DDE8] text-[#6B7E99] px-5 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-sm">
          <X size={14} /> Cancel
        </button>
      </div>
    </form>
  );
}

// ── Login Screen ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false); 

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/api/admin-auth", { password: pw });
      saveToken(data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E2EBF5] shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-playfair text-2xl font-bold text-[#0D1B2E]">Admin</h1>
          <p className="text-[#6B7E99] text-sm mt-1">Radds Capital — Blog Management</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Admin password" autoFocus required
              className="w-full border border-[#D1DDE8] rounded-lg p-3 pr-10 text-sm outline-none focus:border-[#22568F]" />
            <button type="button" onClick={() => setShowPw(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7E99] hover:text-[#22568F] transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#22568F] text-white font-semibold py-3 rounded-lg hover:bg-[#1a4070] transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Verifying…</> : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin ────────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState(() => getToken());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // post object or null
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/blogs/posts.json?t=" + Date.now());
      const data = await res.json();
      setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { setPosts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) loadPosts(); }, [token, loadPosts]);

  async function handleSave(post) {
    setSaving(true); setFormError("");
    try {
      await apiFetch("/api/admin-save", { post }, token);
      showToast(post.id ? "Post updated ✓" : "Post created ✓ — deploying in ~60s");
      setEditing(null);
      // Reload after short delay to allow GitHub commit
      setTimeout(loadPosts, 3000);
    } catch (err) {
      setFormError(err.message);
    } finally { setSaving(false); }
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleting(post.id);
    try {
      await apiFetch("/api/admin-delete", { id: post.id }, token);
      showToast("Post deleted ✓");
      setTimeout(loadPosts, 3000);
    } catch (err) {
      alert(err.message);
    } finally { setDeleting(null); }
  }

  function handleLogout() { clearToken(); setToken(null); setPosts([]); }

  if (!token) return <LoginScreen onLogin={t => { setToken(t); }} />;

  return (
    <div className="min-h-screen bg-[#F4F8FC] pt-16">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#22568F] text-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold">Blog Admin</h1>
            <p className="text-white/60 text-sm">Radds Capital — Content Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setEditing(emptyPost()); setFormError(""); }}
              className="flex items-center gap-2 bg-white text-[#22568F] font-semibold px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors text-sm">
              <Plus size={15} /> New Post
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Edit / Create Form */}
        {editing && (
          <div className="bg-white rounded-2xl border border-[#E2EBF5] shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-[#0D1B2E] text-lg mb-5">
              {editing.id ? "Edit Post" : "New Post"}
            </h2>
            <PostForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => { setEditing(null); setFormError(""); }}
              saving={saving}
              error={formError}
            />
          </div>
        )}

        {/* Posts List */}
        <div className="bg-white rounded-2xl border border-[#E2EBF5] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2EBF5] flex items-center justify-between">
            <h2 className="font-semibold text-[#0D1B2E]">All Posts ({posts.length})</h2>
            {loading && <Loader2 size={16} className="animate-spin text-[#6B7E99]" />}
          </div>

          {posts.length === 0 && !loading && (
            <div className="text-center py-16 text-[#6B7E99]">No posts yet. Create your first post above.</div>
          )}

          <div className="divide-y divide-[#E2EBF5]">
            {posts.map(post => (
              <div key={post.id} className="flex items-start gap-4 px-6 py-4 hover:bg-[#F9FBFD] transition-colors">
                {/* Thumb */}
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border border-[#E2EBF5]" />
                ) : (
                  <div className="w-16 h-12 bg-[#EAF2FF] rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-[#22568F] text-xs font-bold">{post.category?.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    {post.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#22568F]">Featured</span>}
                    <span className="text-xs text-[#6B7E99]">{post.category}</span>
                  </div>
                  <p className="font-medium text-[#0D1B2E] text-sm leading-snug line-clamp-1">{post.title}</p>
                  <p className="text-xs text-[#6B7E99] mt-0.5">{post.date} · {post.author} · {post.readTime}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                    className="p-2 text-[#6B7E99] hover:text-[#22568F] transition-colors" title="View post">
                    <Eye size={15} />
                  </a>
                  <button onClick={() => { setEditing({ ...post }); setFormError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="p-2 text-[#6B7E99] hover:text-[#22568F] transition-colors" title="Edit post">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(post)} disabled={deleting === post.id}
                    className="p-2 text-[#6B7E99] hover:text-red-500 transition-colors" title="Delete post">
                    {deleting === post.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#9BAAB8] text-center mt-6">
          Changes trigger a Vercel redeploy — posts go live within ~60 seconds.
        </p>
      </div>
    </div>
  );
}
