//frontend/src/components/blog/BlogArticle.tsx
import Image from "next/image";
import { BlogPost } from "@/domain/blog/BlogPost";
import { RichText } from "@/components/pages/RichText";

interface BlogArticleProps {
  post: BlogPost;
}

// NOTE: named BlogArticle rather than BlogPost to avoid shadowing the
// BlogPost domain type imported above — News doesn't hit this since its
// page.tsx never imports the NewsArticle domain type directly. Rename if
// you've already got a different naming convention for these (e.g.
// something like EventDetail) that I should match instead.

export default function BlogArticle({ post }: BlogArticleProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <article className="pt-[130px] pb-12">
      {/*
        RichText itself applies max-w-[800px] mx-auto px-4 to the body
        content, so this header block matches that same width rather than
        introducing a different container.
      */}
      <header className="mx-auto mb-6 max-w-[800px] px-4">
        {post.featuredImage && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="mb-2 text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </header>

      <RichText html={post.content} />
    </article>
  );
}
