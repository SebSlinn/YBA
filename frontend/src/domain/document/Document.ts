//frontend/src/domain/document/Document.ts

/**
 * How a document's content is actually reached. Drives which of
 * fileUrl / externalUrl / pageSlug is populated on a given Document.
 */
export type DocumentType = "file" | "link" | "page";

/**
 * A single entry on the Documents & Policies page — a policy, form,
 * or reference document, regardless of where its content actually
 * lives (an uploaded PDF, an external link, or a structured internal
 * page).
 */
export interface Document {
  id: string;
  title: string;

  /** Free-text grouping label used to cluster documents on the page,
   *  e.g. "Safeguarding", "Curriculum & Exams", "General". */
  category: string;

  documentType: DocumentType;

  /** Populated when documentType === "file": direct URL to the
   *  uploaded PDF (or other file) asset. */
  fileUrl?: string;

  /** Populated when documentType === "link": an external URL. */
  externalUrl?: string;

  /** Populated when documentType === "page": the slug of the
   *  internal generic `pages` entry that holds this document's
   *  structured content (rendered at /[slug]). */
  pageSlug?: string;

  /** Optional one-line description shown under the title. */
  summary?: string;

  /** Editorial-only — when this policy was last reviewed. Not shown
   *  publicly by default. */
  reviewDate?: Date;

  /** Editorial-only — when this policy is next due for review /
   *  expires. Not shown publicly by default; captured so it's
   *  available for a "due for review" admin view later without a
   *  schema change. */
  expiryDate?: Date;

  sort: number;
  status: "draft" | "published" | "archived";
}
