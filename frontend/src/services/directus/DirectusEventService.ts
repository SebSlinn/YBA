//frontend/src/services/directus/DirectusEventService.ts

import { readItems } from "@directus/sdk";

import { directus } from "./client/DirectusClient";


import { DirectusEvent } from "./types/DirectusEvent";

import { DirectusEventMapper } from "../mappers/DirectusEventMapper";

import { Event } from "@/types/event";

import {
  IEventService,
  EventQueryOptions,
} from "../interfaces/IEventService";

export class DirectusEventService implements IEventService {

  async getUpcoming(
    options?: EventQueryOptions
  ): Promise<Event[]> {

    const today = new Date().toISOString();

    const items = await directus.request(

      readItems("events", {

        sort: ["start_date"],

        limit: options?.limit,

        filter: {
          status: {
            _eq: "Scheduled",
          },
          start_date: {
            _gte: today,
          },
        },

      })

    );

    return (items as DirectusEvent[])
      .map(DirectusEventMapper.toEvent);
  }

async getBySlug(
  slug: string
): Promise<Event | null> {

  const items = await directus.request(

    readItems("events", {

      filter: {
        slug: {
          _eq: slug,
        },
        status: {
          _eq: "Scheduled",
        },
      },

      limit: 1,

    })

  );

  const events = items as DirectusEvent[];

  if (events.length === 0) {
    return null;
  }

  return DirectusEventMapper.toEvent(events[0]);
}
}