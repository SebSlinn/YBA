//frontend/src/services/mappers/DirectusBlogMapper.ts

import { BlogPost } from "@/domain/blog/BlogPost";
import { DirectusBlog } from "../directus/types/DirectusBlog";
import { getAssetUrl } from "../directus/client/DirectusClient";

export class DirectusBlogMapper {

  static toBlogPost(
    item: DirectusBlog
  ): BlogPost {

    return {

      id: item.id.toString(),

      title: item.title,

      slug: item.slug,

      excerpt: item.excerpt,

      content: item.content,

      featuredImage: item.featured_image
        ? getAssetUrl(item.featured_image.id, {
            width: 600,
            height: 338,
            fit: "cover",
            cacheBust: item.featured_image.modified_on,
          })
        : undefined,

      publishedDate: item.publish_date,

      author: item.author ?? undefined,
    };
  }
}
