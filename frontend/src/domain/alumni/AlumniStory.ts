//frontend/src/domain/alumni/AlumniStory.ts

export interface AlumniStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  attendedFrom: string;
  attendedTo: string;
  publishedDate: string;
}
