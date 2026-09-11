//frontend/src/app/(site)/documents/page.tsx

import { Metadata } from "next";
import { DocumentsPage } from "@/components/documents/DocumentsPage";

export const metadata: Metadata = {
  title: "Documents & Policies | Ysgol Bryn Alyn",
  description: "Policies, forms and reference documents for Ysgol Bryn Alyn.",
};

// Match the near-real-time revalidation used elsewhere (e.g. the menu) so
// staff edits in Directus show up without a full redeploy.
export const revalidate = 60;

export default function Page() {
  return (
    <main className="mx-auto max-w-[var(--content-width)] px-[var(--page-padding)] py-12">
      <h1 className="mb-2 text-3xl font-bold text-[var(--yba-navy)]">
        Documents &amp; Policies
      </h1>
      <p className="mb-10 max-w-2xl text-black/60">
        Key policies, forms and information about Ysgol Bryn Alyn, grouped by
        topic below.
      </p>

      <DocumentsPage />
    </main>
  );
}
