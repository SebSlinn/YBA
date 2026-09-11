//frontend/src/services/directus/types/DirectusDocument.ts

/**
 * Raw shape of a row from the `documents` Directus collection, as
 * returned by directus.request(readItems("documents", {...})).
 * snake_case, matching the field names created in Directus — see
 * docs/08-documents-feature.md for the collection setup.
 */
export interface DirectusDocument {
  id: string;
  title: string;
  category: string;
  document_type: "file" | "link" | "page";

  // Directus file field — uuid, or an expanded object when the
  // query asks for file.id (kept as `string | { id: string } | null`
  // to match how other mappers in this codebase handle file relations).
  file: string | { id: string } | null;

  external_url: string | null;

  // M2O relation to the generic `pages` collection. Query with
  // fields: ["page.slug"] so this comes back expanded rather than as
  // a bare id.
  page: { slug: string } | string | null;

  summary: string | null;
  review_date: string | null; // ISO date string, e.g. "2026-09-01"
  expiry_date: string | null;
  sort: number | null;
  status: "draft" | "published" | "archived";
}
