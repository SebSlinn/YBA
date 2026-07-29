//src/app/page.tsx
import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import NewsSection from "@/components/landing/NewsSection";
import QuickLinks from "@/components/landing/QuickLinks";
import EventsSection from "@/components/landing/EventsSection";
import Footer from "@/components/layout/Footer";
import FeaturedNews from "@/components/landing/FeaturedNews";
import LatestNewsList from "@/components/landing/LatestNewsList";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <QuickLinks />
        <NewsSection />
        <EventsSection />
      </main>

      <Footer />
    </>
  );
}