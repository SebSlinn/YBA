// frontend/src/app/(site)/news/page.tsx

import { Metadata } from "next";
import NewsCard from "@/components/news/NewsCard";
import { NewsService } from "@/services/ServiceFactory";

export const metadata: Metadata = {
  title: "School News | Ysgol Bryn Alyn",
  description:
    "Latest news, events and updates from Ysgol Bryn Alyn.",
};

export default async function NewsPage() {

  const articles = await NewsService.getLatest();

  return (
    <main className="mx-auto max-w-7xl px-6 py-22">

      <h1 className="mb-8 text-4xl font-bold">
        School News
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {articles.map(article => (

          <NewsCard
            key={article.id}
            article={article}
          />

        ))}

      </div>

    </main>
  );
}