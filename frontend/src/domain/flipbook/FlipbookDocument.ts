//frontend/src/domain/flipbook/FlipbookDocument.ts

/** The shape a flipbook-viewable document takes once mapped out of Directus. */
export interface FlipbookDocument {
  id: string;
  title: string;
  slug: string;
  /** Free-text grouping label used to cluster publications on the index
   *  page, e.g. "Prospectuses", "Newsletters", "Open Day" — mirrors
   *  Document.category on the Documents & Policies feature. */
  category: string;
  /** Direct link to the original PDF — offered as an accessible fallback. */
  pdfUrl: string;
  /** Ordered page images, already resolved to full asset URLs. */
  pageImageUrls: string[];
  status: "published" | "draft" | "archived";
}
