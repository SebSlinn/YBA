//frontend/src/services/mappers/DirectusAlumniMapper.ts

import { AlumniStory } from "@/domain/alumni/AlumniStory";
import { DirectusAlumni } from "../directus/types/DirectusAlumni";
import { getAssetUrl } from "../directus/client/DirectusClient";

export class DirectusAlumniMapper {

  static toAlumniStory(
    item: DirectusAlumni
  ): AlumniStory {

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

      attendedFrom: item.attended_from,

      attendedTo: item.attended_to,

      publishedDate: item.publish_date,
    };
  }
}
