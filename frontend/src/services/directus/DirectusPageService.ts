import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusPage } from "./types/DirectusPage";
import { DirectusPageMapper } from "../mappers/DirectusPageMapper";
import { IPageService } from "../interfaces/IPageService";
import { Page } from "@/domain/page/Page";

export class DirectusPageService implements IPageService {

  async getBySlug(
    slug: string
  ): Promise<Page | null> {

    const items = await directus.request(

      readItems("pages", {

        filter: {
          slug: {
            _eq: slug,
          },
          status: {
            _eq: "published",
          },
        },

        limit: 1,

      })

    );

    const pages = items as DirectusPage[];

    if (pages.length === 0) {
      return null;
    }

    return DirectusPageMapper.toPage(pages[0]);
  }
}
