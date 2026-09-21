//frontend/src/components/publications/PublicationsPage.tsx
import { getFlipbookService } from "@/services/ServiceFactory";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";
import { PublicationCategorySection } from "./PublicationCategorySection";

/**
 * Async server component — fetches all published publications via
 * IFlipbookService and groups them by category for display. Mirrors
 * DocumentsPage.tsx exactly (same grouping logic, same shape) so the
 * two features stay consistent as they evolve.
 */
export async function PublicationsPage() {
  const documents = await getFlipbookService().getAll();
  const groups = groupByCategory(documents);

  if (groups.length === 0) {
    return (
      <p className="text-black/60">
        Publications will appear here shortly — please check back soon.
      </p>
    );
  }

  return (
    <div>
      {groups.map(([category, docs]) => (
        <PublicationCategorySection key={category} category={category} documents={docs} />
      ))}
    </div>
  );
}

function groupByCategory(
  documents: FlipbookDocument[]
): [string, FlipbookDocument[]][] {
  const order: string[] = [];
  const map = new Map<string, FlipbookDocument[]>();

  for (const doc of documents) {
    if (!map.has(doc.category)) {
      order.push(doc.category);
      map.set(doc.category, []);
    }
    map.get(doc.category)!.push(doc);
  }

  return order.map((category) => [category, map.get(category)!]);
}
