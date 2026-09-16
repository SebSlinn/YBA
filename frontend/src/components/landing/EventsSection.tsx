//src/components/landing/EventsSection.tsx
//
// Colours flipped to navy background / white writing, matching the same
// treatment already applied to Quick Links, Featured Video and News.
//
// A 4px YBA-teal accent bar sits along the bottom edge, same mechanism as
// the teal bar between Hero/Quick Links, the gold bar below Featured
// Video, and the magenta bar below News — this is the last one before the
// Footer, so it closes out the same colour-cycling pattern used all the
// way down the homepage.
//
// NOTE: UpcomingEvents.tsx (the events list itself) wasn't part of this
// change and renders inside this section below — if it sets its own text
// colours internally rather than inheriting from a wrapper, it will need
// the same navy → white flip, same caveat as FeaturedNews.tsx earlier.

import UpcomingEvents from "../events/UpcomingEvents";
import { EventService } from "@/services/ServiceFactory";
import Link from "next/link";


export default async function EventsSection() {

  const upcoming = await EventService.getUpcoming({
    limit: 3,
  });

  return (

    <section className="relative overflow-hidden bg-[var(--yba-navy,#2F3559)] py-16 sm:py-24">

      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-teal,#18B8C9)]" />

      <div className="relative mx-auto max-w-[var(--content-width,1400px)] px-[var(--page-padding,48px)]">

        <h2
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--yba-white,#FFFFFF)" }}
        >
          Upcoming Events
        </h2>

        <div className="mt-10" style={{ color: "var(--yba-white,#FFFFFF)" }}>
          <UpcomingEvents events={upcoming} />
        </div>

        <div className="mt-10 text-center">
          {/* Button inverted to white-on-navy — the previous navy button on
              a now-navy section background would have been invisible. */}
          <Link
            href="/events"
            className="inline-flex rounded-md bg-white px-6 py-3 font-semibold text-[var(--yba-navy,#2F3559)] transition hover:opacity-90"
          >
            View all events →
          </Link>
        </div>

      </div>

    </section>

  );
}
