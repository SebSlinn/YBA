//src/components/landing/EventsSection.tsx

import UpcomingEvents from "../events/UpcomingEvents";
import { EventService } from "@/services/ServiceFactory";
import Link from "next/link";


export default async function EventsSection() {

  const upcoming = await EventService.getUpcoming({
    limit: 3,
  });

  return (

    <section className="bg-white py-16 sm:py-24">

      <div className="relative mx-auto max-w-[var(--content-width,1400px)] px-[var(--page-padding,48px)]">

        <h2
          className="text-2xl font-bold sm:text-3xl"
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
            className="inline-flex rounded-md bg-[var(--yba-navy)] px-6 py-3 text-white transition hover:opacity-90"
          >
            View all events →
          </Link>
        </div>

      </div>

    </section>

  );
}
