// Raw shape returned by the Directus SDK for the `pages` collection.
// Field names here must match exactly what the fields are named in
// Directus (see directus-setup.md).
export interface DirectusPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: string;
}
