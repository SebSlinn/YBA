// src/components/landing/LatestNewsList.tsx
//
// Colours flipped to sit on the News section's new navy background:
// heading, title and hover state now white/light rather than the
// original dark-on-light palette (which assumed a white/light section
// background and would be unreadable on navy).

import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/types/news";

interface LatestNewsListProps {
  articles: NewsArticle[];
}

export default function LatestNewsList({
  articles,
}: LatestNewsListProps) {

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Latest News
      </h2>

      <div className="space-y-5">

        {articles.map((article) => {

          const formattedDate = new Date(
            article.publishedDate
          ).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="
                group
                flex
                gap-4
                rounded-lg
                p-3
                transition
                hover:bg-white/10
              "
            >

              {article.featuredImage && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">

                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="
                      object-cover
                      transition
                      duration-300
                      group-hover:scale-105
                    "
                  />

                </div>
              )}

              <div>

                <h3 className="
                  font-semibold
                  leading-tight
                  text-white
                  group-hover:text-[var(--yba-teal,#18B8C9)]
                ">
                  {article.title}
                </h3>


                <p className="mt-1 text-sm text-white/70">
                  {formattedDate}
                </p>


                <p className="mt-2 line-clamp-2 text-sm text-white/70">
                  {article.summary}
                </p>

              </div>

            </Link>
          );
        })}

      </div>
    </>
  );
}
