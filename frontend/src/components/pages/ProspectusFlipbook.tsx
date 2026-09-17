//frontend/src/components/pages/ProspectusFlipbook.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

/**
 * Page-by-page flipbook viewer for the prospectus (or any ordered set of
 * page images). Fully self-hosted — no third-party requests, no cookies —
 * so it doesn't affect the site's Cookie/Privacy Policy.
 *
 * Expects `pageImages` as an ordered array of already-resolved asset URLs
 * (e.g. built from a Directus `prospectus_pages` collection via
 * getAssetUrl(), sorted the same way Quick Links/Menu items use Manual
 * Sort). Pages are pre-rendered JPGs/PNGs generated once from the source
 * PDF (e.g. `pdftoppm -jpeg -r 150 prospectus.pdf page`), not rendered
 * live from the PDF in the browser.
 */

interface ProspectusFlipbookProps {
  pageImages: string[];
  title?: string;
  /** Direct link to the original PDF, offered as an accessible fallback. */
  pdfUrl?: string;
}

export default function ProspectusFlipbook({
  pageImages,
  title,
  pdfUrl,
}: ProspectusFlipbookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  // react-pageflip doesn't ship a typed ref API; `any` here is deliberate.
  const bookRef = useRef<any>(null);

  const totalPages = pageImages.length;

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => bookRef.current?.pageFlip()?.flipNext();

  // Keyboard support: left/right arrows flip pages, matching the
  // click-to-drag/swipe gestures react-pageflip already provides.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (totalPages === 0) return null;

  return (
    <section className="flex flex-col items-center gap-4 py-8">
      {title && (
        <h2 className="text-2xl font-bold text-[var(--yba-navy,#2F3559)]">
          {title}
        </h2>
      )}

      <div className="rounded-lg shadow-2xl overflow-hidden bg-white">
        <HTMLFlipBook
          ref={bookRef}
          width={550}
          height={733}
          size="stretch"
          minWidth={280}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1400}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport
          flippingTime={700}
          onFlip={(e: { data: number }) => setCurrentPage(e.data)}
          className="prospectus-flipbook"
        >
          {pageImages.map((src, i) => (
            <div key={src} className="bg-white flex items-center justify-center">
              {/* Using a plain img here (not next/image) because
                  react-pageflip measures/manipulates its children's DOM
                  nodes directly; wrapping in next/image's layout wrapper
                  interferes with that. */}
              <img
                src={src}
                alt={`Prospectus, page ${i + 1} of ${totalPages}`}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <div
        className="flex items-center gap-6"
        role="group"
        aria-label="Prospectus page navigation"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded-full bg-[var(--yba-navy,#2F3559)] text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          ‹ Prev
        </button>

        <span
          className="text-sm font-medium text-[var(--yba-navy,#2F3559)] tabular-nums"
          aria-live="polite"
        >
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 rounded-full bg-[var(--yba-navy,#2F3559)] text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline text-[var(--yba-magenta,#D5008F)]"
        >
          Download the accessible PDF version
        </a>
      )}
    </section>
  );
}
