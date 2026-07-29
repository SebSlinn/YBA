//frontend/src/services/interfaces/IEventService.ts

import { Event } from "@/types/event";

export interface EventQueryOptions {
    limit?: number;
}

export interface IEventService {

    getUpcoming(
        options?: EventQueryOptions
    ): Promise<Event[]>;

    getBySlug(
        slug: string
    ): Promise<Event | null>;

}


