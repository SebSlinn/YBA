//frontend/src/services/ServiceFactory.ts

import { MockNewsService } from "./mock/MockNewsService";
import { DirectusNewsService } from "./directus/DirectusNewsService";
import { INewsService } from "./interfaces/INewsService";

import { MockEventService } from "./mock/MockEventService";
import { DirectusEventService } from "./directus/DirectusEventService";
import { IEventService } from "./interfaces/IEventService";


const useMock = false;

export const NewsService: INewsService =
    new DirectusNewsService();
  
export const EventService: IEventService =
    useMock
        ? new MockEventService()
        : new DirectusEventService();