// src/services/directus/client/DirectusClient.ts

import { createDirectus, rest } from "@directus/sdk";

const url =
  process.env.NEXT_PUBLIC_DIRECTUS_URL ??
  "http://localhost:8055";

export const directus = createDirectus(url).with(rest());

export interface AssetOptions {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "inside" | "outside";
  quality?: number;
  /**
   * Cache-busting value — pass the source file's `modified_on` timestamp
   * (or any string that changes when the file/its focal point changes).
   * Directus caches each unique width/height/fit/etc. combination
   * indefinitely, so without this, editing a focal point on an already-
   * viewed image won't visibly update until someone manually changes a
   * dimension. Appending `&v=<modified_on>` forces a fresh transform any
   * time the underlying file record changes, while still caching normally
   * for untouched files.
   */
  cacheBust?: string;
}

export function getAssetUrl(fileId: string, options?: AssetOptions): string {
  const params = new URLSearchParams();

  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.fit) params.set("fit", options.fit);
  if (options?.quality) params.set("quality", String(options.quality));
  if (options?.cacheBust) params.set("v", options.cacheBust);

  const query = params.toString();
  return `${url}/assets/${fileId}${query ? `?${query}` : ""}`;
}