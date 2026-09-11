// frontend/src/services/directus/mappers/DirectusHeroMapper.ts
//
// Converts Directus's raw shape into the domain HeroSlide — this is what
// keeps focal-point pixel math and cache-busting out of every component.

import { HeroSlide } from "@/domain/hero/HeroSlide";
import { DirectusHero } from "../directus/types/DirectusHero";
import { getAssetUrl } from "../directus/client/DirectusClient";

type DirectusHeroImage = NonNullable<DirectusHero["image"]>;

// Plain center-crop — same as object-fit: cover with no object-position
// override. Used whenever a photo has no focal point set yet, or we're
// missing the dimensions needed to convert one.
const DEFAULT_FOCAL_POINT = { x: 50, y: 50 };

function resolveImageUrl(image: DirectusHero["image"]): string {
  if (!image) return "";

  const base = getAssetUrl(image.id);

  // Directus's asset cache keys off the file's bytes, not its metadata —
  // adjusting only the focal point doesn't invalidate it, so the browser/
  // CDN keeps serving the old crop unless the URL itself changes. Same fix
  // already applied to DirectusEvent.featured_image.
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}modified=${encodeURIComponent(image.modified_on)}`;
}

function resolveFocalPoint(image: DirectusHero["image"]): { x: number; y: number } {
  if (!image || image.focal_point_x == null || image.focal_point_y == null) {
    return DEFAULT_FOCAL_POINT;
  }
  if (!image.width || !image.height) {
    // Can't convert pixel coordinates to a percentage without the source
    // dimensions — fall back rather than risk a bad crop.
    return DEFAULT_FOCAL_POINT;
  }

  // Directus stores focal_point_x/y as pixel coordinates within the
  // original image, not a percentage — convert for CSS object-position.
  return {
    x: Math.round((image.focal_point_x / image.width) * 100),
    y: Math.round((image.focal_point_y / image.height) * 100),
  };
}

export class DirectusHeroMapper {
  static toHeroSlide(raw: DirectusHero): HeroSlide {
    return {
      id: raw.id,
      heading: raw.heading ?? undefined,
      subheading: raw.subheading ?? undefined,
      alt: raw.alt_text ?? raw.heading ?? undefined,
      image: resolveImageUrl(raw.image),
      focalPoint: resolveFocalPoint(raw.image),
      order: raw.sort ?? 0,
    };
  }
}
