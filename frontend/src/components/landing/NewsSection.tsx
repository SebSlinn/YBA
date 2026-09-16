//src/components/landing/NewsSection.tsx

import FeaturedNews from "./FeaturedNews";
import LatestNewsList from "./LatestNewsList";
import { NewsService } from "@/services/ServiceFactory";
import Link from "next/link";

export default async function NewsSection() {

  const featured = await NewsService.getLatest({
    featured: true,
    limit: 2,
  });

  const latest = await NewsService.getLatest({
    featured: false,
    limit: 5,
  });

  return (
    <section className="relative overflow-hidden bg-[var(--yba-navy,#2F3559)]">

      {/* Navy fade — same treatment as News/QuickLinks above it
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "var(--header-height, 64px)",
          background:
            "linear-gradient(to bottom, rgba(var(--yba-navy-rgb, 47, 53, 89),1) 0%, rgba(var(--yba-navy-rgb, 47, 53, 89),0) 100%)",
        }}
      />*/}

      {/* Magenta Bar — this section's accent colour, cycling back round from the hero */}
      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-magenta,#D5008F)]" />

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-10 lg:grid-cols-3">

          {/* Flipped to white text now the section background is navy —
              was `var(--yba-navy)`, which would disappear against navy.
              NOTE: FeaturedNews.tsx itself wasn't part of this change — if
              it sets its own text colours internally (rather than
              inheriting this wrapper's colour), it needs the same flip. */}
          <div className="lg:col-span-2" style={{ color: "var(--yba-white, #FFFFFF)" }}>
            <FeaturedNews articles={featured} />
          </div>

          <aside>
            <LatestNewsList articles={latest} />
          </aside>

        </div>
        <div className="mt-10 text-center">
          <Link
            href="/news"
            className="inline-flex items-center rounded-md bg-[var(--yba-teal,#18B8C9)] px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View all news →
          </Link>
        </div>

      </div>

    </section>
  );
}
