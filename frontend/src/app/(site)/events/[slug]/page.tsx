//frontend/src/app/(site)/events/[slug]/page.tsx

import { notFound } from "next/navigation";

import { EventService } from "@/services/ServiceFactory";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
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
    <main className="mx-auto max-w-5xl px-6 py-22">

      <h1 className="mb-6 text-4xl font-bold">
        {event.title}
      </h1>

      <p className="mb-6 text-gray-600">
        {event.startDate.toLocaleDateString("en-GB")}
      </p>

      <div
        dangerouslySetInnerHTML={{
          __html: event.content,
        }}
      />

    </main>
  );
}