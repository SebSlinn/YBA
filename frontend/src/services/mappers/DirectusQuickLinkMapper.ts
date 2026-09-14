//src/services/mappers/DirectusQuickLinkMapper.ts

import { QuickLink } from "@/domain/quicklink/QuickLink";
import { DirectusQuickLink } from "../directus/types/DirectusQuickLink";
import { getAssetUrl } from "../directus/client/DirectusClient";

// Fallback tint when an editor hasn't set a colour yet — brand navy, so an
// incomplete row still renders sensibly instead of an unstyled tile.
const DEFAULT_TILE_COLOUR = "#2F3559";

export class DirectusQuickLinkMapper {
  static toQuickLink(row: DirectusQuickLink): QuickLink {
    const href =
      row.link_type === "external" ? row.external_url ?? "#" : row.path ?? "#";

    return {
      id: row.id,
      label: row.label,
      href,
      // Internal links always open in the same tab regardless of the
      // field's stored value — only external links respect it.
      openInNewTab: row.link_type === "external" ? !!row.open_in_new_tab : false,
      image: row.image ? getAssetUrl(row.image) : null,
      colour: row.colour ?? DEFAULT_TILE_COLOUR,
    };
  }
}
