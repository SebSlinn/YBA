// frontend/src/domain/hero/HeroSlide.ts
//
// Domain type — what components actually consume. No Directus field names,
// no raw ids: the mapper has already resolved the image to a full,
// cache-busted URL and converted the focal point into a CSS-ready
// percentage pair.

export interface HeroSlide {
  id: string;
  heading?: string;
  subheading?: string;

  /** Accessible alt text — distinct from `heading` (a marketing line isn't
   *  a description). Falls back to `heading`, then a generic string, if
   *  Directus's alt_text field is empty. */
  alt?: string;

  /** Fully-resolved, cache-busted asset URL — ready to hand to next/image. */
  image: string;

  /**
   * 0–100, for CSS `object-position`. Defaults to { x: 50, y: 50 }
   * (plain center-crop) when no focal point has been set on the Directus
   * file yet.
   */
  focalPoint: {
    x: number;
    y: number;
  };

  /** Carousel order (from Directus's `sort` field). */
  order: number;
}
