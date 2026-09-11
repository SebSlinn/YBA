//frontend/src/components/documents/DocumentCategorySection.tsx

import { Document } from "@/domain/document/Document";
import { DocumentButton } from "./DocumentButton";

interface DocumentCategorySectionProps {
  category: string;
  documents: Document[];
}

export function DocumentCategorySection({
  category,
  documents,
}: DocumentCategorySectionProps) {
  return (
    <section className="mb-12 last:mb-0">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-[var(--yba-navy)]">
        {category}
        <span className="h-1 flex-1 rounded-full bg-gradient-to-r from-[var(--yba-gold)] to-transparent" />
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <DocumentButton key={document.id} document={document} />
        ))}
      </div>
    </section>
  );
}
