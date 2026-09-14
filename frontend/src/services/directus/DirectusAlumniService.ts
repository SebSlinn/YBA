//frontend/src/services/directus/DirectusAlumniService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusAlumni } from "./types/DirectusAlumni";
import { DirectusAlumniMapper } from "../mappers/DirectusAlumniMapper";
import { IAlumniService, AlumniQueryOptions } from "../interfaces/IAlumniService";
import { AlumniStory } from "@/domain/alumni/AlumniStory";

// Requesting nested fields explicitly — without this, Directus returns
// featured_image as just the raw file ID string, not the related file
// object, so modified_on (needed for cache-busting) is never available.
const ALUMNI_FIELDS = [
  "*",
  "featured_image.id",
  "featured_image.modified_on",
];

export class DirectusAlumniService implements IAlumniService {

async getLatest(
  options?: AlumniQueryOptions
): Promise<AlumniStory[]> {

  const items = await directus.request(

    readItems("alumni_stories", {

      fields: ALUMNI_FIELDS,

      sort: ["-publish_date"],

      limit: options?.limit,

    })

  );

  return (items as DirectusAlumni[])
    .map(DirectusAlumniMapper.toAlumniStory);
}

 async getBySlug(
  slug: string
): Promise<AlumniStory | null> {

  const items = await directus.request(

    readItems("alumni_stories", {

      fields: ALUMNI_FIELDS,

      filter: {
        slug: {
          _eq: slug,
        },
      },

      limit: 1,

    })

  );

  const stories = items as DirectusAlumni[];

  if (stories.length === 0) {
    return null;
  }

  return DirectusAlumniMapper.toAlumniStory(stories[0]);
}
}
