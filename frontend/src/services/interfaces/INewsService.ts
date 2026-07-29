//frontend/src/services/interfaces/INewsService.ts
import { NewsArticle } from "@/types/news";

export interface NewsQueryOptions {
  limit?: number;
  featured?: boolean;
  pinned?: boolean;
  category?: string;
}

export interface INewsService {
  getLatest(options?: NewsQueryOptions): Promise<NewsArticle[]>;

  getBySlug(slug: string): Promise<NewsArticle | null>;
}