//frontpage/src/components/events/EventCard.tsx

import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
    >
      {event.featuredImage && (
        <Image
          src={event.featuredImage}
          alt={event.title}
          width={600}
          height={450}
          className="h-56 w-full object-cover transition group-hover:scale-105"
        />
      )}

      <div className="p-5">
        <p className="mb-2 text-sm font-semibold text-[var(--yba-magenta)]">
          {event.startDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <h3 className="mb-3 text-xl font-bold text-[var(--yba-navy)]">
          {event.title}
        </h3>

        <p className="line-clamp-3 text-gray-600">
          {event.summary}
        </p>
      </div>
    </Link>
  );
}