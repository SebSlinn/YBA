//frontend/src/services/mock/MockBlogService.ts

import { BlogPost } from "@/domain/blog/BlogPost";
import { IBlogService, BlogQueryOptions } from "../interfaces/IBlogService";

const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Welcome back to a new school year",
    slug: "welcome-back-new-school-year",
    excerpt:
      "We're excited to kick off another year full of learning, sport and creativity — here's what's new around school.",
    content:
      "<p>We're excited to kick off another year full of learning, sport and creativity — here's what's new around school.</p>",
    featuredImage: undefined,
    publishedDate: "2026-09-01",
    author: "Head Teacher",
  },
  {
    id: "2",
    title: "Our Year 6 residential trip",
    slug: "year-6-residential-trip",
    excerpt:
      "Year 6 spent three days away building confidence, teamwork and a few muddy memories.",
    content:
      "<p>Year 6 spent three days away building confidence, teamwork and a few muddy memories.</p>",
    featuredImage: undefined,
    publishedDate: "2026-07-10",
    author: "Mrs Evans",
  },
  {
    id: "3",
    title: "Celebrating this term's art show",
    slug: "art-show-celebration",
    excerpt:
      "Pupils' artwork lined the halls this week — a look back at some of our favourite pieces.",
    content:
      "<p>Pupils' artwork lined the halls this week — a look back at some of our favourite pieces.</p>",
    featuredImage: undefined,
    publishedDate: "2026-06-20",
    author: "Mr Jones",
  },
];

export class MockBlogService implements IBlogService {

  async getLatest(options?: BlogQueryOptions): Promise<BlogPost[]> {
    const sorted = [...MOCK_POSTS].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

    return options?.limit ? sorted.slice(0, options.limit) : sorted;
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return MOCK_POSTS.find((post) => post.slug === slug) ?? null;
  }
}
