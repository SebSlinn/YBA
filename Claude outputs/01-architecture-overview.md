# YBA Website — Architecture Overview

*Load this doc into every new chat as baseline context, regardless of topic.*

## What this project is

A rebuild of Ysgol Bryn Alyn's school website. Replacing WordPress
(currently at ysgolbrynalyn.co.uk) with a Next.js + headless CMS stack,
deliberately structured in layers so each layer — and each component within
a layer — can be worked on with limited visibility into the rest.

## The stack

- **Next.js** (React, TypeScript) — the frontend. Presentation only; it
  holds no content of its own.
- **Directus** — a headless CMS. Source of truth for editorial content
  (news, events, pages, media, menus), with its own admin UI for
  non-technical staff to edit content, and an auto-generated API the
  frontend calls. Self-hosted, currently v12.1.1, on the MSCL licensing
  model — custom permission rules (Access Control → Policy → collection →
  Use Custom) are gated behind a paid plan unless a free licence key is
  obtained via the Open Innovation Grant; without one, the Public role is
  limited to All Access/No Access (currently running on All Access as an
  interim workaround).
- **PostgreSQL** — the database behind Directus.
- **Docker Compose** — each piece (Next.js, Directus, Postgres) runs as its
  own container, wired together by one `docker-compose.yml`.

These are genuinely separate processes talking over HTTP — Next.js and
Directus never share memory, and Directus's schema/data lives entirely in
its own service, not in the application codebase.

## The three logical layers

```
Directus (CMS / data)  →  Service Layer  →  React Components (presentation)
```

1. **Directus (content layer)** — source of truth for editorial content.
   Schema is defined and managed inside Directus itself (via its admin UI),
   not in application code.

2. **Service layer** (`frontend/src/services/`) — this is the layer that
   creates the isolation the project is aiming for. **Components never
   talk to Directus directly.** Every content type goes through:
   - an **interface** (`INewsService`, `IEventService`, `IPageService`,
     `IHeroService`, `IMenuService`, `ICalendarService`) — defines exactly
     what a component is allowed to ask for. This is the seam: swap the
     implementation without touching any component, and a
     component-focused chat only ever needs to see the interface, not the
     implementation behind it.
   - a **Directus implementation** (`DirectusNewsService`,
     `DirectusEventService`, `DirectusPageService`, `DirectusHeroService`,
     `DirectusMenuService`, `DirectusCalendarService`) — calls Directus via
     its SDK.
   - a **mock implementation** (`MockNewsService`, `MockEventService`,
     `MockPageService`, `MockHeroService`, `MockMenuService`) — an
     in-memory stand-in, useful for frontend work before a CMS collection
     exists or is wired up.
   - a **mapper** (`DirectusNewsMapper`, `DirectusEventMapper`,
     `DirectusPageMapper`, `DirectusHeroMapper`, `DirectusMenuMapper`) —
     converts Directus's raw field shape (snake_case, e.g.
     `featured_image`, `publish_date`) into the app's own domain type
     (camelCase, e.g. `featuredImage`, a resolved full asset URL). This is
     what keeps Directus's specific field naming out of every component.
     Mapper static methods are named `toXxx()` (e.g. `toNewsArticle`,
     `toPage`, `toMenuTree`) — **not** `toDomain()`.
   - a **domain type** (`src/domain/news/NewsArticle.ts`,
     `src/domain/event/Event.ts`, `src/domain/page/Page.ts`,
     `src/domain/hero/HeroSlide.ts`, `src/domain/menu/MenuItem.ts`) — the
     shape components actually consume.
   - a single switch point, `ServiceFactory.ts` — one file decides, per
     content type, whether the app uses the mock or the real Directus
     service. Nothing else in the app needs to know which one is active.

3. **React components / pages** (`frontend/src/app/`,
   `frontend/src/components/`) — presentation only. Pages under
   `src/app/` use Next.js's **App Router**: a folder = a route
   (`app/(site)/news/[slug]/page.tsx` → `/news/some-article-slug`). Pages
   call a service (via `ServiceFactory`) to get data, then hand it to
   presentational components (`NewsCard`, `EventCard`, etc.) to render.
   These leaf components take plain props and have no data-fetching logic
   of their own — which is exactly what makes them workable in isolation.
   Components are organized by feature under `components/` (`calendar/`,
   `common/`, `events/`, `landing/`, `layout/`, `news/`, `pages/`, `ui/`).

   Two entry points currently render `<Header/>` and need to be kept in
   sync if `Header`'s props ever change: `app/(site)/layout.tsx` (wraps
   every route inside the `(site)` route group) and `app/page.tsx` (the
   homepage — it is **not** inside `(site)/`, so it isn't wrapped by that
   layout and renders its own `<Header/>`/`<Footer/>` independently).

