//frontend/src/app/(site)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogService } from "@/services/ServiceFactory";
import BlogArticle from "@/components/blog/BlogArticle";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {

  const { slug } = await params;

  const post = await getBlogService().getBySlug(slug);

  if (!post) {
    return {
      title: "Blog | Ysgol Bryn Alyn",
    };
  }

  return {
    title: `${post.title} | Ysgol Bryn Alyn`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {

  const { slug } = await params;

  const post = await getBlogService().getBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogArticle post={post} />
  );
}
