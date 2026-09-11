/**
 * Raw shape of a row from Directus's `menu_items` collection. Adjust
 * field names here if you set the collection up slightly differently —
 * this is the only place that needs to know Directus's naming.
 */
export type DirectusMenuItem = {
  id: string;
  label: string;
  link_type: "internal" | "external" | "none" | null;
  path: string | null;
  external_url: string | null;
  open_in_new_tab: boolean | null;
  parent: string | null;
  sort: number | null;
  status: string;
};
