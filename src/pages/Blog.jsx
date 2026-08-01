import { useState, useEffect, useMemo } from "react";
import BlogHero from "../components/blog/BlogHero";
import BlogCategoryTabs from "../components/blog/BlogCategoryTabs";
import BlogGrid from "../components/blog/BlogGrid";
import BlogSidebar from "../components/blog/BlogSidebar";
import BlogCTA from "../components/blog/BlogCTA";
import { fetchPosts } from "../utils/blogUtils";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const categories = useMemo(() =>
    ["All", ...new Set(posts.map(p => p.category))],
    [posts]
  );

  return (
    <main>
      <BlogHero />
      <BlogCategoryTabs categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_320px] gap-10">
          <BlogGrid posts={posts} activeCategory={activeCategory} search={search} />
          <BlogSidebar posts={posts} search={search} setSearch={setSearch} />
        </div>
      </section>
      <BlogCTA />
    </main>
  );
}
