//frontend/src/domain/blog/BlogPost.ts

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedDate: string;
  author?: string;
}
