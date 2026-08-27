import { IPageService } from "../interfaces/IPageService";
import { Page } from "@/domain/page/Page";

const MOCK_PAGES: Page[] = [
  {
    id: "mock-about-us",
    slug: "about-us",
    title: "About Us",
    content:
      "<p>Ysgol Bryn Alyn is a school in Gwersyllt, Wrexham, dedicated to helping every pupil <strong>Dream, Reach, Achieve</strong>.</p><p>This is placeholder content from MockPageService — replace once the real Directus pages collection is wired up.</p>",
    status: "published",
  },
  {
    id: "mock-our-values",
    slug: "our-values",
    title: "Our Values",
    content:
      "<p>Placeholder values content. Swap this for the real Directus-backed page once DirectusPageService is live in ServiceFactory.</p>",
    status: "published",
  },
];

export class MockPageService implements IPageService {
  async getBySlug(slug: string): Promise<Page | null> {
    const page = MOCK_PAGES.find((p) => p.slug === slug);
    return page ?? null;
  }
}
