//src/services/mock/MockFeaturedVideoService.ts
//
// Placeholder content only, for local dev before the `featured_videos`
// collection exists in Directus. The IDs below are dummy placeholders
// (not real Vimeo videos) — swap in real Vimeo share URLs via the CMS
// once the collection is live, not here.

import { IFeaturedVideoService } from "../interfaces/IFeaturedVideoService";
import { FeaturedVideo } from "@/domain/featuredvideo/FeaturedVideo";

const MOCK_FEATURED_VIDEOS: FeaturedVideo[] = [
  { id: "1", title: "Welcome to Ysgol Bryn Alyn", embedUrl: "https://player.vimeo.com/video/000000001" },
  { id: "2", title: "Life at YBA", embedUrl: "https://player.vimeo.com/video/000000002" },
];

export class MockFeaturedVideoService implements IFeaturedVideoService {
  async getFeaturedVideos(): Promise<FeaturedVideo[]> {
    return MOCK_FEATURED_VIDEOS;
  }
}
