//frontend/src/app/(site)/publications/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getFlipbookService } from "@/services/ServiceFactory";
import FlipbookArticle from "@/components/pages/FlipbookArticle";

interface PublicationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicationPageProps) {
  const { slug } = await params;
  const flipbookService = getFlipbookService();
  const document = await flipbookService.getBySlug(slug);

  if (!document) {
    return { title: "Publication not found | Ysgol Bryn Alyn" };
  }

  return {
    title: `${document.title} | Ysgol Bryn Alyn`,
    description: `View the ${document.title} online.`,
  };
}

export default async function PublicationPage({ params }: PublicationPageProps) {
  const { slug } = await params;
  const flipbookService = getFlipbookService();
  const document = await flipbookService.getBySlug(slug);

  if (!document) {
    notFound();
  }

  return <FlipbookArticle document={document} />;
}