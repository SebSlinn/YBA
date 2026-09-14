//frontend/src/services/directus/types/DirectusBlog.ts

export interface DirectusBlog {

  id: number;

  title: string;

  slug: string;

  excerpt: string;

  content: string;

  featured_image: {
    id: string;
    modified_on: string;
  } | null;

  publish_date: string;

  author: string | null;

  status: string;
}
