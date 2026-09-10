//frontend/src/services/directus/DirectusNewsService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusNews } from "./types/DirectusNews";
import { DirectusNewsMapper } from "../mappers/DirectusNewsMapper";
import { INewsService, NewsQueryOptions } from "../interfaces/INewsService";
import { NewsArticle } from "@/domain/news/NewsArticle";

// Requesting nested fields explicitly — without this, Directus returns
// featured_image as just the raw file ID string, not the related file
// object, so modified_on (needed for cache-busting) is never available.
const NEWS_FIELDS = [
  "*",
  "featured_image.id",
  "featured_image.modified_on",
];

export class DirectusNewsService implements INewsService {

async getLatest(
  options?: NewsQueryOptions
): Promise<NewsArticle[]> {

  const items = await directus.request(

    readItems("news", {

      fields: NEWS_FIELDS,

      sort: ["-publish_date"],

      limit: options?.limit,

      filter: options?.featured === undefined
        ? {}
        : {
            featured: {
              _eq: options.featured,
            },
          },

    })

  );

  return (items as DirectusNews[])
    .map(DirectusNewsMapper.toNewsArticle);
}

 async getBySlug(
  slug: string
): Promise<NewsArticle | null> {

  const items = await directus.request(

    readItems("news", {

      fields: NEWS_FIELDS,

      filter: {
        slug: {
          _eq: slug,
        },
      },

      limit: 1,

    })

  );

  const news = items as DirectusNews[];

  if (news.length === 0) {
    return null;
  }

  return DirectusNewsMapper.toNewsArticle(news[0]);
}
}