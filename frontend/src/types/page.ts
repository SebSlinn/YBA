// Public import path for the Page domain type.
// Components should import from "@/types/page", not "@/domain/page/Page"
// directly — this indirection is intentional, matching the News/Event
// pattern (see 01-architecture-overview.md).
export type { Page, PageStatus } from "@/domain/page/Page";
