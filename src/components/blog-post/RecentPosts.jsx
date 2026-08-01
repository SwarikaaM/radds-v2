import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar } from "lucide-react";
import Card from "../ui/Card";

export default function RecentPosts({ currentPostId, posts }) {
  const recent = [...posts]
    .filter(p => p.id !== currentPostId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  if (!recent.length) return null;

  return (
    <section>
      <h3 className="font-playfair text-3xl font-bold text-textprimary mb-8">Recent Articles</h3>
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {recent.map(post => (
          <Card key={post.id} hover glow className="h-full min-h-[300px]">
            <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
              <span className="text-primary text-xs font-semibold uppercase tracking-wide mb-3">
                {post.category}
              </span>
              <h4 className="font-semibold text-textprimary mb-2 leading-snug line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-textmuted mb-3">
                <Calendar size={11} />
                {post.date} · {post.author}
              </div>
              <p className="text-sm text-textmuted flex-1 leading-relaxed line-clamp-4">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                Read More <ArrowUpRight size={14} />
              </span>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
