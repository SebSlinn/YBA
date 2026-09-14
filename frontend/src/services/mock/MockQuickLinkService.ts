//src/services/mock/MockQuickLinkService.ts
//
// Placeholder content only, for local dev before the `quick_links`
// collection exists in Directus — swap/add real entries (and real images)
// in the CMS, not here, once it's live. No image set here, so tiles will
// render as a solid colour block until real Directus assets are wired up.

import { IQuickLinkService } from "../interfaces/IQuickLinkService";
import { QuickLink } from "@/domain/quicklink/QuickLink";

const MOCK_QUICK_LINKS: QuickLink[] = [
  { id: "1", label: "Headteacher's Welcome", href: "/headteachers-welcome", openInNewTab: false, image: null, colour: "#F6B32E" },
  { id: "2", label: "YBA Prospectus", href: "/prospectus", openInNewTab: false, image: null, colour: "#D5008F" },
  { id: "3", label: "YBA Calendar", href: "/calendar", openInNewTab: false, image: null, colour: "#18B8C9" },
];

export class MockQuickLinkService implements IQuickLinkService {
  async getQuickLinks(): Promise<QuickLink[]> {
    return MOCK_QUICK_LINKS;
  }
}
