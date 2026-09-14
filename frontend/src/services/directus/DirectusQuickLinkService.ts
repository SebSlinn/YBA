//src/services/directus/DirectusQuickLinkService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusQuickLink } from "./types/DirectusQuickLink";
import { DirectusQuickLinkMapper } from "../mappers/DirectusQuickLinkMapper";
import { IQuickLinkService } from "../interfaces/IQuickLinkService";
import { QuickLink } from "@/domain/quicklink/QuickLink";

export class DirectusQuickLinkService implements IQuickLinkService {
  async getQuickLinks(): Promise<QuickLink[]> {
    const rows = (await directus.request(
      readItems("quick_links", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        fields: ["*"],
      })
    )) as DirectusQuickLink[];

    return rows.map(DirectusQuickLinkMapper.toQuickLink);
  }
}
