//frontend/src/services/directus/DirectusFlipbookService.ts
import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import type { DirectusFlipbook } from "./types/DirectusFlipbook";
import { DirectusFlipbookMapper } from "../mappers/DirectusFlipbookMapper";
import type { IFlipbookService } from "../interfaces/IFlipbookService";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

const FIELDS = [
  "id",
  "title",
  "slug",
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
  async getAll(): Promise<FlipbookDocument[]> {
    const rows = (await directus.request(
      readItems("flipbooks", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
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
}
