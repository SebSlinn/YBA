//frontend/src/services/mappers/DirectusDocumentMapper.ts

import { Document } from "@/domain/document/Document";
import { DirectusDocument } from "../directus/types/DirectusDocument";
import { getAssetUrl } from "../directus/client/DirectusClient";

export class DirectusDocumentMapper {
  static toDocument(raw: DirectusDocument): Document {
    const fileId =
      typeof raw.file === "string" ? raw.file : raw.file?.id ?? undefined;

    const pageSlug =
      typeof raw.page === "string" ? undefined : raw.page?.slug ?? undefined;

    return {
      id: raw.id,
      title: raw.title,
      category: raw.category,
      documentType: raw.document_type,
      fileUrl: fileId ? getAssetUrl(fileId) : undefined,
      externalUrl: raw.external_url ?? undefined,
      pageSlug,
      summary: raw.summary ?? undefined,
      reviewDate: raw.review_date ? new Date(raw.review_date) : undefined,
      expiryDate: raw.expiry_date ? new Date(raw.expiry_date) : undefined,
      sort: raw.sort ?? 0,
      status: raw.status,
    };
  }

  static toDocuments(rows: DirectusDocument[]): Document[] {
    return rows.map(DirectusDocumentMapper.toDocument);
  }
}
