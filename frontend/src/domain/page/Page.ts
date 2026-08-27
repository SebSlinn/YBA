/**
 * Domain type for a generic, staff-editable content page
 * (About Us, Headteacher's Statement, Our Values, Key Information, etc.)
 *
 * This is the shape components consume — camelCase, already mapped
 * from Directus's raw snake_case fields by DirectusPageMapper.
 *
 * NOT for structured/tabular content (Curriculum, Results) — those
 * get their own bespoke domain types and collections, per
 * 05-content-pages-feature.md.
 */
export type PageStatus = "draft" | "published" | "archived";

export interface Page {
  id: string;
  slug: string;
  title: string;
  /** Clean HTML from Directus's WYSIWYG field — sanitize before rendering. */
  content: string;
  status: PageStatus;
}
