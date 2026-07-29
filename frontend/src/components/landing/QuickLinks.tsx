//src/components/landing/QuickLinks.tsx

export default function QuickLinks() {
  return (
    <section className="relative overflow-hidden bg-[var(--yba-white,#E9EDF5)]">

      {/* Navy fade — same treatment as News/Events 
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "var(--header-height, 64px)",
          background:
            "linear-gradient(to bottom, rgba(var(--yba-navy-rgb, 47, 53, 89),1) 0%, rgba(var(--yba-navy-rgb, 47, 53, 89),0) 100%)",
        }}
      />*/}

      {/* Teal Bar — this section's accent colour */}
      <div className="absolute bottom-0 left-0 h-[4px] w-full bg-[var(--yba-gold,#18B8C9)]" />

      <div className="relative mx-auto max-w-[var(--content-width,1400px)] px-6 pb-20 pt-24 sm:px-10 md:px-[var(--page-padding,48px)]">
        <h2
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--yba-navy, #2F3559)" }}
        >
          Quick Links
        </h2>
      </div>

    </section>
  );
}
