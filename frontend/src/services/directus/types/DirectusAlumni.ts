//frontend/src/services/directus/types/DirectusAlumni.ts

export interface DirectusAlumni {

  id: number;

  title: string;

  slug: string;

  excerpt: string;

  content: string;

  featured_image: {
    id: string;
    modified_on: string;
  } | null;

  attended_from: string;

  attended_to: string;

  publish_date: string;

  status: string;
}
