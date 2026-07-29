//frontend/src/services/directus/types/DirectusEvent.ts


export interface DirectusEvent {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    featured_image: string;

    start_date: string;
    end_date: string;

    location?: string;

    category: string;

    featured: boolean;

    status: "Draft" | "Scheduled" | "Archived";
}