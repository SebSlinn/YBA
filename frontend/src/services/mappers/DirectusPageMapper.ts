import { DirectusPage } from "../directus/types/DirectusPage";
import { Page, PageStatus } from "@/domain/page/Page";

export class DirectusPageMapper {
  static toPage(raw: DirectusPage): Page {
    return {
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      content: raw.content ?? "",
      status: DirectusPageMapper.mapStatus(raw.status),
    };
  }

  private static mapStatus(status: string): PageStatus {
    if (status === "published" || status === "draft" || status === "archived") {
      return status;
    }
    // Directus's default status field ships with "published" / "draft" /
    // "archived" out of the box — if you rename the options in the admin
    // UI, update this mapping to match.
    return "draft";
  }
}
