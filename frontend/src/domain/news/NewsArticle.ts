//frontend/src/domain/news/NewsArticle.ts

import { ExternalReference } from "./ExternalReference";
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  publishedDate: string;
  category: string;
  featured: boolean;
  pinned: boolean;
  externalReferences?: ExternalReference[];
}