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
}

export function getAssetUrl(fileId: string, options?: AssetOptions): string {
  const params = new URLSearchParams();

  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.fit) params.set("fit", options.fit);
  if (options?.quality) params.set("quality", String(options.quality));

  const query = params.toString();
  return `${url}/assets/${fileId}${query ? `?${query}` : ""}`;
}