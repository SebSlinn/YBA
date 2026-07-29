// src/services/directus/mappers/DirectusNewsMapper.ts


import { NewsArticle } from "@/domain/news/NewsArticle";
import { DirectusNews } from "../directus/types/DirectusNews";
import { getAssetUrl } from "../directus/client/DirectusClient";

export class DirectusNewsMapper {

  static toNewsArticle(
    item: DirectusNews
  ): NewsArticle {

    return {

      id: item.id.toString(),

      title: item.title,

      slug: item.slug,

      summary: item.summary,

      content: item.content,

      featuredImage: getAssetUrl(item.featured_image),

      publishedDate: item.publish_date,

      category: item.category,

      featured: item.featured ?? false,

      pinned: item.pinned ?? false,

      externalReferences: [],
    };
  }
}