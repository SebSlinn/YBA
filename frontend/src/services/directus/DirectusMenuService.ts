import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";

import type { IMenuService } from "@/services/interfaces/IMenuService";
import type { MenuItem } from "@/domain/menu/MenuItem";
import type { DirectusMenuItem } from "./types/DirectusMenuItem";
import { DirectusMenuMapper } from "@/services/mappers/DirectusMenuMapper";

export class DirectusMenuService implements IMenuService {
  async getMenu(slug: string): Promise<MenuItem[]> {
    const rows = (await directus.request(
      readItems("menu_items", {
        filter: {
          menu: { _eq: slug },
          status: { _eq: "published" },
        },
        sort: ["sort"],
        limit: -1,
      })
    )) as DirectusMenuItem[];

    return DirectusMenuMapper.toMenuTree(rows);
  }
}
