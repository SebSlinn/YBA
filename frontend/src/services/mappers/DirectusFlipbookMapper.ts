//frontend/src/services/mappers/DirectusFlipbookMapper.ts
import { getAssetUrl } from "../directus/client/DirectusClient";
import type { DirectusFlipbook } from "../directus/types/DirectusFlipbook";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

export class DirectusFlipbookMapper {
  static toFlipbookDocument(row: DirectusFlipbook): FlipbookDocument {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      pdfUrl: row.pdf ? getAssetUrl(row.pdf) : "",
      pageImageUrls: (row.page_images ?? []).map((p) =>
        getAssetUrl(p.directus_files_id)
      ),
      status: row.status,
    };
  }
}
