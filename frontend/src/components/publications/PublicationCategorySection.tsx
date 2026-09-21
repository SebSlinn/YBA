//frontend/src/components/publications/PublicationCategorySection.tsx
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";
import { PublicationCard } from "./PublicationCard";

interface PublicationCategorySectionProps {
  category: string;
  documents: FlipbookDocument[];
}

// Mirrors DocumentCategorySection.tsx from the Documents & Policies
// feature — same heading treatment, same "gold line trailing off" accent —
// so Publications and Documents read as one consistent pattern site-wide.
export function PublicationCategorySection({
  category,
  documents,
}: PublicationCategorySectionProps) {
  return (
    <section className="mb-12 last:mb-0">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-[var(--yba-navy,#2F3559)]">
        {category}
        <span className="h-1 flex-1 rounded-full bg-gradient-to-r from-[var(--yba-gold,#F6B32E)] to-transparent" />
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {documents.map((document) => (
          <PublicationCard key={document.id} document={document} />
        ))}
      </div>
    </section>
  );
}
