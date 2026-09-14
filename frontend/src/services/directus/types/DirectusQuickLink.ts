//src/services/directus/types/DirectusQuickLink.ts
//
// Raw shape of a row in the `quick_links` collection. Mirrors the
// internal/external link pattern already used by `menu_items` (link_type +
// Directus field Conditions so `path` only shows when link_type is
// "internal" and `external_url` only shows when it's "external"), plus an
// Image field (relational to directus_files — comes back as the file's
// UUID string) and a Colour field (hex string) for the tile tint.

export interface DirectusQuickLink {
  id: string;
  label: string;
  link_type: "internal" | "external";
  path: string | null;
  external_url: string | null;
  open_in_new_tab: boolean;
  image: string | null;
  colour: string | null;
  sort: number | null;
  status: "published" | "draft" | "archived";
}
