//src/services/interfaces/IFeaturedVideoService.ts

import { FeaturedVideo } from "@/domain/featuredvideo/FeaturedVideo";

export interface IFeaturedVideoService {
  getFeaturedVideos(): Promise<FeaturedVideo[]>;
}
