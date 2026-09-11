//frontend/src/components/documents/DocumentsPage.tsx

import { getDocumentService } from "@/services/ServiceFactory";
import { Document } from "@/domain/document/Document";
import { DocumentCategorySection } from "./DocumentCategorySection";

/**
 * Async server component — fetches all published documents via
 * IDocumentService and groups them by category for display. No
 * Directus-specific knowledge here; swapping the service
 * implementation (mock vs Directus) doesn't touch this file.
 */
export async function DocumentsPage() {
  const documents = await getDocumentService().getAll();
  const groups = groupByCategory(documents);

  if (groups.length === 0) {
    return (
      <p className="text-black/60">
        Documents will appear here shortly — please check back soon.
      </p>
    );
  }

  return (
    <div>
      {groups.map(([category, docs]) => (
        <DocumentCategorySection key={category} category={category} documents={docs} />
      ))}
    </div>
  );
}

function groupByCategory(documents: Document[]): [string, Document[]][] {
  const order: string[] = [];
  const map = new Map<string, Document[]>();

  for (const doc of documents) {
    if (!map.has(doc.category)) {
      order.push(doc.category);
      map.set(doc.category, []);
    }
    map.get(doc.category)!.push(doc);
  }

  return order.map((category) => [category, map.get(category)!]);
}
