//frontend/src/components/landing/FeaturedNews.tsx

import NewsCard from "@/components/news/NewsCard";
import { NewsArticle } from "@/types/news";

interface FeaturedNewsProps {
  articles: NewsArticle[];
}

export default function FeaturedNews({ articles }: FeaturedNewsProps) {
  return (
    <>
      <h2 className="mb-6 text-3xl font-bold " >
        Featured News
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </>
  );
}