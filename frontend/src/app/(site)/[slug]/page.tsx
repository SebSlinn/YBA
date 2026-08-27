import { notFound } from "next/navigation";
import { getPageService } from "@/services/ServiceFactory";
import { RichText } from "@/components/pages/RichText";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StandardPage({ params }: PageProps) {
  const { slug } = await params;
  const pageService = getPageService();
  const page = await pageService.getBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <h1>{page.title}</h1>
      <RichText html={page.content} />
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pageService = getPageService();
  const page = await pageService.getBySlug(slug);

  return {
    title: page?.title ?? "Page not found",
  };
}
