//frontend/src/components/pages/FlipbookViewer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

/**
 * Page-by-page flipbook viewer for any ordered set of page images — the
 * prospectus, a newsletter, an open-day brochure, etc. Fully self-hosted —
 * no third-party requests, no cookies — so it doesn't affect the site's
 * Cookie/Privacy Policy.
 *
 * One instance renders one document. Pages are pre-rendered JPGs/PNGs
 * generated once from the source PDF (e.g. `pdftoppm -jpeg -r 150 doc.pdf
 * page`), not rendered live from the PDF in the browser. See
 * DIRECTUS-SETUP.md for how `pageImages`/`pdfUrl` get populated per
 * document via the `flipbooks` collection.
 */

interface FlipbookViewerProps {
  pageImages: string[];
  title?: string;
  /** Direct link to the original PDF, offered as an accessible fallback. */
  pdfUrl?: string;
}

// How wide to render the book once we know the real page shape. Height
// is derived from this and the measured aspect ratio, not hardcoded —
// see the effect below.
const TARGET_WIDTH = 900;

export default function FlipbookViewer({
  pageImages,
  title,
  pdfUrl,
}: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  // react-pageflip doesn't ship a typed ref API; `any` here is deliberate.
  const bookRef = useRef<any>(null);

  const totalPages = pageImages.length;

  // The page images are landscape, not portrait — measured, not assumed,
  // since guessing A4 vs. Letter vs. whatever the source PDF actually is
  // led to letterboxing. Load the first page once, read its real pixel
  // dimensions, and size the whole book to that exact aspect ratio.
  const [bookSize, setBookSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    if (!pageImages[0]) return;
    const probe = new Image();
    probe.onload = () => {
      const aspect = probe.naturalWidth / probe.naturalHeight;
      setBookSize({
        width: TARGET_WIDTH,
        height: Math.round(TARGET_WIDTH / aspect),
      });
    };
    probe.src = pageImages[0];
  }, [pageImages]);

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

  // Wait for the real aspect ratio before rendering the book at all —
  // rendering early at a guessed size is exactly what caused the
  // letterboxing in the first place.
  if (totalPages === 0 || !bookSize) return null;

  return (
    <section className="flex flex-col items-center gap-4 py-8">
      {title && (
        <h2 className="text-2xl font-bold text-[var(--yba-navy,#2F3559)]">
          {title}
        </h2>
      )}

      <div className="mx-auto overflow-x-auto rounded-lg shadow-2xl bg-white">
        <HTMLFlipBook
          ref={bookRef}
          width={bookSize.width}
          height={bookSize.height}
          // "stretch" sizing was still deciding there was enough room to
          // pair two pages into a spread, no matter how the min/max
          // widths were tuned. "fixed" sizing renders the book at exactly
          // width x height, one page per leaf, with no responsive
          // width-based logic that can trigger a two-page spread — the
          // trade-off is it no longer resizes itself to the viewport, so
          // the wrapper above scrolls horizontally on narrow screens
          // instead of squeezing or cropping the book.
          size="fixed"
          minWidth={bookSize.width}
          maxWidth={bookSize.width}
          minHeight={bookSize.height}
          maxHeight={bookSize.height}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport
          flippingTime={700}
          onFlip={(e: { data: number }) => setCurrentPage(e.data)}
          className="flipbook-viewer"
        >
          {pageImages.map((src, i) => (
            <div key={src} className="bg-white flex items-center justify-center">
              {/* Using a plain img here (not next/image) because
                  react-pageflip measures/manipulates its children's DOM
                  nodes directly; wrapping in next/image's layout wrapper
                  interferes with that. */}
              <img
                src={src}
                alt={`${title ?? "Document"}, page ${i + 1} of ${totalPages}`}
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
        aria-label={`${title ?? "Document"} page navigation`}
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
