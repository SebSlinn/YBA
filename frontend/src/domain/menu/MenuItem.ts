/**
 * Domain shape for a single menu entry. Components never see Directus's
 * field names (link_type, external_url, parent, sort, ...) — only this.
 */
export interface MenuItem {
  id: string;
  label: string;
  /** Undefined for a top-level item that exists only to hold a dropdown. */
  href?: string;
  openInNewTab: boolean;
  /** Always an array — empty for a leaf link, non-empty for a dropdown. */
  children: MenuItem[];
}
