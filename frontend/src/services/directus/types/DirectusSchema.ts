//frontend/src/services/directus/types/DirectusSchema.ts

import { DirectusNews } from "./DirectusNews";
import { DirectusEvent } from "./DirectusEvent";

export interface DirectusSchema {
    news: DirectusNews[];
    events: DirectusEvent[];
}