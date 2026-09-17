//frontend/src/services/mock/MockFlipbookService.ts
import type { IFlipbookService } from "../interfaces/IFlipbookService";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

const MOCK_FLIPBOOKS: FlipbookDocument[] = [
  {
    id: "mock-1",
    title: "Prospectus 2023/24",
    slug: "prospectus",
    pdfUrl: "/mock/prospectus.pdf",
    pageImageUrls: Array.from(
      { length: 6 },
      (_, i) => `/mock/prospectus-page-${i + 1}.jpg`
    ),
    status: "published",
  },
];

export class MockFlipbookService implements IFlipbookService {
  async getAll(): Promise<FlipbookDocument[]> {
    return MOCK_FLIPBOOKS.filter((doc) => doc.status === "published");
  }

  async getBySlug(slug: string): Promise<FlipbookDocument | null> {
    return MOCK_FLIPBOOKS.find((doc) => doc.slug === slug) ?? null;
  }
}
