//src/components/landing/EventsSection.tsx
//
// Unified back onto NewsSection's white-background template, with two
// deliberate differences you asked for:
//  - the top vertical gap is removed entirely, so "Upcoming Events" sits
//    immediately below the boundary with the section above it (matching
//    how Featured News sits flush at the top of NewsSection, no gap);
//  - rather than a thin accent line + a separate centered button, the
//    "View all events" action IS the bottom line: a full-width YBA-magenta
//    band flush against the very bottom edge of the section.
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

    <section className="bg-white">

      <div className="mx-auto max-w-[var(--content-width,1400px)] px-[var(--page-padding,48px)] pb-14 sm:pb-16">

        <h2
          className="pt-10 text-2xl font-bold sm:text-3xl sm:pt-12"
          style={{ color: "var(--yba-navy,#2F3559)" }}
        >
          Upcoming Events
        </h2>

        <div className="mt-10">
          <UpcomingEvents events={upcoming} />
        </div>

      </div>

      {/* The bottom line: a full-width YBA-magenta band flush with the
          section's bottom edge, doubling as the "View all events" action —
          replaces the earlier thin accent bar + separate centered button. */}
      <div className="w-full bg-[var(--yba-magenta,#D5008F)] py-5 text-center">
        <Link
          href="/events"
          className="inline-flex items-center font-semibold text-white transition hover:opacity-90"
        >
          View all events →
        </Link>
      </div>

    </section>

  );
}
