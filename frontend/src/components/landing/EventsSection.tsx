//src/components/landing/EventsSection.tsx
//
// Unified onto NewsSection's exact structure/spacing: white background,
// top gap removed so "Upcoming Events" sits flush below the section
// above, then a centered pill button at the bottom — same classes as
// News's "View all news" button, just magenta instead of teal and
// "View all events" as the label.
//
// NOTE: UpcomingEvents.tsx (the events list itself) wasn't part of this
// change — if it sets its own text colours internally rather than
// inheriting from a wrapper, check it still reads correctly against the
// white background and Navy heading here.

import UpcomingEvents from "../events/UpcomingEvents";
import { EventService } from "@/services/ServiceFactory";
import Link from "next/link";


export default async function EventsSection() {

  const upcoming = await EventService.getUpcoming({
    limit: 3,
  });

  return (

    <section className="relative overflow-hidden bg-white">
 {/* Magenta Bar — this section's accent colour, cycling back round from the hero */}
      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-teal,#18B8C9)]" />

      <div className="mx-auto max-w-[var(--content-width,1400px)] px-[var(--page-padding,48px)]">

        <h2
          className="pt-2 text-2xl font-bold  sm:text-3xl"
          style={{ color: "var(--yba-navy,#2F3559)" }}
        >
          Upcoming Events
        </h2>

        <div className="mt-10">
          <UpcomingEvents events={upcoming} />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex items-center rounded-md bg-[var(--yba-magenta,#D5008F)] px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View all events →
          </Link>
        </div>

      </div>

    </section>

  );
}
