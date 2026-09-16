//src/components/landing/FeaturedVideoEmbed.tsx
//
// Presentational leaf — a single Vimeo embed in a responsive 16:9 box,
// with its title below in YBA navy (flipped from white to match the
// section's new white background). No data-fetching of its own.

import { FeaturedVideo } from "@/domain/featuredvideo/FeaturedVideo";

export default function FeaturedVideoEmbed({ video }: { video: FeaturedVideo }) {
  if (!video.embedUrl) return null;

  return (
    <div className="w-full sm:max-w-[560px]">
      <div className="aspect-video w-full overflow-hidden rounded-xl shadow-md">
        <iframe
          src={video.embedUrl}
          title={video.title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-[var(--yba-navy,#2F3559)] sm:text-base">
        {video.title}
      </p>
    </div>
  );
}
