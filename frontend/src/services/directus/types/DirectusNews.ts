// src/services/directus/types/DirectusNews.ts

import { ExternalReference } from "@/domain/news/ExternalReference";

export interface DirectusNews {

  id: number;

  title: string;

  slug: string;

  summary: string;

  content: string;

  featured_image: string;

  publish_date: string;

  category: string;

  featured: boolean | null;

  pinned: boolean | null;

  status: string;

externalReferences?: ExternalReference[];
}