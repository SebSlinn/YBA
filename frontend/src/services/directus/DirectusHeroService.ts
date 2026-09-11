// frontend/src/services/directus/DirectusHeroService.ts

import { readItems } from "@directus/sdk";
import { IHeroService } from "../interfaces/IHeroService";
import { HeroSlide } from "@/domain/hero/HeroSlide";
import { directus } from "./client/DirectusClient";
import { DirectusHero } from "./types/DirectusHero";
import { DirectusHeroMapper } from "../mappers/DirectusHeroMapper";

export class DirectusHeroService implements IHeroService {
  async getActive(): Promise<HeroSlide[]> {
    const items = (await directus.request(
      readItems("hero_slides", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        fields: [
          "id",
          "heading",
          "subheading",
          "alt_text",
          "sort",
          "status",
          "image.id",
          "image.modified_on",
          "image.width",
          "image.height",
          "image.focal_point_x",
          "image.focal_point_y",
        ],
      })
    )) as DirectusHero[];

    return items.map(DirectusHeroMapper.toHeroSlide);
  }
}
