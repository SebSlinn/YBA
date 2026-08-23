//frontend/src/services/ServiceFactory.ts

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
// import { getEventService } from './ServiceFactory'; // whatever your existing accessor is called


const useMock = false;

export const NewsService: INewsService =
    new DirectusNewsService();
  
export const EventService: IEventService =
    useMock
        ? new MockEventService()
        : new DirectusEventService();

        export function getCalendarService(): ICalendarService {
  const sources: ICalendarService[] = [
    new DirectusCalendarService(EventService), // editorial events, already live
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