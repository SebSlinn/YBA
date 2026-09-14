//src/domain/quicklink/QuickLink.ts

export interface QuickLink {
  id: string;
  label: string;
  href: string;
  openInNewTab: boolean;
  /** Resolved Directus asset URL, or null if the link has no image set. */
  image: string | null;
  /** Hex colour (e.g. "#D5008F") used as the semi-transparent tile tint. */
  colour: string;
}
