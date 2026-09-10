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

// Requesting nested fields explicitly — without this, Directus returns
// featured_image as just the raw file ID string, not the related file
// object, so modified_on (needed for cache-busting) is never available.
const EVENT_FIELDS = [
  "*",
  "featured_image.id",
  "featured_image.modified_on",
];

export class DirectusEventService implements IEventService {

  async getUpcoming(
    options?: EventQueryOptions
  ): Promise<Event[]> {

    const today = new Date().toISOString();

    const items = await directus.request(

      readItems("events", {

        fields: EVENT_FIELDS,

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

      fields: EVENT_FIELDS,

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