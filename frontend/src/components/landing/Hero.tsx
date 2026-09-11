//src/components/landing/Hero.tsx
//
// Presentational + carousel state only — slides now come from Directus via
// HeroSection.tsx (a server component, same "Section" wrapper pattern as
// NewsSection/EventsSection) instead of being hardcoded here. Everything
// else — overlay, gradients, logo, heading animation, scroll cue, bottom
// strip — is unchanged from before.
//
// The one behavioural change beyond the data source: each image now gets
// its own objectPosition from slide.focalPoint, set in Directus, instead of
// every photo defaulting to a plain center crop.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HeroSlide } from "@/domain/hero/HeroSlide";

const SLIDE_DURATION = 6000; // ms each slide is shown before advancing
const FADE_DURATION = 1000; // ms crossfade — keep in sync with the transitionDuration below

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Nothing to rotate through if there's 0 or 1 slide.
    if (slides.length <= 1) return;

    // Respect prefers-reduced-motion — just show the first slide, no auto-advance
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section
      style={{ height: "var(--hero-height, 92vh)" }}
     className="relative min-h-[380px] sm:min-h-[500px] lg:min-h-[600px] w-full overflow-hidden"
    >

      {/* Background — crossfading slides, all stacked, only the active one opaque */}
      {slides.map((slide, i) => (
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.alt ?? "Hero image"}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDuration: `${FADE_DURATION}ms`,
            objectPosition: `${slide.focalPoint.x}% ${slide.focalPoint.y}%`,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Top dissolve — a clean 2-stop fade with no plateau: fully solid at the
          very top (continuing seamlessly from the header, which is now a flat
          solid bar with no gradient of its own) fading to fully transparent by
          the bottom of this same height, so the "solid" and "fading" zones can
          never blend into each other ambiguously. */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "var(--header-height, 64px)",
          height: "var(--header-height, 32px)",
          background:
            "linear-gradient(to bottom, rgba(var(--yba-navy-rgb, 47, 53, 89),1) 0%, rgba(var(--yba-navy-rgb, 47, 53, 89),0) 100%)",
        }}
      />

      {/* Logo — independent of the heading, absolutely positioned at every
          screen size (not just desktop). Top offset is tied to the header's
          own height plus a fixed gap, so it's always comfortably clear of the
          header regardless of screen size — not "too high" on a small screen.
          Sized in steps (mobile → tablet → desktop) rather than one big jump.
      <div className="absolute z-10 top-[calc(var(--header-height,64px)+16px)] left-6 h-20 w-20 sm:left-8 sm:h-28 sm:w-28 md:left-[var(--page-padding,48px)] md:h-56 md:w-56 lg:h-[var(--hero-logo-width,340px)] lg:w-[var(--hero-logo-width,340px)]">
        <Image
          src="/images/logos/YBA_LOGO_TRANS.png"
          alt="YBA"
          fill
          priority
          className="object-contain object-left-top drop-shadow-lg"
        />
      </div>
*/}
      {/* Heading — one unified treatment at every screen size (this used to
          switch to a different, independently-centered desktop layout, which
          is exactly what caused it to drift out of sync with the small-screen
          version). Centered horizontally, pushed to the bottom of the hero
          via justify-end, the same way on a phone, a tablet, or a 4K monitor. */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-10 sm:pb-14 md:pb-20 text-center">
        <div className="relative w-full" style={{ minHeight: "clamp(4.5rem,15vw,9rem)" }}>

          {/* Rotating headline — slides up into place while fading in, and
              slides down while fading out, rather than a flat crossfade.
              whitespace-normal on mobile (safe — allow wrapping on a narrow
              phone), sm:whitespace-nowrap from 640px up so it commits to a
              single line and only wraps if the viewport genuinely can't fit
              it, rather than wrapping early just because of a fixed max-width.
              minHeight keeps the box tall enough for the longest heading at
              two lines, so a forced mobile wrap doesn't jump the layout. */}
          {slides.map((slide, i) => (
            <h1
              key={slide.id}
              className={`absolute inset-0 whitespace-normal text-center font-bold leading-tight text-white drop-shadow-lg transition-all ease-out sm:whitespace-nowrap ${
                i === current ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              style={{
                fontSize: "clamp(1.75rem,7vw,var(--hero-title-size, 4rem))",
                transitionDuration: `${FADE_DURATION}ms`,
              }}
            >
              {slide.heading}
            </h1>
          ))}
        </div>

        {/* <button
          className="mt-8 rounded-full px-8 py-4 font-semibold transition hover:scale-105 sm:mt-10"
          style={{
            background: "var(--yba-gold, #F6B32E)",
            color: "var(--yba-navy, #2F3559)",
            transitionDuration: "var(--transition-speed, .35s)",
          }}
        >
          Book a Visit
        </button>*/}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/80">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Bottom dissolve — transparent fading to solid navy, before the strip */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "var(--hero-bottom-strip, 16px)",
          height: "var(--header-height, 64px)",
          background:
            "linear-gradient(to bottom, rgba(var(--yba-navy-rgb, 47, 53, 89),0) 0%, rgba(var(--yba-navy-rgb, 47, 53, 89),1) 100%)",
        }}
      />

      {/* Navy Strip */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "var(--hero-bottom-strip, 16px)", background: "var(--yba-navy, #2F3559)" }}
      />

      {/* Magenta Divider */}
      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-magenta,#D5008F)]" />

    </section>
  );
}
