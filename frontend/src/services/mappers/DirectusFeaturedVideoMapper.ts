//src/services/mappers/DirectusFeaturedVideoMapper.ts

import { FeaturedVideo } from "@/domain/featuredvideo/FeaturedVideo";
import { DirectusFeaturedVideo } from "../directus/types/DirectusFeaturedVideo";

// Matches vimeo.com/123456789, vimeo.com/channels/staffpicks/123456789,
// and player.vimeo.com/video/123456789 — anything ending in /<digits> on
// a vimeo.com host. Doesn't validate the ID actually exists, just that a
// numeric ID could be pulled out of whatever URL shape was pasted in.
const VIMEO_ID_PATTERN = /vimeo\.com\/(?:.*\/)?(\d+)/i;

function extractVimeoId(url: string): string | null {
  const match = url.match(VIMEO_ID_PATTERN);
  return match ? match[1] : null;
}

export class DirectusFeaturedVideoMapper {
  static toFeaturedVideo(row: DirectusFeaturedVideo): FeaturedVideo {
    const vimeoId = extractVimeoId(row.vimeo_url);

    return {
      id: row.id,
      title: row.title,
      embedUrl: vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : null,
    };
  }
}
