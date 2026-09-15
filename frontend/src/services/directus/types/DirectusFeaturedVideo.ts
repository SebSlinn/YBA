//src/services/directus/types/DirectusFeaturedVideo.ts
//
// Raw shape of a row in the `featured_videos` collection. `vimeo_url` is
// whatever an editor pastes from Vimeo's own "Share" link (e.g.
// https://vimeo.com/123456789) — not the <iframe> embed code — the mapper
// extracts the numeric ID from it.

export interface DirectusFeaturedVideo {
  id: string;
  title: string;
  vimeo_url: string;
  sort: number | null;
  status: "published" | "draft" | "archived";
}
