//frontend/src/app/(site)/alumni/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAlumniService } from "@/services/ServiceFactory";
import AlumniArticle from "@/components/alumni/AlumniArticle";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {

  const { slug } = await params;

  const story = await getAlumniService().getBySlug(slug);

  if (!story) {
    return {
      title: "Alumni | Ysgol Bryn Alyn",
    };
  }

  return {
    title: `${story.title} | Ysgol Bryn Alyn`,
    description: story.excerpt,
  };
}

export default async function AlumniStoryPage({ params }: PageProps) {

  const { slug } = await params;

  const story = await getAlumniService().getBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <AlumniArticle story={story} />
  );
}
