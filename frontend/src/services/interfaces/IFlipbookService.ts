//frontend/src/services/interfaces/IFlipbookService.ts
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

export interface IFlipbookService {
  getAll(): Promise<FlipbookDocument[]>;
  getBySlug(slug: string): Promise<FlipbookDocument | null>;
}
