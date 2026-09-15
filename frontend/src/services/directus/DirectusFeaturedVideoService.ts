//src/services/directus/DirectusFeaturedVideoService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusFeaturedVideo } from "./types/DirectusFeaturedVideo";
import { DirectusFeaturedVideoMapper } from "../mappers/DirectusFeaturedVideoMapper";
import { IFeaturedVideoService } from "../interfaces/IFeaturedVideoService";
import { FeaturedVideo } from "@/domain/featuredvideo/FeaturedVideo";

export class DirectusFeaturedVideoService implements IFeaturedVideoService {
  async getFeaturedVideos(): Promise<FeaturedVideo[]> {
    const rows = (await directus.request(
      readItems("featured_videos", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        // The design is "max two videos side by side" — capping the query
        // itself means a 3rd published video just doesn't show, rather
        // than needing a 3-across layout case nobody asked for.
        limit: 2,
        fields: ["*"],
      })
    )) as DirectusFeaturedVideo[];

    return rows.map(DirectusFeaturedVideoMapper.toFeaturedVideo);
  }
}
