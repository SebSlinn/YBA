//frontend/src/services/mappers/DirectusEventMapper.ts


import { Event } from "@/domain/event/Event";
import { DirectusEvent } from "../directus/types/DirectusEvent";
import { getAssetUrl } from "../directus/client/DirectusClient";

export class DirectusEventMapper {
  static toEvent(item: DirectusEvent): Event {
    return {
      id: item.id.toString(),
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      featuredImage: item.featured_image
        ? getAssetUrl(item.featured_image.id, {
            width: 600,
            height: 338,
            fit: "cover",
            cacheBust: item.featured_image.modified_on,
          })
        : undefined,
      startDate: new Date(item.start_date),
      endDate: item.end_date ? new Date(item.end_date) : undefined,
      location: item.location,
      category: item.category,
      featured: item.featured ?? false,
      status: item.status,
    };
  }
}