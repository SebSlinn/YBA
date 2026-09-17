//frontend/src/app/(site)/documents/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getFlipbookService } from "@/services/ServiceFactory";
import FlipbookArticle from "@/components/pages/FlipbookArticle";

interface DocumentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DocumentPageProps) {
  const { slug } = await params;
  const flipbookService = getFlipbookService();
  const document = await flipbookService.getBySlug(slug);

  if (!document) {
    return { title: "Document not found | Ysgol Bryn Alyn" };
  }

  return {
    title: `${document.title} | Ysgol Bryn Alyn`,
    description: `View the ${document.title} online.`,
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { slug } = await params;
  const flipbookService = getFlipbookService();
  const document = await flipbookService.getBySlug(slug);

  if (!document) {
    notFound();
  }

  return <FlipbookArticle document={document} />;
}
