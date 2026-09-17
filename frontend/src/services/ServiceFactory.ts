// frontend/src/services/ServiceFactory.ts
//
// Your real file, with Flipbooks merged in the same way Blog/Alumni were —
// everything else below is exactly what you pasted, unchanged.

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

import type { IMenuService } from "@/services/interfaces/IMenuService";
import { DirectusMenuService } from "@/services/directus/DirectusMenuService";
import { MockMenuService } from "@/services/mock/MockMenuService";

import type { IDocumentService } from "@/services/interfaces/IDocumentService";
import { DirectusDocumentService } from "@/services/directus/DirectusDocumentService";
import { MockDocumentService } from "@/services/mock/MockDocumentService";

import type { IBlogService } from "@/services/interfaces/IBlogService";
import { DirectusBlogService } from "@/services/directus/DirectusBlogService";
import { MockBlogService } from "@/services/mock/MockBlogService";

import type { IAlumniService } from "@/services/interfaces/IAlumniService";
import { DirectusAlumniService } from "@/services/directus/DirectusAlumniService";
import { MockAlumniService } from "@/services/mock/MockAlumniService";

import type { IQuickLinkService } from "@/services/interfaces/IQuickLinkService";
import { DirectusQuickLinkService } from "@/services/directus/DirectusQuickLinkService";
import { MockQuickLinkService } from "@/services/mock/MockQuickLinkService";

import type { IFeaturedVideoService } from "@/services/interfaces/IFeaturedVideoService";
import { DirectusFeaturedVideoService } from "@/services/directus/DirectusFeaturedVideoService";
import { MockFeaturedVideoService } from "@/services/mock/MockFeaturedVideoService";

import type { IFlipbookService } from "@/services/interfaces/IFlipbookService";
import { DirectusFlipbookService } from "@/services/directus/DirectusFlipbookService";
import { MockFlipbookService } from "@/services/mock/MockFlipbookService";

// alongside your existing USE_MOCK_NEWS / USE_MOCK_EVENTS style flags
const USE_MOCK_PAGES = process.env.NEXT_PUBLIC_USE_MOCK_PAGES === "true";
const USE_MOCK_HERO = process.env.NEXT_PUBLIC_USE_MOCK_HERO === "true";
const USE_MOCK_MENU = process.env.NEXT_PUBLIC_USE_MOCK_MENU === "true";
const USE_MOCK_DOCUMENTS = process.env.NEXT_PUBLIC_USE_MOCK_DOCUMENTS === "true";
const USE_MOCK_BLOG = process.env.NEXT_PUBLIC_USE_MOCK_BLOG === "true";
const USE_MOCK_ALUMNI = process.env.NEXT_PUBLIC_USE_MOCK_ALUMNI === "true";
const USE_MOCK_QUICKLINKS = process.env.NEXT_PUBLIC_USE_MOCK_QUICKLINKS === "true";
const USE_MOCK_FEATURED_VIDEOS = process.env.NEXT_PUBLIC_USE_MOCK_FEATURED_VIDEOS === "true";
const USE_MOCK_FLIPBOOKS = process.env.NEXT_PUBLIC_USE_MOCK_FLIPBOOKS === "true";

export function getPageService(): IPageService {
  return USE_MOCK_PAGES ? new MockPageService() : new DirectusPageService();
}

export function getHeroService(): IHeroService {
  return USE_MOCK_HERO ? new MockHeroService() : new DirectusHeroService();
}

export function getMenuService(): IMenuService {
  return USE_MOCK_MENU ? new MockMenuService() : new DirectusMenuService();
}

export function getDocumentService(): IDocumentService {
  return USE_MOCK_DOCUMENTS ? new MockDocumentService() : new DirectusDocumentService();
}

export function getBlogService(): IBlogService {
  return USE_MOCK_BLOG ? new MockBlogService() : new DirectusBlogService();
}

export function getAlumniService(): IAlumniService {
  return USE_MOCK_ALUMNI ? new MockAlumniService() : new DirectusAlumniService();
}

export function getQuickLinkService(): IQuickLinkService {
  return USE_MOCK_QUICKLINKS ? new MockQuickLinkService() : new DirectusQuickLinkService();
}

export function getFeaturedVideoService(): IFeaturedVideoService {
  return USE_MOCK_FEATURED_VIDEOS ? new MockFeaturedVideoService() : new DirectusFeaturedVideoService();
}

export function getFlipbookService(): IFlipbookService {
  return USE_MOCK_FLIPBOOKS ? new MockFlipbookService() : new DirectusFlipbookService();
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
  // Deliberately NOT prefixed NEXT_PUBLIC_ — this URL is effectively a
  // bearer token (anyone with it can read the school's calendar), and this
  // service only ever runs server-side, so it should stay a server-only
  // runtime env var rather than get baked into the public JS bundle.
  if (process.env.TERM_DATES_ICS_URL) {
    sources.push(
      new IcsCalendarService({
        url: process.env.TERM_DATES_ICS_URL,
        label: 'term-dates',
      })
    );
  }

  // Later: same pattern for Office365CalendarService (Graph API) and
  // BromcomCalendarService once those exist — just push another source.

  return new CompositeCalendarService(sources);
}
