import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NewsService } from "@/services/ServiceFactory";
import NewsArticle from "@/components/news/NewsArticle";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {

  const { slug } = await params;

  const article = await NewsService.getBySlug(slug);

  if (!article) {
    return {
      title: "News | Ysgol Bryn Alyn",
    };
  }

  return {
    title: `${article.title} | Ysgol Bryn Alyn`,
    description: article.summary,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {

  const { slug } = await params;

  const article = await NewsService.getBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <NewsArticle article={article} />
  );
}