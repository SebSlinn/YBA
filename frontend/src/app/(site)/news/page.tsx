// frontend/src/app/(site)/news/page.tsx
//
// Your real file — only the <main> className changed, swapping py-22 for
// pt-[130px] pb-22, so News gets the same top clearance from the 82px
// fixed header as Blog now has. Everything else is exactly what you
// pasted, unchanged.

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
    <main className="mx-auto max-w-7xl px-6 pt-[130px] pb-22">

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
