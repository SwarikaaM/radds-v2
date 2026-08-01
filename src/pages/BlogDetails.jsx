import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchPosts } from "../utils/blogUtils";
import BlogPostHero from "../components/blog-post/BlogPostHero";
import ArticleBody from "../components/blog-post/ArticleBody";
import ShareButtons from "../components/blog-post/ShareButtons";
import RecentPosts from "../components/blog-post/RecentPosts";
import StickyConsultationCTA from "../components/blog-post/StickyConsultationCTA";

export default function BlogDetails() {
  const { slug } = useParams();
  const [posts, setPosts] = useState(null); // null = loading

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, [slug]);

  if (posts === null) return (
    <div className="min-h-screen flex items-center justify-center text-textmuted">Loading…</div>
  );

  const slugify = str => str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const rawPost = posts.find(p => p.slug === slug);
  if (!rawPost) return <Navigate to="/blog" replace />;

  const post = {
    ...rawPost,
    content: rawPost.content.map(s => ({ ...s, id: s.id || slugify(s.heading) })),
  };

  return (
    <main>
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
        <Link to="/blog"
          className="inline-flex items-center gap-2 text-primary font-medium mb-8 hover:text-secondary transition-colors">
          <ArrowLeft size={16} /> Back to Insights
        </Link>

        <BlogPostHero post={post} />

        {/* 2-col: article + CTA sidebar (no TOC) */}
        <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-8">
          <div className="min-w-0">
            <ArticleBody post={post} />
            <div className="mt-10">
              <h3 className="font-semibold text-textprimary mb-4">Share this article</h3>
              <ShareButtons post={post} />
            </div>
            <div className="mt-16">
              <RecentPosts currentPostId={post.id} posts={posts} />
            </div>
          </div>
          <StickyConsultationCTA />
        </div>
      </div>
    </main>
  );
}
