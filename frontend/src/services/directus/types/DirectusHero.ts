// frontend/src/services/directus/types/DirectusHero.ts
//
// Raw shape returned by Directus for a `hero_slides` collection (create
// this collection in Directus first — see SETUP.md).
//
// `image` is a Many-to-One relation to directus_files. We pull:
//   - id + modified_on  → same cache-busting fix already used in
//     DirectusEvent.featured_image (a focal-point-only edit doesn't change
//     the file's cached bytes, so the asset URL needs a change of its own
//     to force a refresh).
//   - width + height     → needed to convert Directus's focal point (stored
//     as pixel coordinates in the source image) into a CSS object-position
//     percentage.
//   - focal_point_x/y    → set by clicking a focus point in Directus's file
//     editor; null until someone has done that for a given photo.
//
// NOTE: `status` values below are a guess ("Draft" | "Published" |
// "Archived") — Event actually uses "Draft" | "Scheduled" | "Archived", so
// don't assume this matches until you've set the real options on the Hero
// collection in Directus and confirmed against DirectusHeroService's filter.

export interface DirectusHero {
  id: string;
  heading: string | null;
  subheading: string | null;
  alt_text: string | null;
  image: {
    id: string;
    modified_on: string;
    width: number | null;
    height: number | null;
    focal_point_x: number | null;
    focal_point_y: number | null;
  } | null;
  sort: number | null;
  status: "Draft" | "Published" | "Archived" | "draft" | "published" | "archived";
}
