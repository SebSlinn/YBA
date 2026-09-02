import { readItems, withToken } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusPage } from "./types/DirectusPage";
import { DirectusPageMapper } from "../mappers/DirectusPageMapper";
import { IPageService } from "../interfaces/IPageService";
import { Page } from "@/domain/page/Page";

export class DirectusPageService implements IPageService {

  async getBySlug(
    slug: string,
    previewToken?: string
  ): Promise<Page | null> {

    const query = {
      filter: previewToken
        ? { slug: { _eq: slug } }
        : {
            slug: { _eq: slug },
            status: { _eq: "published" },
          },
      limit: 1,
    };

    const items = previewToken
      ? await directus.request(
          withToken(previewToken, readItems("pages", query))
        )
      : await directus.request(readItems("pages", query));

    const pages = items as DirectusPage[];

    if (pages.length === 0) {
      return null;
    }

    return DirectusPageMapper.toPage(pages[0]);
  }
}