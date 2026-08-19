"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = { label: string; href?: string; children?: { label: string; href: string }[] };

const MENU_ITEMS: MenuItem[] = [
  { label: "About Us", children: [
    { label: "Our School", href: "/#about" },
    { label: "Our Values", href: "/#values" },
    { label: "Key Information", href: "/#about" },
    { label: "Contact Us", href: "/#contact" },
  ]},
  { label: "Our School", children: [
    { label: "Students", href: "/#students" },
    { label: "Parents", href: "/#parents" },
    { label: "School Life", href: "/#students" },
  ]},
  { label: "Curriculum", children: [
    { label: "Our Curriculum", href: "/#curriculum" },
    { label: "Learning", href: "/#curriculum" },
  ]},
  { label: "Admissions", children: [
    { label: "Admissions", href: "/#admissions" },
    { label: "Visit the School", href: "/#contact" },
  ]},
  { label: "News & Events", children: [
    { label: "Latest News", href: "/news" },
    { label: "Events", href: "/events" },
  ]},
  { label: "Parents", children: [
    { label: "Parent Information", href: "/#parents" },
    { label: "Useful Information", href: "/#parents" },
  ]},
  { label: "Contact Us", href: "/#contact" },
];

const UTILITY_LINKS = [
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setOpenSection(null);
      }
    };
    if (menuOpen) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!menuOpen) return;
      const target = event.target as Node;
      const clickedPanel = panelRef.current?.contains(target);
      const clickedMenuButton = (target as HTMLElement)?.closest?.("[data-menu-button]");
      if (!clickedPanel && !clickedMenuButton) {
        setMenuOpen(false);
        setOpenSection(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  useEffect(() => {
    let lastY = Math.max(window.scrollY, 0);
    let ticking = false;
    const update = () => {
      ticking = false;
      if (menuOpen) return;
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;
      if (Math.abs(delta) < 5) return;
      setHidden(delta > 0 && y > 120);
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

  const closeMenu = () => { setMenuOpen(false); setOpenSection(null); };
  const toggleMenu = () => setMenuOpen(value => {
    if (value) setOpenSection(null);
    return !value;
  });

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 bg-[var(--yba-navy,#2F3559)] text-white shadow-[0_2px_18px_rgba(0,0,0,.12)] transition-transform ${hidden ? "-translate-y-full" : "translate-y-0"}`} style={{ transitionDuration: "var(--transition-speed,.35s)" }}>
        <div className="mx-auto flex h-[82px] max-w-[var(--content-width,1400px)] items-center justify-between px-5 sm:px-8 md:px-[var(--page-padding,48px)]">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3" aria-label="Ysgol Bryn Alyn home">
            <Image src="/images/logos/YBA_LOGO_TRANS.png" alt="Ysgol Bryn Alyn" width={120} height={120} priority className="h-14 w-auto md:h-16" />
            <span className="hidden text-sm font-semibold leading-tight sm:block">Ysgol Bryn Alyn<span className="mt-1 block text-xs font-normal text-white/65">Dream. Reach. Achieve.</span></span>
          </Link>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[.12em] lg:flex">
              {UTILITY_LINKS.map(item => <Link key={item.label} href={item.href} className="transition hover:text-[var(--yba-gold,#F6B32E)]">{item.label}</Link>)}
            </nav>
            <button type="button" data-menu-button aria-expanded={menuOpen} aria-controls="site-navigation-panel" onClick={toggleMenu} className="group flex h-12 items-center gap-3 border border-white/30 px-4 text-sm font-semibold uppercase tracking-[.12em] transition hover:border-[var(--yba-gold,#F6B32E)] hover:text-[var(--yba-gold,#F6B32E)]">
              <span>{menuOpen ? "Close" : "Menu"}</span>
              <span className="relative flex h-5 w-5 flex-col justify-center gap-1.5">
                <span className={`block h-px w-5 bg-current transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
                <span className={`block h-px w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-px w-5 bg-current transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div aria-hidden="true" className={`fixed inset-0 z-[55] bg-black/35 transition-opacity ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} style={{ transitionDuration: "var(--transition-speed,.35s)" }} />

      <aside ref={panelRef} id="site-navigation-panel" aria-label="Site navigation" aria-hidden={!menuOpen} className={`fixed right-0 top-0 z-[60] flex h-dvh w-[min(480px,92vw)] flex-col bg-white text-[var(--text-dark,#1b1b1b)] shadow-[-12px_0_45px_rgba(0,0,0,.2)] transition-transform ${menuOpen ? "translate-x-0" : "translate-x-full"}`} style={{ transitionDuration: "var(--transition-speed,.35s)" }}>
        <div className="flex min-h-[82px] items-center justify-between border-b border-black/10 bg-[var(--yba-navy,#2F3559)] px-6 text-white sm:px-8">
          <span className="text-sm font-semibold uppercase tracking-[.14em]">Menu</span>
          <button type="button" onClick={closeMenu} aria-label="Close navigation" className="flex h-10 w-10 items-center justify-center border border-white/25 transition hover:border-[var(--yba-gold,#F6B32E)] hover:text-[var(--yba-gold,#F6B32E)]">
            <span className="relative block h-5 w-5"><span className="absolute left-0 top-1/2 block h-px w-5 rotate-45 bg-current" /><span className="absolute left-0 top-1/2 block h-px w-5 -rotate-45 bg-current" /></span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto" aria-label="Main navigation">
          <Link href="/" onClick={closeMenu} className="block border-b border-black/10 px-6 py-5 text-lg font-semibold transition hover:bg-black/[.035] sm:px-8">Home</Link>
          {MENU_ITEMS.map(item => {
            if (!item.children?.length) return <Link key={item.label} href={item.href ?? "#"} onClick={closeMenu} className="flex items-center justify-between border-b border-black/10 px-6 py-5 text-lg font-semibold transition hover:bg-black/[.035] hover:text-[var(--yba-magenta,#D5008F)] sm:px-8">{item.label}<span aria-hidden="true">→</span></Link>;
            const expanded = openSection === item.label;
            return <div key={item.label} className="border-b border-black/10">
              <button type="button" aria-expanded={expanded} onClick={() => setOpenSection(expanded ? null : item.label)} className={`flex w-full items-center justify-between px-6 py-5 text-left text-lg font-semibold transition sm:px-8 ${expanded ? "bg-[var(--yba-navy,#2F3559)] text-white" : "hover:bg-black/[.035] hover:text-[var(--yba-magenta,#D5008F)]"}`}>
                <span>{item.label}</span><span aria-hidden="true" className={`text-xl font-normal transition-transform ${expanded ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`grid transition-[grid-template-rows] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} style={{ transitionDuration: "var(--transition-speed,.35s)" }}>
                <div className="overflow-hidden"><div className="bg-[#f7f7f7] px-6 py-2 sm:px-8">
                  {item.children.map(child => <Link key={child.label} href={child.href} onClick={closeMenu} className="flex items-center justify-between border-b border-black/10 py-4 text-sm font-medium last:border-b-0 hover:text-[var(--yba-magenta,#D5008F)]">{child.label}<span aria-hidden="true">→</span></Link>)}
                </div></div>
              </div>
            </div>;
          })}
        </nav>
        <div className="border-t border-black/10 bg-[var(--yba-navy,#2F3559)] px-6 py-5 text-white sm:px-8"><div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[.1em]"><Link href="/news" onClick={closeMenu} className="hover:text-[var(--yba-gold,#F6B32E)]">News</Link><Link href="/events" onClick={closeMenu} className="hover:text-[var(--yba-gold,#F6B32E)]">Events</Link><Link href="/#contact" onClick={closeMenu} className="hover:text-[var(--yba-gold,#F6B32E)]">Contact</Link></div></div>
      </aside>
    </>
  );
}