### Real folder conventions (confirmed from the actual codebase)

The layout below is what's actually on disk, which differs in a couple of
places from what you'd guess from the layer description above:

```
frontend/src/
  domain/
    news/NewsArticle.ts
    event/Event.ts
    page/Page.ts
    hero/HeroSlide.ts
    menu/MenuItem.ts
    calendar/CalendarEvent.ts
  types/                     ← legacy re-export layer, News/Event only (see note below)
    news.ts
    event.ts
  services/
    ServiceFactory.ts
    interfaces/
      INewsService.ts
      IEventService.ts
      IPageService.ts
      IHeroService.ts
      IMenuService.ts
      ICalendarService.ts
    mappers/                 ← sibling of directus/, NOT nested inside it
      DirectusNewsMapper.ts
      DirectusEventMapper.ts
      DirectusPageMapper.ts
      DirectusHeroMapper.ts
      DirectusMenuMapper.ts
    mock/                    ← sibling of directus/
      MockNewsService.ts
      MockEventService.ts
      MockPageService.ts
      MockHeroService.ts
      MockMenuService.ts
    directus/
      DirectusNewsService.ts
      DirectusEventService.ts
      DirectusPageService.ts
      DirectusHeroService.ts
      DirectusMenuService.ts
      DirectusCalendarService.ts
      client/
        DirectusClient.ts    ← exports `directus` (SDK client) + getAssetUrl()
      types/                 ← sibling of client/, raw Directus row shapes
        DirectusNews.ts
        DirectusEvent.ts
        DirectusPage.ts
        DirectusHero.ts
        DirectusMenuItem.ts
        DirectusSchema.ts
    ics/
      IcsCalendarService.ts
      icsParser.ts
    CompositeCalendarService.ts
```

Notes on conventions that diverge from what you might assume:

- **The `@/types/*` re-export layer is not universal.** It was the
  original pattern (`@/types/news` → `@/domain/news/NewsArticle`), and
  News/Event still use it. Every feature built since (Pages, Hero, Menu)
  imports its domain type directly via `@/domain/...` in service files,
  bypassing `@/types/*` entirely. Don't assume a new domain type needs a
  `types/` re-export — it doesn't, unless you're specifically matching the
  older pattern.
- Within `services/directus/*.ts`, imports to sibling folders are
  relative: `./client/DirectusClient`, `./types/DirectusXxx`,
  `../mappers/DirectusXxxMapper`, `../interfaces/IXxxService`.
- Directus SDK calls use `directus.request(readItems("collection", {...}))`
  and cast the result `as DirectusXxx[]`, rather than passing a generic
  type parameter to `readItems`.
- `ServiceFactory.ts` is a **plain module of exported functions and
  consts** — not a class or object. Newer services (`getHeroService()`,
  `getPageService()`, `getMenuService()`) follow a `USE_MOCK_XXX` env-flag
  pattern (`NEXT_PUBLIC_USE_MOCK_HERO`, etc.); News/Event predate that
  pattern and are exported as ready-made singleton consts (`NewsService`,
  `EventService`) gated by a local `useMock` boolean instead. Call it as
  `getMenuService()` after `import { getMenuService } from
  "@/services/ServiceFactory"` — never `ServiceFactory.getMenuService()`.
- Directus status fields (News, Events, Hero, Menu, Pages) store
  **lowercase** values (`"published"`, `"draft"`, `"archived"`) even
  though the admin UI label reads "Published" — filter on the lowercase
  value, not the capitalized label.

## Planned integration layer

External systems (Bromcom MIS, Facebook, Instagram, Office365) sit behind
the same service-interface pattern, so the rest of the app never needs to
know which upstream a piece of data came from.

Calendar/events is the one currently built out: `CompositeCalendarService`
implements `ICalendarService`, merging `DirectusCalendarService`
(editorial/public events, wrapping the Events collection) with
`IcsCalendarService` (a published ICS feed URL, e.g. Office365's no-OAuth
"publish calendar as ICS link" option, merged at request time without
writing to Directus) into one `CalendarEvent[]`. A separate one-off/
periodic import script pulls ICS events into Directus as editable records
(idempotent via an `external_uid` field plus a `source` field) — this
lives at repo root `/scripts/`, not inside `frontend/`. Office365's Graph
API/OAuth route (needed for write-back or near-real-time sync rather than
a published feed) and Bromcom are not started. Facebook and Instagram
integrations are not started.

## Status

- **Foundation** (Docker Compose, Postgres, Directus, Next.js): done.
- **Frontend components**: Header, Hero, News, Events, Footer, calendar UI
  built; a shared design-system layer (buttons, cards, section titles)
  still hasn't been started.
