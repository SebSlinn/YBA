//frontend/src/app/(site)/publications/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getFlipbookService } from "@/services/ServiceFactory";

export const metadata = {
  title: "Publications | Ysgol Bryn Alyn",
  description: "Browse the prospectus, newsletters and other school publications.",
};

export default async function PublicationsPage() {
  const flipbookService = getFlipbookService();
  const documents = await flipbookService.getAll();

  return (
    <main className="pt-[130px] pb-22">
      <h1 className="mb-6 text-3xl font-bold text-[var(--yba-navy,#2F3559)]">
        Publications
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={`/publications/${doc.slug}`}
            className="block rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow bg-white"
          >
            {doc.pageImageUrls[0] && (
              <Image
                src={doc.pageImageUrls[0]}
                alt={`${doc.title} cover`}
                width={400}
                height={533}
                className="w-full h-auto object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-[var(--yba-navy,#2F3559)]">
                {doc.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}