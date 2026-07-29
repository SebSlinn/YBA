//frontpage/src/components/events/UpcomingEvents.tsx

import { Event } from "@/types/event";
import EventCard from "./EventCard";

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({
  events,
}: UpcomingEventsProps) {

  return (
    <div className="grid gap-8 md:grid-cols-3">

      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}

    </div>
  );
}