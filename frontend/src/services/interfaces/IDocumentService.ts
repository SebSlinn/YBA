//frontend/src/services/interfaces/IDocumentService.ts

import { Document } from "@/domain/document/Document";

export interface DocumentQueryOptions {
  category?: string;
}

/**
 * Everything a component is allowed to ask for on the Documents &
 * Policies page. Components depend on this interface only — never on
 * DirectusDocumentService or MockDocumentService directly.
 */
export interface IDocumentService {
  /** All published documents, optionally filtered to one category,
   *  ordered by category then sort. */
  getAll(options?: DocumentQueryOptions): Promise<Document[]>;

  /** Distinct category labels present across published documents, in
   *  first-seen / sort order — used to render the category groups
   *  without hardcoding a category list in the frontend. */
  getCategories(): Promise<string[]>;
}
