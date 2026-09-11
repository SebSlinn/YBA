# Documents & Policies feature

Companion doc for the Documents & Policies page — same pattern as
`05-content-pages-feature.md` / `06-menus-feature.md` / `07-live-preview-feature.md`.
Delivered as files (no repo/Directus access from this chat), following the
same service-layer conventions confirmed in the architecture overview.

## What this covers

One page (`/documents`) listing policies, forms and reference documents,
grouped into categories so a visitor can find the relevant one quickly. A
single generic Directus collection (`documents`) backs it, handling three
different ways a document's content actually lives:

- **file** — an uploaded PDF (or other file)
- **link** — a URL to something hosted elsewhere (e.g. Welsh Government exam
  data)
- **page** — a relation to the existing generic `pages` collection, for
  policies that need to be structured/formatted content rather than a
  download — this reuses the RichText/DOMPurify sanitization already built
  for the Pages feature rather than duplicating a second WYSIWYG field.

This mirrors the `link_type` pattern already used in `menu_items`
(internal/external switched by a type field with Directus Conditions) —
extended here to three types instead of two.

## Defaults chosen (not yet confirmed with the headteacher)

Since requirements haven't been discussed with her yet, these are the
pragmatic defaults built in — all easy to change without a schema rewrite:

- **Category is free text**, not a fixed dropdown list or a separate
  categories collection. Staff can type any category name in Directus and
  it'll group correctly on the page automatically — no code change needed
  to add "Extra-Curricular" or "Pastoral Care" as a new group later. If you
  want to *guide* staff toward consistent naming, set the field's Directus
  interface to "Dropdown (Select)" with **Allow Other** turned on and seed
  it with a starter list (e.g. Safeguarding, SEND & Inclusion, Curriculum &
  Exams, Admissions, General) — that's a Directus admin setting, not a code
  change.
- **Expiry is captured but not shown publicly.** `expiry_date` is on the
  collection so it's there when you want it, but the public page doesn't
  do anything with it yet (no "expired" badge, no filtering) — in keeping
  with the project's steer against building audience/capability-based
  logic ahead of an actual need. A "policies due for review" view for staff
  would be a small follow-up, not a rebuild.
- **Route is `/documents`, titled "Documents & Policies".** Trivial to
  rename to `/policies` or similar if she prefers — one line in
  `app/(site)/documents/page.tsx`'s metadata (best done as literally
  renaming the folder).
- **Look is a plain, uniform card/button grid** — one visual style for
  every document regardless of type (icon changes colour/shape per type:
  PDF, external link, or document icon), grouped under a category heading.
  This is deliberately the "simple set of buttons, looking nice" version.
  If she wants something more elaborate later (featured documents, a
  search box, different card sizes per category), that's a change to
  `DocumentButton.tsx` / `DocumentCategorySection.tsx` only — the data
  model and service layer underneath don't need to change.

## Directus setup

1. **Create collection `documents`.**
   - Same admin-only visibility pattern as `pages`/`menu_items` (Public role
     read access set the same way — see the licensing note in the
     architecture overview about All Access vs Custom rules).

2. **Fields** (suggested order):

   | Field | Interface | Notes |
   |---|---|---|
   | `title` | Input | required |
   | `category` | Input, or Dropdown+Allow Other | required — see defaults above |
   | `document_type` | Dropdown (Select) | options: `file`, `link`, `page`; required; default `file` |
   | `file` | File | **Condition:** only visible when `document_type` = `file` |
   | `external_url` | Input (URL) | **Condition:** only visible when `document_type` = `link` |
   | `page` | Many-to-One → `pages` | **Condition:** only visible when `document_type` = `page` |
   | `summary` | Textarea (short) | optional, shown under the title on the button |
   | `review_date` | Date | optional |
   | `expiry_date` | Date | optional |
   | `sort` | Input (integer) | orders items within a category |
   | `status` | Dropdown (Select) | `draft` / `published` / `archived`, **lowercase values** — matches the convention already confirmed for News/Events/Hero/Menu/Pages (the admin UI can still *label* them "Draft"/"Published"/"Archived") |

   Use Directus **Conditions** on `file`/`external_url`/`page` exactly like
   `menu_items.path` / `menu_items.external_url` already do for
   `link_type` — same mechanism, one more branch.

3. **Permissions:** give the Public role read access filtered to
   `status = published`, same as the other public collections.

## Frontend wiring

- All files are under `frontend/src/...` in this delivery, already using
  real path-comment headers and the confirmed relative-import conventions
  (`./client/DirectusClient`, `../mappers/...`, `../interfaces/...`).
- **`ServiceFactory.ts` is not delivered as a full file** — see
  `ServiceFactory.PATCH.md` for the exact snippet to add
  (`getDocumentService()` + `USE_MOCK_DOCUMENTS` flag), since this session
  doesn't have the current live file to safely merge into.
- To develop against the mock data before the Directus collection exists,
  set `NEXT_PUBLIC_USE_MOCK_DOCUMENTS=true` in `frontend/.env`.
- **Linking to the page:** no new menu code is needed — the existing
  dynamic menu feature already supports an internal link by path. Add a
  `menu_items` entry in Directus with `link_type = internal`,
  `path = /documents`, label "Documents & Policies", in whichever menu
  location (`primary`/footer) you want it to appear.
- The route lives inside `app/(site)/documents/`, so it's automatically
  wrapped by the shared `(site)` layout (`Header`/`Footer` already applied)
  — no separate homepage-style wiring needed like Hero/Menu required.

## Open questions for the headteacher conversation

Worth a quick confirm, though none of these block building this MVP:

- Are the five starter categories (Safeguarding, SEND & Inclusion,
  Curriculum & Exams, Admissions, General) roughly the right groupings, or
  does she have a preferred set?
- Roughly how many documents in total, and are most of them PDFs she'll
  upload, or is a meaningful chunk external links / structured content?
- Any preference on card size/density, or icons vs. no icons — the current
  build uses small circular type-icons (PDF/link/document) next to each
  title.
- Does she want expiry-driven behaviour on the public page at all (e.g. an
  "under review" note), or is that purely an internal staff concern?
