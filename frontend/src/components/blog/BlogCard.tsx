//frontend/src/components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/domain/blog/BlogPost";

interface BlogCardProps {
  post: BlogPost;
}

// NOTE: I don't have your actual NewsCard.tsx, so the classNames below are
// a generic, minimal Tailwind placeholder (no borders/shadows beyond a
// subtle hover, no tags/author chrome) chosen to match the "stylish and
// simple, without the surrounding paraphernalia" brief. Swap in your real
// card's wrapper/typography classes for exact visual consistency with News —
// send me NewsCard.tsx and I'll line this up precisely.

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
    >
      {post.featuredImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
          {formattedDate}
        </p>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:underline">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
      </div>
    </Link>
  );
}
