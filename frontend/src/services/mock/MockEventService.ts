//frontend/src/services/mock/MockEventService.ts

import {
  IEventService,
  EventQueryOptions,
} from "../interfaces/IEventService";

import { Event } from "@/types/event";

const events: Event[] = [
  {
    id: "1",
    title: "Open Evening 2026",
    slug: "open-evening-2026",
    summary: "Join us for our annual Open Evening!",
    content: `
      <p>Come and jin us for our exciting open evening</p>
      <p>Look forwars to seeing you there!</p>
    `,
    featuredImage: "/images/news/Leader2.jpg",
    startDate: new Date("2026-10-15"),
    endDate: new Date("2026-10-15"),
    category: "Events",
    featured: false,
    status: "Scheduled",
  },
];

export class MockEventService implements IEventService {
  async getUpcoming(
    options?: EventQueryOptions
): Promise<Event[]> {

    let result = [...events];

    const today = new Date();

    result = result.filter(
        event => event.startDate >= today
    );

    result.sort(
        (a, b) =>
            a.startDate.getTime() -
            b.startDate.getTime()
    );

    if (options?.limit) {
        result = result.slice(0, options.limit);
    }

    return result;
}

  async getBySlug(slug: string): Promise<Event | null> {
    return events.find((event) => event.slug === slug) ?? null;
  }
}