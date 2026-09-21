//frontend/src/services/mock/MockFlipbookService.ts
import type {
  IFlipbookService,
  FlipbookQueryOptions,
} from "../interfaces/IFlipbookService";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

const MOCK_FLIPBOOKS: FlipbookDocument[] = [
  {
    id: "mock-1",
    title: "Prospectus 2023/24",
    slug: "prospectus",
    category: "Prospectuses",
    pdfUrl: "/mock/prospectus.pdf",
    pageImageUrls: Array.from(
      { length: 6 },
      (_, i) => `/mock/prospectus-page-${i + 1}.jpg`
    ),
    status: "published",
  },
];

export class MockFlipbookService implements IFlipbookService {
  async getAll(options?: FlipbookQueryOptions): Promise<FlipbookDocument[]> {
    return MOCK_FLIPBOOKS.filter(
      (doc) =>
        doc.status === "published" &&
        (!options?.category || doc.category === options.category)
    );
  }

  async getBySlug(slug: string): Promise<FlipbookDocument | null> {
    return MOCK_FLIPBOOKS.find((doc) => doc.slug === slug) ?? null;
  }

  async getCategories(): Promise<string[]> {
    const seen = new Set<string>();
    const categories: string[] = [];
    for (const doc of MOCK_FLIPBOOKS) {
      if (doc.status === "published" && !seen.has(doc.category)) {
        seen.add(doc.category);
        categories.push(doc.category);
      }
    }
    return categories;
  }
}
