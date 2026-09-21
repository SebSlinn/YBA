//frontend/src/services/directus/DirectusFlipbookService.ts
import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import type { DirectusFlipbook } from "./types/DirectusFlipbook";
import { DirectusFlipbookMapper } from "../mappers/DirectusFlipbookMapper";
import type {
  IFlipbookService,
  FlipbookQueryOptions,
} from "../interfaces/IFlipbookService";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

const FIELDS = [
  "id",
  "title",
  "slug",
  "category",
  "pdf",
  "status",
  { page_images: ["directus_files_id", "sort"] },
] as const;

// NOTE: `deep` here sorts the page_images M2M junction by its own `sort`
// field so pages come back in the order set in the Directus interface.
// If your junction's sort field isn't literally named `sort` (check
// Settings -> Data Model -> the auto-created junction collection), update
// the key below to match.
const DEEP_SORT = {
  page_images: { _sort: ["sort"] },
} as Record<string, unknown>;

export class DirectusFlipbookService implements IFlipbookService {
  async getAll(options?: FlipbookQueryOptions): Promise<FlipbookDocument[]> {
    const filter: Record<string, unknown> = {
      status: { _eq: "published" },
    };

    if (options?.category) {
      filter.category = { _eq: options.category };
    }

    const rows = (await directus.request(
      readItems("flipbooks", {
        filter,
        // category first so consecutive rows already arrive grouped —
        // PublicationsPage.groupByCategory relies on that ordering,
        // same as DirectusDocumentService/DocumentsPage.
        sort: ["category", "sort"],
        fields: FIELDS as unknown as string[],
        deep: DEEP_SORT,
      })
    )) as DirectusFlipbook[];

    return rows.map(DirectusFlipbookMapper.toFlipbookDocument);
  }

  async getBySlug(slug: string): Promise<FlipbookDocument | null> {
    const rows = (await directus.request(
      readItems("flipbooks", {
        filter: { slug: { _eq: slug } },
        limit: 1,
        fields: FIELDS as unknown as string[],
        deep: DEEP_SORT,
      })
    )) as DirectusFlipbook[];

    return rows[0] ? DirectusFlipbookMapper.toFlipbookDocument(rows[0]) : null;
  }

  async getCategories(): Promise<string[]> {
    const documents = await this.getAll();
    const seen = new Set<string>();
    const categories: string[] = [];

    for (const doc of documents) {
      if (!seen.has(doc.category)) {
        seen.add(doc.category);
        categories.push(doc.category);
      }
    }

    return categories;
  }
}
