//frontend/src/components/alumni/AlumniArticle.tsx
import Image from "next/image";
import { AlumniStory } from "@/domain/alumni/AlumniStory";
import { RichText } from "@/components/pages/RichText";

interface AlumniArticleProps {
  story: AlumniStory;
}

export default function AlumniArticle({ story }: AlumniArticleProps) {
  const fromYear = new Date(story.attendedFrom).getFullYear();
  const toYear = new Date(story.attendedTo).getFullYear();

  return (
    <article className="pt-[130px] pb-22">
      {/*
        RichText itself applies max-w-[800px] mx-auto px-4 to the body
        content, so this header block matches that same width rather than
        introducing a different container.
      */}
      <header className="mx-auto mb-6 max-w-[800px] px-4">
        {story.featuredImage && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={story.featuredImage}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="mb-2 text-3xl font-semibold">{story.title}</h1>
        <p className="text-sm text-gray-500">
          At Ysgol Bryn Alyn {fromYear} – {toYear}
        </p>
      </header>

      <RichText html={story.content} />
    </article>
  );
}
