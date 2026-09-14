//frontend/src/app/(site)/blog/page.tsx
import { Metadata } from "next";
import { getBlogService } from "@/services/ServiceFactory";
import BlogIndex from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog | Ysgol Bryn Alyn",
};

export default async function BlogIndexPage() {
  const posts = await getBlogService().getLatest();

  return (
    <BlogIndex posts={posts} />
  );
}
