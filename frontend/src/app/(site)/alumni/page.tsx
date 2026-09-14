// frontend/src/app/(site)/alumni/page.tsx

import { Metadata } from "next";
import AlumniCard from "@/components/alumni/AlumniCard";
import { getAlumniService } from "@/services/ServiceFactory";

export const metadata: Metadata = {
  title: "Alumni | Ysgol Bryn Alyn",
  description:
    "Stories from former pupils of Ysgol Bryn Alyn.",
};

export default async function AlumniPage() {

  const stories = await getAlumniService().getLatest();

  return (
    <main className="mx-auto max-w-7xl px-6 pt-[130px] pb-22">

      <h1 className="mb-8 text-4xl font-bold">
        Alumni
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {stories.map(story => (

          <AlumniCard
            key={story.id}
            story={story}
          />

        ))}

      </div>

    </main>
  );
}
