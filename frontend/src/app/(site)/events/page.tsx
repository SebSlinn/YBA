// frontend/src/app/(site)/events/page.tsx

import { EventService } from "@/services/ServiceFactory";

import EventCard from "@/components/events/EventCard";

export default async function EventsPage() {

  const events = await EventService.getUpcoming();

  return (

    <main className="mx-auto max-w-7xl px-6 py-12">

      <h1
        className="mb-10 text-4xl font-bold"
        style={{ color: "var(--yba-navy)" }}
      >
        Upcoming Events
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {events.map(event => (

          <EventCard
            key={event.id}
            event={event}
          />

        ))}

      </div>

    </main>

  );

}