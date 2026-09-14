//frontend/src/components/blog/BlogIndex.tsx
import { BlogPost } from "@/domain/blog/BlogPost";
import { BlogCard } from "./BlogCard";

interface BlogIndexProps {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-[130px] pb-12">
      <h1 className="mb-8 text-3xl font-semibold">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
