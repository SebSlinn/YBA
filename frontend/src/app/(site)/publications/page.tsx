//frontend/src/app/(site)/publications/page.tsx
import { PublicationsPage } from "@/components/publications/PublicationsPage";

export const metadata = {
  title: "Publications | Ysgol Bryn Alyn",
  description: "Browse the prospectus, newsletters and other school publications.",
};

// Matches documents/page.tsx's revalidation so staff edits in Directus
// (new publications, category changes) show up without a full redeploy —
// same fix as the earlier homepage staleness bug.
export const revalidate = 60;

// Now delegates its markup to components/publications/PublicationsPage.tsx,
// same split as documents/page.tsx -> DocumentsPage.tsx, now that there's
// category-grouping logic worth keeping out of the route file.
export default function Page() {
  return (
    <main className="pt-[130px] pb-22">
      <h1 className="mb-6 text-3xl font-bold text-[var(--yba-navy,#2F3559)]">
        Publications
      </h1>

      <PublicationsPage />
    </main>
  );
}
