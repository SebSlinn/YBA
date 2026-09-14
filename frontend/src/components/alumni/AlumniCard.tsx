//frontend/src/components/alumni/AlumniCard.tsx
import Link from "next/link";
import Image from "next/image";
import { AlumniStory } from "@/domain/alumni/AlumniStory";

interface AlumniCardProps {
  story: AlumniStory;
}

// Same placeholder styling as BlogCard (see its own note) — send NewsCard
// or a design-system card component if you want this pixel-matched.
// The one deliberate difference from BlogCard: this shows the attendance
// year range instead of a single publish date, since "when they were here"
// is the meaningful date for an alumni story, not when the post went live.

export default function AlumniCard({ story }: AlumniCardProps) {
  const fromYear = new Date(story.attendedFrom).getFullYear();
  const toYear = new Date(story.attendedTo).getFullYear();

  return (
    <Link
      href={`/alumni/${story.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
    >
      {story.featuredImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <Image
            src={story.featuredImage}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
          {fromYear} – {toYear}
        </p>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:underline">
          {story.title}
        </h3>
        <p className="line-clamp-3 text-sm text-gray-600">{story.excerpt}</p>
      </div>
    </Link>
  );
}
