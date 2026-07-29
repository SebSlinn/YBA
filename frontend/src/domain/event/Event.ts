//frontend/src/domain/events/Event.ts

export interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: string;

  startDate: Date;
  endDate?: Date;

  location?: string;

  category: string;

  featured: boolean;

  status: "Draft" | "Scheduled" | "Archived";
}