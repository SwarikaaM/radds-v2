import BlogCard from "./BlogCard";

export default function BlogGrid({ posts, activeCategory, search }) {
  const filtered = posts.filter(post => {
    const categoryMatch = activeCategory === "All" || post.category === activeCategory;
    const searchMatch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (!filtered.length) return (
    <div className="text-center py-20 text-textmuted">No articles found.</div>
  );

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filtered.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
    </div>
  );
}
