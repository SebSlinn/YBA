// frontend/src/components/news/NewsCard.tsx

import Image from "next/image";
import Link from "next/link";
import { NewsArticle } from "@/types/news";

interface Props {
  article: NewsArticle;
}

export default function NewsCard({ article }: Props) {

  const formattedDate = new Date(
    article.publishedDate
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">

      <Link href={`/news/${article.slug}`}>

        <div className="relative h-56 w-full overflow-hidden">

          <Image
            priority
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />

        </div>

      </Link>

      <div className="p-6">

        <div className="flex items-center justify-between">

          <p className="text-sm font-medium text-gray-500">
            {article.category}
          </p>

          {article.pinned && (
            <span className="text-sm font-semibold text-yellow-600">
              Pinned
            </span>
          )}

        </div>


        <p className="mt-2 text-sm text-gray-500">
          {formattedDate}
        </p>


        <h3 className="mt-3 text-xl font-bold">
          {article.title}
        </h3>


        <p className="mt-3 text-gray-600">
          {article.summary}
        </p>


        <Link
          href={`/news/${article.slug}`}
          className="mt-5 inline-block font-semibold text-[var(--yba-teal,#18B8C9)]  hover:underline"
        >
          Read more →
        </Link>

      </div>

    </article>
  );
}