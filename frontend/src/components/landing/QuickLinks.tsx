//src/components/landing/QuickLinks.tsx
//
// Directus-backed (quick_links collection) via IQuickLinkService. All-navy
// section, no heading. Explicit responsive column counts rather than an
// auto-fit grid: 1 column (stacked vertically) on phones, stepping up
// through 2/3/4 as the screen widens, to 5 across on a standard desktop
// width (xl, 1280px+). Each tile also caps its own max-width (in
// QuickLinkButton) and is centered in its cell (justify-items-center), so
// it shrinks to fit a narrower column rather than stretching edge to edge.
//
// Note: if the number of published links doesn't evenly divide into the
// column count at a given breakpoint, the last row is left-aligned rather
// than centered as a group — fine for ~5 links, worth revisiting with
// flexbox if the count varies a lot and that starts looking odd.

import { getQuickLinkService } from "@/services/ServiceFactory";
import QuickLinkButton from "./QuickLinkButton";

export default async function QuickLinks() {
  const links = await getQuickLinkService().getQuickLinks();

  if (links.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--yba-navy,#2F3559)]">
      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-teal,#18B8C9)]" />

      <div className="relative mx-auto grid max-w-[var(--content-width,1400px)] grid-cols-1 justify-items-center gap-3 px-6 py-10 sm:grid-cols-2 sm:gap-5 sm:px-10 sm:py-12 md:grid-cols-3 md:px-[var(--page-padding,48px)] lg:grid-cols-4 xl:grid-cols-5">
        {links.map((link) => (
          <QuickLinkButton key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
