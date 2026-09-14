//frontend/src/app/(site)/events/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { EventService } from "@/services/ServiceFactory";
import EventArticle from "@/components/events/EventArticle";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: EventPageProps
): Promise<Metadata> {

  const { slug } = await params;

  const event = await EventService.getBySlug(slug);

  if (!event) {
    return {
      title: "Events | Ysgol Bryn Alyn",
    };
  }

  return {
    title: `${event.title} | Ysgol Bryn Alyn`,
    description: event.summary,
  };
}

export default async function EventPage({
  params,
}: EventPageProps) {

  const { slug } = await params;

  const event = await EventService.getBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <EventArticle event={event} />
  );
}