- **CMS collections**:
  - **News** — fully live end-to-end.
  - **Events** — fully live end-to-end, feeding `CompositeCalendarService`.
  - **Hero** — fully live end-to-end, including Directus Focal Point
    support (pixel-based focal point converted to a CSS `object-position`
    percentage in the mapper, with cache-busting via the image's
    `modified_on` timestamp).
  - **Pages** — fully live end-to-end: generic `pages` collection
    (slug/title/WYSIWYG content) for standard content pages, sanitized via
    `RichText.tsx` (DOMPurify). Structured content that needs bespoke
    layout (curriculum, exam results, tables) still needs its own
    collection(s) rather than the generic pattern.
  - **Menus** — schema and code fully live end-to-end: one `menu_items`
    collection (`menu`, `parent`, `label`, `link_type`, `path`,
    `external_url`, `open_in_new_tab`, `sort`, `status`), with Directus
    field Conditions so `path` only shows when `link_type` is `internal`
    and `external_url` only shows when it's `external`. Supports
    location-based filtering only (the `menu` field, e.g. `primary`, with
    `footer` reserved for later) — deliberately **not** building
    user/capability-based menu filtering. Content is being added directly
    in the Directus admin UI as needed (the old hardcoded menu was
    speculative placeholder content, not real content to preserve).
  - **Documents** — not built.
- **Live Preview** — done. Real iframe preview of the live Next.js page
  (including drafts) from within Directus's editor: a dedicated
  `preview-bot` user/policy with a static token, Live Preview URL Template
  pointing at the site with `?preview=true&auth_token=...`, page routes
  detecting those params to bypass the published-only filter and show a
  draft banner, and CSP (`frame-ancestors` / `frame-src`) configured on
  both sides to allow the iframe.
- **Auth layer** — not started. Planned as a login layer on the Next.js
  site itself (separate from Directus's own admin auth), for gated areas
  like a parent/alumni portal. Not decided: session strategy (NextAuth/
  Auth.js vs custom), where identity lives, which areas need gating. Not a
  blocker for other work.
- **Integrations** (Facebook, Instagram, Office365 Graph/OAuth, Bromcom):
  not started (see Planned integration layer above for what calendar/ICS
  already covers without these).
- **Deployment**: hosted on an OVHcloud VPS-2 (Ubuntu, UK datacentre,
  Docker pre-installed), running directly at a bare IP
  (`198.244.232.142`) rather than through an auto-deploying host —
  **pushing to GitHub does not update the live site by itself.** Reverse
  proxy, a real domain, SSL, backups and monitoring are not set up yet;
  four places currently hardcode the temp IP and need updating together
  once a domain + SSL go live: the Directus Live Preview URL Template, the
  Directus CSP env var, `next.config.ts`'s `frame-ancestors` value, and
  the `NEXT_PUBLIC_DIRECTUS_URL` build arg.

## Deployment workflow

For any `next.config.ts` / component / service-layer change:

```
edit locally  →  npx tsc --noEmit  →  git add / commit / push
              →  on the VPS: git pull  →  docker compose up -d --build frontend
```

A plain restart is **not** enough for a frontend code or config change —
it needs the `--build`. Directus-side env var changes only need
`docker compose up -d directus` (no rebuild). SSH key auth from the VPS to
GitHub is set up, so `git pull` there doesn't prompt for a password.

**Known trap:** the root `.gitignore` has twice ended up saved in UTF-16
encoding (from a Windows tool doing a `>` redirect or similar) instead of
plain UTF-8/ASCII. Git silently fails to parse ignore rules out of a
UTF-16 file — every pattern in it (including `.env`) stops working, but
nothing errors, so it's easy to miss. If a file that should be ignored
(`.env`, a `.sql` backup, etc.) shows up as untracked despite being listed
in `.gitignore`, check the file's encoding before assuming the pattern is
wrong. `frontend/.gitignore` is a separate file scoped to `frontend/.env`
specifically; the root `.gitignore` covers `.env` repo-wide plus DB/
compose backup files.

## Ground rules worth respecting in any new chat

- **Don't let components call Directus directly** — always go through a
  service interface, even for a "quick" feature. That's the boundary that
  lets a frontend-only chat work without seeing the CMS layer at all.
- **Keep it pragmatic.** Prefer a simple, achievable structure over adding
  layers speculatively — resist over-engineering (e.g. don't add a
  generic CMS abstraction or a repository-of-repositories unless there's a
  concrete need for it). Don't pre-seed speculative content (e.g. menu
  items) — build the structure, let real content get added as needed.
- **Don't silently restructure.** If a chat wants to propose a structural
  change (e.g. swapping Directus for a different CMS — discussed but not
  decided, still an open question) that should come back as a flagged
  decision, not something just done in passing.
- **Comment the file path at the top of new source files** (e.g.
  `//frontend/src/services/ServiceFactory.ts`) — an established
  convention in this codebase, keep using it.
