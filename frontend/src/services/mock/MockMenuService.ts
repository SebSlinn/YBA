import type { IMenuService } from "@/services/interfaces/IMenuService";
import type { MenuItem } from "@/domain/menu/MenuItem";

// Mirrors the current hardcoded MENU_ITEMS in Header.tsx, so switching
// ServiceFactory to the mock produces an identical menu — useful for
// frontend work when the Directus collection isn't populated yet.
const PRIMARY_MENU: MenuItem[] = [
  {
    id: "about-us",
    label: "About Us",
    openInNewTab: false,
    children: [
      { id: "our-school", label: "Our School", href: "/#about", openInNewTab: false, children: [] },
      { id: "headteachers-welcome", label: "Headteacher's Welcome", href: "/headteachers-welcome", openInNewTab: false, children: [] },
      { id: "our-values", label: "Our Values", href: "/yba-vision", openInNewTab: false, children: [] },
      { id: "key-information", label: "Key Information", href: "/#about", openInNewTab: false, children: [] },
      { id: "contact-us-nested", label: "Contact Us", href: "/#contact", openInNewTab: false, children: [] },
    ],
  },
  {
    id: "our-school-group",
    label: "Our School",
    openInNewTab: false,
    children: [
      { id: "staff", label: "Staff", href: "/yba-staff", openInNewTab: false, children: [] },
      { id: "students", label: "Students", href: "/#students", openInNewTab: false, children: [] },
      { id: "parents-nested", label: "Parents", href: "/#parents", openInNewTab: false, children: [] },
      { id: "school-life", label: "School Life", href: "/#students", openInNewTab: false, children: [] },
    ],
  },
  {
    id: "curriculum",
    label: "Curriculum",
    openInNewTab: false,
    children: [
      { id: "our-curriculum", label: "Our Curriculum", href: "/#curriculum", openInNewTab: false, children: [] },
      { id: "learning", label: "Learning", href: "/#curriculum", openInNewTab: false, children: [] },
    ],
  },
  {
    id: "admissions",
    label: "Admissions",
    openInNewTab: false,
    children: [
      { id: "admissions-link", label: "Admissions", href: "/#admissions", openInNewTab: false, children: [] },
      { id: "visit-the-school", label: "Visit the School", href: "/#contact", openInNewTab: false, children: [] },
    ],
  },
  {
    id: "news-events",
    label: "News & Events",
    openInNewTab: false,
    children: [
      { id: "latest-news", label: "Latest News", href: "/news", openInNewTab: false, children: [] },
      { id: "events", label: "Events", href: "/events", openInNewTab: false, children: [] },
    ],
  },
  {
    id: "parents",
    label: "Parents",
    openInNewTab: false,
    children: [
      { id: "parent-information", label: "Parent Information", href: "/#parents", openInNewTab: false, children: [] },
      { id: "useful-information", label: "Useful Information", href: "/#parents", openInNewTab: false, children: [] },
    ],
  },
  { id: "contact-us", label: "Contact Us", href: "/#contact", openInNewTab: false, children: [] },
];

export class MockMenuService implements IMenuService {
  async getMenu(slug: string): Promise<MenuItem[]> {
    // Only one mocked menu today — extend this map if you add a footer
    // menu later and want a mock for it too.
    if (slug === "primary") return PRIMARY_MENU;
    return [];
  }
}
