//frontend/src/app/page.tsx
//
// Fix for TS2741: this homepage renders its own <Header /> (it isn't
// wrapped by app/(site)/layout.tsx, which only covers routes inside that
// group), so it needs the same menu-fetching wiring added there. Same
// pattern: fetch once server-side via ServiceFactory, pass as a prop.

import Header from "@/components/layout/Header";
import HeroSection from "@/components/landing/HeroSection";
import NewsSection from "@/components/landing/NewsSection";
import QuickLinks from "@/components/landing/QuickLinks";
import EventsSection from "@/components/landing/EventsSection";
import Footer from "@/components/layout/Footer";
import { getMenuService } from "@/services/ServiceFactory";

export default async function Home() {
  const menuItems = await getMenuService().getMenu("primary");

  return (
    <>
      <Header items={menuItems} />

      <main>
        <section id="about">
          <HeroSection />
        </section>

        <section id="students">
          <QuickLinks />
        </section>

        <section id="news">
          <NewsSection />
        </section>

        <section id="events">
          <EventsSection />
        </section>

        <section id="curriculum" className="sr-only" aria-hidden="true" />
        <section id="parents" className="sr-only" aria-hidden="true" />
        <section id="values" className="sr-only" aria-hidden="true" />
        <section id="contact" className="sr-only" aria-hidden="true" />
      </main>

      <Footer />
    </>
  );
}
