import { MenuItem } from "@/domain/menu/MenuItem";
import { DirectusMenuItem } from "../directus/types/DirectusMenuItem";

function resolveHref(row: DirectusMenuItem): string | undefined {
  if (row.link_type === "external") return row.external_url ?? undefined;
  if (row.link_type === "internal") return row.path ?? undefined;
  return undefined; // "none" (or unset) — a pure dropdown-only heading
}

export class DirectusMenuMapper {
  /** Single-row mapping, no nesting — used internally by toMenuTree. */
  static toMenuItem(row: DirectusMenuItem): MenuItem {
    return {
      id: row.id,
      label: row.label,
      href: resolveHref(row),
      openInNewTab: Boolean(row.open_in_new_tab),
      children: [],
    };
  }

  /**
   * Builds the two-level tree Header.tsx renders, from a flat list of
   * rows already sorted by `sort` ascending (the Directus query does
   * this) — order here is preserved by insertion order, no extra sort
   * step needed.
   */
  static toMenuTree(rows: DirectusMenuItem[]): MenuItem[] {
    const byId = new Map<string, MenuItem>();
    for (const row of rows) byId.set(row.id, DirectusMenuMapper.toMenuItem(row));

    const roots: MenuItem[] = [];
    for (const row of rows) {
      const node = byId.get(row.id)!;
      const parent = row.parent ? byId.get(row.parent) : undefined;
      if (parent) {
        // This will happily build a tree deeper than two levels if
        // someone nests a child under a child in Directus, but
        // Header.tsx only ever renders top-level items and their direct
        // children — so anything nested a level deeper just won't show
        // up. Keep menu items to two levels in Directus to avoid
        // confusion.
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
}
