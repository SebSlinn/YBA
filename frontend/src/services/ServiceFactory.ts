//frontend/src/services/ServiceFactory.ts
//
// This is your real file with the Hero wiring merged in — the changes are
// the new imports (IHeroService / DirectusHeroService / MockHeroService),
// the USE_MOCK_HERO flag (matching the USE_MOCK_PAGES pattern you already
// have, rather than the older `useMock` local used for News/Events), and
// getHeroService() at the bottom. Everything else is unchanged from what
// you pasted.

import { MockNewsService } from "./mock/MockNewsService";
import { DirectusNewsService } from "./directus/DirectusNewsService";
import { INewsService } from "./interfaces/INewsService";

import { MockEventService } from "./mock/MockEventService";
import { DirectusEventService } from "./directus/DirectusEventService";
import { IEventService } from "./interfaces/IEventService";

import { ICalendarService } from './interfaces/ICalendarService';
import { DirectusCalendarService } from './directus/DirectusCalendarService';
import { IcsCalendarService } from './ics/IcsCalendarService';
import { CompositeCalendarService } from './CompositeCalendarService';

import type { IPageService } from "@/services/interfaces/IPageService";
import { DirectusPageService } from "@/services/directus/DirectusPageService";
import { MockPageService } from "@/services/mock/MockPageService";

import type { IHeroService } from "@/services/interfaces/IHeroService";
import { DirectusHeroService } from "@/services/directus/DirectusHeroService";
import { MockHeroService } from "@/services/mock/MockHeroService";

// alongside your existing USE_MOCK_NEWS / USE_MOCK_EVENTS style flags
const USE_MOCK_PAGES = process.env.NEXT_PUBLIC_USE_MOCK_PAGES === "true";
const USE_MOCK_HERO = process.env.NEXT_PUBLIC_USE_MOCK_HERO === "true";

export function getPageService(): IPageService {
  return USE_MOCK_PAGES ? new MockPageService() : new DirectusPageService();
}

export function getHeroService(): IHeroService {
  return USE_MOCK_HERO ? new MockHeroService() : new DirectusHeroService();
}

const useMock = false;

export const NewsService: INewsService =
    new DirectusNewsService();

export const EventService: IEventService =
    useMock
        ? new MockEventService()
        : new DirectusEventService();

export function getCalendarService(): ICalendarService {
  const sources: ICalendarService[] = [
    // Reuses the EventService singleton above — not a fresh instance —
    // so this stays consistent with useMock and whatever DirectusEventService
    // is already configured with.
    new DirectusCalendarService(EventService),
  ];

  // Optional: a published ICS feed (a school-managed O365 calendar, term
  // dates, whatever). Set the env var only once you have a feed URL —
  // omit it and the calendar just runs on Directus alone.
  if (process.env.NEXT_PUBLIC_TERM_DATES_ICS_URL) {
    sources.push(
      new IcsCalendarService({
        url: process.env.NEXT_PUBLIC_TERM_DATES_ICS_URL,
        label: 'term-dates',
      })
    );
  }

  // Later: same pattern for Office365CalendarService (Graph API) and
  // BromcomCalendarService once those exist — just push another source.

  return new CompositeCalendarService(sources);
}
