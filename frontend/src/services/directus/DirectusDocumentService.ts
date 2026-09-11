//frontend/src/services/directus/DirectusDocumentService.ts

import { readItems } from "@directus/sdk";
import { directus } from "./client/DirectusClient";
import { DirectusDocument } from "./types/DirectusDocument";
import { DirectusDocumentMapper } from "../mappers/DirectusDocumentMapper";
import {
  IDocumentService,
  DocumentQueryOptions,
} from "../interfaces/IDocumentService";
import { Document } from "@/domain/document/Document";

export class DirectusDocumentService implements IDocumentService {
  async getAll(options?: DocumentQueryOptions): Promise<Document[]> {
    const filter: Record<string, unknown> = {
      status: { _eq: "published" },
    };

    if (options?.category) {
      filter.category = { _eq: options.category };
    }

    const rows = (await directus.request(
      readItems("documents", {
        filter,
        sort: ["category", "sort"],
        fields: ["*", { page: ["slug"] }],
        limit: -1,
      })
    )) as DirectusDocument[];

    return DirectusDocumentMapper.toDocuments(rows);
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
