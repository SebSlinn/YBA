// src/components/landing/HeroSection.tsx
//
// Server component wrapper — same "Section" pattern as NewsSection.tsx /
// EventsSection.tsx: fetch via the service layer here, hand plain props to
// the presentational/client component. Hero.tsx itself no longer knows
// Directus exists.
//
// In page.tsx (or wherever <Hero /> is currently rendered), swap the import
// and render <HeroSection /> instead of <Hero /> — HeroSection renders
// <Hero slides={...} /> itself.

import { getHeroService } from "@/services/ServiceFactory";
import Hero from "./Hero";

export default async function HeroSection() {
  const slides = await getHeroService().getActive();
  console.log("HERO SLIDES:", JSON.stringify(slides, null, 2));
  return <Hero slides={slides} />;
}

