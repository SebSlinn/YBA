import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import NewsSection from "@/components/landing/NewsSection";
import QuickLinks from "@/components/landing/QuickLinks";
import EventsSection from "@/components/landing/EventsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section id="about">
          <Hero />
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
