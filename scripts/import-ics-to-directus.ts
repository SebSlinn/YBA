#!/usr/bin/env node
/**
 * Imports events from an .ics file or URL into the Directus `events`
 * collection, so staff can review and edit them in Directus like any
 * other event afterwards.
 *
 * Idempotent: re-running it updates previously-imported events (matched
 * by external_uid) instead of duplicating them, and never touches events
 * created by hand in Directus (those have no external_uid).
 *
 * REQUIRES two new fields on the `events` collection — add these via the
 * Directus admin UI before running this:
 *   - external_uid   (string, nullable) — the ICS UID; used to match on re-import
 *   - source         (string, nullable) — "ics_import" for these; blank/null for manual events
 *
 * Field names below (start_date, end_date, content, location, status)
 * assume they match your existing DirectusEvent raw shape — adjust if
 * your actual collection uses different field names.
 *
 * Usage:
 *   DIRECTUS_IMPORT_TOKEN=xxx npx tsx scripts/import-ics-to-directus.ts ./term-dates.ics
 *   DIRECTUS_IMPORT_TOKEN=xxx npx tsx scripts/import-ics-to-directus.ts https://outlook.office365.com/owa/calendar/xxx/calendar.ics
 *
 * Requires: npm install @directus/sdk ical.js
 */

import { createDirectus, rest, staticToken, readItems, createItem, updateItem } from '@directus/sdk';
import ICAL from 'ical.js';
import { readFileSync } from 'fs';

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_IMPORT_TOKEN;

if (!DIRECTUS_TOKEN) {
  console.error('Set DIRECTUS_IMPORT_TOKEN (a Directus static token with write access to `events`) before running this script.');
  process.exit(1);
}

const directus = createDirectus(DIRECTUS_URL).with(staticToken(DIRECTUS_TOKEN)).with(rest());

async function loadIcsText(source: string): Promise<string> {
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`);
    return res.text();
  }
  return readFileSync(source, 'utf-8');
}

function slugify(title: string, uid: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  // append a short uid fragment so two same-titled events (e.g. two "INSET Day" entries) don't collide
  return `${base}-${uid.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase()}`;
}

async function main() {
  const source = process.argv[2];
  if (!source) {
    console.error('Usage: import-ics-to-directus.ts <file-path-or-url>');
    process.exit(1);
  }

  const icsText = await loadIcsText(source);
  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');

  console.log(`Found ${vevents.length} event(s) in ${source}`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const vevent of vevents) {
    try {
      const event = new ICAL.Event(vevent);
      const uid = event.uid;

      const payload = {
        title: event.summary || 'Untitled event',
        content: event.description || '',
        start_date: event.startDate.toJSDate().toISOString(),
        end_date: event.endDate ? event.endDate.toJSDate().toISOString() : null,
        location: event.location || null,
        status: 'Scheduled' as const,
        external_uid: uid,
        source: 'ics_import',
      };

      const existing = await directus.request(
        readItems('events', {
          filter: { external_uid: { _eq: uid } },
          limit: 1,
        })
      );

      if (existing.length > 0) {
        await directus.request(updateItem('events', existing[0].id, payload));
        updated++;
      } else {
        await directus.request(
          createItem('events', {
            ...payload,
            slug: slugify(payload.title, uid),
          })
        );
        created++;
      }
    } catch (err) {
      console.error('Skipping one event due to an error:', err);
      skipped++;
    }
  }

  console.log(`Import complete: ${created} created, ${updated} updated, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
