//frontend/src/services/interfaces/IFlipbookService.ts
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

export interface FlipbookQueryOptions {
  category?: string;
}

export interface IFlipbookService {
  /** All published publications, optionally filtered to one category,
   *  ordered by category then sort — mirrors IDocumentService.getAll. */
  getAll(options?: FlipbookQueryOptions): Promise<FlipbookDocument[]>;
  getBySlug(slug: string): Promise<FlipbookDocument | null>;
  /** Distinct category labels present across published publications, in
   *  first-seen / sort order — used to render the category groups
   *  without hardcoding a category list in the frontend. */
  getCategories(): Promise<string[]>;
}
