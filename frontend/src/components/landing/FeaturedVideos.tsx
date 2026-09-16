//src/components/landing/FeaturedVideos.tsx
//
// Directus-backed (featured_videos collection) via IFeaturedVideoService.
// All-navy section (same as QuickLinks, sits directly below it on the
// homepage), white "Featured Video" heading with a short YBA-gold
// underline beneath it, up to two videos side by side on wider screens
// and stacked on mobile.
//
// The bottom accent bar mirrors QuickLinks' own teal one — same 4px
// absolutely-positioned bar, just gold here, marking the boundary with
// the News section below.

import { getFeaturedVideoService } from "@/services/ServiceFactory";
import FeaturedVideoEmbed from "./FeaturedVideoEmbed";

export default async function FeaturedVideos() {
  const videos = await getFeaturedVideoService().getFeaturedVideos();
  const playable = videos.filter((v) => v.embedUrl !== null);

  if (playable.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--yba-navy,#2F3559)]">
      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-gold,#F6B32E)]" />

      <div className="mx-auto max-w-[var(--content-width,1400px)] px-6 py-14 sm:px-10 sm:py-16 md:px-[var(--page-padding,48px)]">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Welcome to YBA</h2>
          <span className="mx-auto mt-3 block h-[4px] w-16 bg-[var(--yba-gold,#F6B32E)]" />
        </div>

        <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-8">
          {playable.map((video) => (
            <FeaturedVideoEmbed key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
