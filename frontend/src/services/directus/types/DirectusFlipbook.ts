//frontend/src/services/directus/types/DirectusFlipbook.ts

/**
 * One row of the "Multiple Files" (M2M) junction Directus creates for the
 * `page_images` field. The field name on the junction row is always
 * `directus_files_id` regardless of the parent collection's name — but
 * double-check the junction collection's own name and its `sort` field
 * name in Settings -> Data Model after creating `page_images`, since
 * that's what the `deep` query in DirectusFlipbookService relies on.
 */
export interface DirectusFlipbookPageImage {
  directus_files_id: string;
  sort?: number | null;
}

export interface DirectusFlipbook {
  id: string;
  title: string;
  slug: string;
  // Free-text grouping field, same convention as documents.category.
  // Nullable because it's a new field on an existing collection — rows
  // created before it existed will come back as null until edited.
  category: string | null;
  pdf: string | null; // Directus file UUID, or null if not yet uploaded
  page_images: DirectusFlipbookPageImage[];
  status: "published" | "draft" | "archived";
  sort: number | null;
}
