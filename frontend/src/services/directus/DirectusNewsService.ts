//frontend/src/services/directus/DirectusNewsService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusNews } from "./types/DirectusNews";
import { DirectusNewsMapper } from "../mappers/DirectusNewsMapper";
import { INewsService, NewsQueryOptions } from "../interfaces/INewsService";
import { NewsArticle } from "@/domain/news/NewsArticle";

export class DirectusNewsService implements INewsService {

async getLatest(
  options?: NewsQueryOptions
): Promise<NewsArticle[]> {

  const items = await directus.request(

    readItems("news", {

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
