//frontend/src/services/Mock/MockNewsService.ts

import { INewsService, NewsQueryOptions } from "../interfaces/INewsService";
import { NewsArticle } from "@/types/news";

const articles: NewsArticle[] = [
  {
    id: "1",
    title: "Secondary School of the year",
    slug: "sports-day-success",
    summary: "Leader Education Awards: Bryn Alyn is Secondary School of the Year",
    content: `
      <p> This year's winner of the prize was Gwersyllt's Ysgol Bryn Alyn.

The nomination form received for the school read: "Ysgol Bryn Alyn (YBA) is a dynamic and inclusive school community dedicated to achieving excellence for its pupils, staff, and families. Through innovative teaching, enriching opportunities, and a relentless focus on wellbeing, YBA has created a nurturing environment where pupils thrive academically, socially, and personally. 

RELATED READING: Here's the full list of winners from the 2025 Leader Education Awards

"From pioneering mentoring programmes to creating spaces for wellbeing, YBA exemplifies the values of resilience, inclusion, and ambition."

Another nomination form added: "Ysgol Bryn Alyn is a fantastic school it is a friendly and welcoming school. The staff know all the pupils by first name and everyone is made to feel inclusive."

A third nomination added: "Ysgol Bryn Alyn is much more than a school; it is a nurturing community where students thrive academically and personally.

"The remarkable achievements in academic results, attendance, community engagement, and mental health initiatives make Ysgol Bryn Alyn a deserving candidate for the Secondary School of the Year award. .</p>


    `,
    featuredImage: "/images/news/LeaderSecondaryOfYear.jpg",
    publishedDate: "2026-07-20",
    category: "Sport",
    pinned: true,
    featured: true,
  },

  {
    id: "2",
    title: "National conservation award",
    slug: "national-conservation-award",
    summary: "Winners announced at the National Conservation Education Awards 2026.",
    content: `
      <p>Outstanding Conservation Educator- Secondary Winner: Mandy Townson and Tracey Thompson, Ysgol Bryn Alyn
Mandy Townsend and Tracey Thompson are being recognised for their outstanding contribution to creating and developing The Big Shed at Ysgol Bryn Alyn — a transformative outdoor learning, wellbeing and conservation space that has positively impacted young people, families and the wider community. Through their dedication, they have created a safe and inclusive environment where pupils can connect with nature, build confidence and develop leadership skills through outdoor and conservation-focused activities. Their youth-led approach has empowered young people to deliver meaningful community projects, while partnerships with local organisations have strengthened wellbeing, conservation and community engagement. Mandy and Tracy’s compassion, leadership and commitment have made The Big Shed a valued space where young people feel supported, inspired and able to thrive.</p>
    `,
    featuredImage: "/images/news/p1102431-2.jpg",
    publishedDate: "2026-07-15",
    category: "Events",
    pinned: false,
    featured: false,
   externalReferences: [
  {
    id: "1",
    title: "Read the newspaper article",
    url: "https://www.chesterzoo.org/news/winners-announced-at-the-national-conservation-award",
  },

      {   
    id: "2",
        title: "National Conservation Education Awards",
        url: "https://www.chesterzoo.org/news/winners-announced-at-the-national-conservation-education-awards-2026"
      }
    ],
  },


  {
    id: "3",
    title: "Team of the Year award",
    slug: "team-of-the-year-award",
    summary: "Ysgol Bryn Alyn School Council wins Class/Team of the Year",
    content: `
      <p>The School Council at Ysgol Bryn Alyn received the honour in recognition of its work championing pupil voice, environmental action and community partnerships.</p>
      <p> Speaking after receiving the award, council member Lilly-Belle Bush said the recognition meant a great deal to the group.

“It feels phenomenal,” she said. “It’s really nice to be recognised for all the work we’ve done around the school.”

She added that the council spends a significant amount of time working on projects and representing pupils, but that "it’s really important that we keep doing what we’re doing so everybody’s voice is heard.” </p>

    `,
    featuredImage: "/images/news/Leader2.jpg",
    publishedDate: "2026-07-15",
    category: "Events",
    pinned: false,
    featured: false,
  },

];
export class MockNewsService implements INewsService {

  async getLatest(
    options?: NewsQueryOptions
  ): Promise<NewsArticle[]> {

    let result = [...articles];

    if (options?.featured !== undefined) {
      result = result.filter(
        article => article.featured === options.featured
      );
    }

    // Sort newest first
    result.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  async getBySlug(
    slug: string
  ): Promise<NewsArticle | null> {

    return (
      articles.find(article => article.slug === slug) ?? null
    );
  }
}