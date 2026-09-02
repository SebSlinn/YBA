import { Page } from "@/domain/page/Page";

export interface IPageService {
  getBySlug(slug: string, previewToken?: string): Promise<Page | null>;
}
