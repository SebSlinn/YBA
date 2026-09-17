//frontend/src/domain/flipbook/FlipbookDocument.ts

/** The shape a flipbook-viewable document takes once mapped out of Directus. */
export interface FlipbookDocument {
  id: string;
  title: string;
  slug: string;
  /** Direct link to the original PDF — offered as an accessible fallback. */
  pdfUrl: string;
  /** Ordered page images, already resolved to full asset URLs. */
  pageImageUrls: string[];
  status: "published" | "draft" | "archived";
}
