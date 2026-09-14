//frontend/src/services/mock/MockAlumniService.ts

import { AlumniStory } from "@/domain/alumni/AlumniStory";
import { IAlumniService, AlumniQueryOptions } from "../interfaces/IAlumniService";

const MOCK_STORIES: AlumniStory[] = [
  {
    id: "1",
    title: "From the classroom to the summit of Kilimanjaro",
    slug: "classroom-to-kilimanjaro",
    excerpt:
      "Ten years after leaving, one former pupil reflects on the trip of a lifetime — and the teacher who first got her into hillwalking.",
    content:
      "<p>Ten years after leaving, one former pupil reflects on the trip of a lifetime — and the teacher who first got her into hillwalking.</p>",
    featuredImage: undefined,
    attendedFrom: "2008-09-01",
    attendedTo: "2015-07-20",
    publishedDate: "2026-08-15",
  },
  {
    id: "2",
    title: "Building a career in engineering",
    slug: "building-a-career-in-engineering",
    excerpt:
      "Now a structural engineer working on bridges across the UK, he credits our design and technology department for setting him on his path.",
    content:
      "<p>Now a structural engineer working on bridges across the UK, he credits our design and technology department for setting him on his path.</p>",
    featuredImage: undefined,
    attendedFrom: "2005-09-01",
    attendedTo: "2012-07-15",
    publishedDate: "2026-05-02",
  },
  {
    id: "3",
    title: "Still singing, years on",
    slug: "still-singing-years-on",
    excerpt:
      "A former choir member on how school music lessons turned into a professional singing career.",
    content:
      "<p>A former choir member on how school music lessons turned into a professional singing career.</p>",
    featuredImage: undefined,
    attendedFrom: "2011-09-01",
    attendedTo: "2018-07-18",
    publishedDate: "2026-02-20",
  },
];

export class MockAlumniService implements IAlumniService {

  async getLatest(options?: AlumniQueryOptions): Promise<AlumniStory[]> {
    const sorted = [...MOCK_STORIES].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

    return options?.limit ? sorted.slice(0, options.limit) : sorted;
  }

  async getBySlug(slug: string): Promise<AlumniStory | null> {
    return MOCK_STORIES.find((story) => story.slug === slug) ?? null;
  }
}
