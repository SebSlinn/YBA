//src/components/layout/Header.tsx

"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "#" },
  { label: "Parents", href: "#" },
  { label: "Students", href: "#" },
  { label: "Curriculum", href: "#" },
  { label: "News", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    let lastY = Math.max(window.scrollY, 0);
    let ticking = false;

    const update = () => {
      ticking = false;
      if (menuOpen) return; // never hide while the mobile menu is open

      const y = Math.max(window.scrollY, 0); // clamp — iOS rubber-band can go negative
      const delta = y - lastY;

      // Ignore tiny deltas so momentum-scroll jitter near the top/bottom of the
      // page (very common on mobile) doesn't flicker the header back and forth.
      if (Math.abs(delta) < 5) return;

      const scrollingDown = delta > 0;
      const pastThreshold = y > 120; // don't hide near the very top of the page

      setHidden(scrollingDown && pastThreshold);
      lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <header
      style={{
        height: "var(--header-height, 64px)",
        background: "var(--yba-navy, #2F3559)",
        transitionDuration: "var(--transition-speed, .35s)",
      }}
      className={`fixed top-0 left-0 z-50 w-full transition-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[var(--content-width,1400px)] items-center justify-end px-6 sm:px-10 md:px-[var(--page-padding,48px)]">

        <nav className="hidden md:flex gap-8 text-sm font-medium text-white">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-[var(--yba-gold,#F6B32E)]"
              style={{ transitionDuration: "var(--transition-speed, .35s)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
            style={{ transitionDuration: "var(--transition-speed, .35s)" }}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
            style={{ transitionDuration: "var(--transition-speed, .35s)" }}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
            style={{ transitionDuration: "var(--transition-speed, .35s)" }}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] ease-in-out ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
        style={{
          transitionDuration: "var(--transition-speed, .35s)",
          background: "var(--yba-navy, #2F3559)",
        }}
      >
        <nav className="flex flex-col gap-1 px-6 pb-6 pt-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
