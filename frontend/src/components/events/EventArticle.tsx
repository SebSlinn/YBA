//frontend/src/components/events/EventArticle.tsx
import Image from "next/image";
import { Event } from "@/domain/event/Event";
import { RichText } from "@/components/pages/RichText";

interface EventArticleProps {
  event: Event;
}

// NOTE: `location` wasn't rendered anywhere before (it's on the domain
// type but the old detail page never used it) — I've surfaced it here
// since the data's already there. Remove the block below if you'd rather
// hold off on that for now.

export default function EventArticle({ event }: EventArticleProps) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const startFormatted = event.startDate.toLocaleDateString("en-GB", dateOptions);
  const endFormatted = event.endDate
    ? event.endDate.toLocaleDateString("en-GB", dateOptions)
    : undefined;

  return (
    <article className="pt-[130px] pb-22">
      {/*
        RichText itself applies max-w-[800px] mx-auto px-4 to the body
        content, so this header block matches that same width rather than
        introducing a different container.
      */}
      <header className="mx-auto mb-6 max-w-[800px] px-4">
        {event.featuredImage && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={event.featuredImage}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="mb-2 text-4xl font-bold">{event.title}</h1>

        <p className="mb-1 text-sm font-semibold text-[var(--yba-magenta)]">
          {endFormatted && endFormatted !== startFormatted
            ? `${startFormatted} – ${endFormatted}`
            : startFormatted}
        </p>

        {event.location && (
          <p className="text-sm text-gray-500">{event.location}</p>
        )}
      </header>

      <RichText html={event.content} />
    </article>
  );
}
