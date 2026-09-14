//src/components/landing/QuickLinkButton.tsx
//
// Presentational leaf — a photo tile with a semi-transparent colour tint
// on top (both editor-controlled via Directus), replacing the earlier
// plain white pill button. No data-fetching of its own (same convention
// as NewsCard/EventCard/etc).

import Image from "next/image";
import Link from "next/link";
import { QuickLink } from "@/domain/quicklink/QuickLink";

// Picks readable label text for whatever colour an editor chooses in
// Directus — white text disappears on a light tile (e.g. the white
// default), navy text disappears on a dark one, so this switches based on
// the tint's actual brightness rather than assuming either.
function getReadableTextColour(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#2F3559" : "#FFFFFF";
}

export default function QuickLinkButton({ link }: { link: QuickLink }) {
  const textColour = getReadableTextColour(link.colour);

  return (
    <Link
      href={link.href}
      target={link.openInNewTab ? "_blank" : undefined}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      className="group relative flex aspect-[16/10] w-full max-w-[200px] items-center justify-center overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      style={{ transitionDuration: "var(--transition-speed,.35s)" }}
    >
      {link.image && (
        <Image
          src={link.image}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Colour tint — semi-transparent over a photo so it shows through;
          solid if the link has no image set. */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: link.colour, opacity: link.image ? 0.7 : 1 }}
      />

      <span
        className="relative z-10 px-3 text-center text-xs font-semibold uppercase tracking-[.03em] sm:text-sm"
        style={{
          color: textColour,
          textShadow:
            textColour === "#FFFFFF"
              ? "0 1px 2px rgba(0,0,0,.4)"
              : "0 1px 1px rgba(255,255,255,.4)",
        }}
      >
        {link.label}
      </span>
    </Link>
  );
}
