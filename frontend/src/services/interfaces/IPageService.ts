import { Page } from "@/domain/page/Page";

export interface IPageService {
  getBySlug(slug: string): Promise<Page | null>;
}
