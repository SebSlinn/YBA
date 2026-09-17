//frontend/src/components/pages/FlipbookArticle.tsx
import FlipbookViewer from "./FlipbookViewer";
import type { FlipbookDocument } from "@/domain/flipbook/FlipbookDocument";

interface FlipbookArticleProps {
  document: FlipbookDocument;
}

// NOTE: pt-[130px] pb-22 is the same repeated header-clearance value used
// on News/Events/Blog/Alumni detail pages (see 02-frontend-context.md,
// "Known gaps" — design-tokens.css's header-height token isn't imported
// yet). Kept consistent with the rest of the site rather than introducing
// a one-off fix here.
export default function FlipbookArticle({ document }: FlipbookArticleProps) {
  return (
    <main className="pt-[100px] pb-22">
      <FlipbookViewer
        title={document.title}
        pageImages={document.pageImageUrls}
        pdfUrl={document.pdfUrl}
      />
    </main>
  );
}
