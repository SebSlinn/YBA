//src/components/layout/Footer.tsx

import Image from "next/image";

const CONTACT_ITEMS = [
  {
    label: "Ysgol Bryn Alyn, Church Street, Gwersyllt, Wrexham LL11 4HD",
    icon: (
      <>
        <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    label: "01978 720700",
    icon: <path d="M4 5c0 8.3 6.7 15 15 15l2-4-5-2-1.5 1.5A11.5 11.5 0 0 1 9.5 10L11 8.5 9 3.5 5 5.5Z" />,
  },
  {
    label: "01978 752889 (fax)",
    icon: (
      <>
        <path d="M6 9V3h12v6" />
        <rect x="4" y="9" width="16" height="7" rx="1" />
        <path d="M6 14h12v7H6z" />
      </>
    ),
  },
  {
    label: "mailbox@ysgolbrynalyn.wrexham.sch.uk",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="1" />
        <path d="M3 6l9 7 9-7" />
      </>
    ),
  },
];

const POLICY_LINKS = ["Privacy Policy", "Cookie Policy", "Accessibility"];

export default function Footer() {
  return (
    <footer style={{ background: "var(--yba-navy, #2F3559)" }} className="text-white">

      <div className="mx-auto flex max-w-[var(--content-width,1400px)] flex-col gap-10 px-6 py-16 sm:px-10 md:flex-row md:items-start md:justify-between md:px-[var(--page-padding,48px)]">

        <div>
          <Image
            src="/images/logos/YBA_LOGO_TRANS.png"
            alt="YBA"
            width={120}
            height={120}
            className="h-16 w-auto"
          />
          <p className="mt-4 text-sm font-semibold" style={{ color: "var(--yba-teal, #18B8C9)" }}>
            Dream. Reach. Achieve
          </p>
        </div>

        <ul className="space-y-3">
          {CONTACT_ITEMS.map((item) => (
            <li key={item.label} className="flex items-start gap-3 text-sm text-white/80">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0"
                style={{ color: "var(--yba-gold, #F6B32E)" }}
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

      </div>

      <div className="mx-auto flex max-w-[var(--content-width,1400px)] flex-col items-center gap-3 border-t border-white/10 px-6 py-6 text-xs text-white/60 sm:flex-row sm:justify-between sm:px-10 md:px-[var(--page-padding,48px)]">
        <p>© {new Date().getFullYear()} Ysgol Bryn Alyn. All rights reserved.</p>
        <ul className="flex flex-wrap justify-center gap-4">
          {POLICY_LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="transition hover:text-[var(--yba-gold,#F6B32E)]"
                style={{ transitionDuration: "var(--transition-speed, .35s)" }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </footer>
  );
}
