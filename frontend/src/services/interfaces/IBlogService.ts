//frontend/src/services/interfaces/IBlogService.ts
import { BlogPost } from "@/domain/blog/BlogPost";

export interface BlogQueryOptions {
  limit?: number;
}

export interface IBlogService {
  getLatest(options?: BlogQueryOptions): Promise<BlogPost[]>;

  getBySlug(slug: string): Promise<BlogPost | null>;
}
