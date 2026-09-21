//frontend/src/components/publications/PublicationCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

interface PublicationCardProps {
  document: FlipbookDocument;
}

// Pulled out of the old flat publications/page.tsx grid unchanged —
// same markup, just reusable now that PublicationCategorySection
// renders one grid per category instead of one grid for everything.
export function PublicationCard({ document }: PublicationCardProps) {
  return (
    <Link
      href={`/publications/${document.slug}`}
      className="block rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow bg-white"
    >
      {document.pageImageUrls[0] && (
        <Image
          src={document.pageImageUrls[0]}
          alt={`${document.title} cover`}
          width={300}
          height={400}
          className="w-full h-auto object-cover"
        />
      )}
      <div className="p-3">
        <h2 className="text-sm font-semibold text-[var(--yba-navy,#2F3559)] leading-snug">
          {document.title}
        </h2>
      </div>
    </Link>
  );
}
