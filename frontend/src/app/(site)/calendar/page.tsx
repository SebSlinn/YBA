import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { SchoolCalendar } from '@/components/calendar/SchoolCalendar';
import { getCalendarService } from '@/services/ServiceFactory';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-cal-display', weight: ['500', '600'] });
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-cal-body', weight: ['400', '500', '600'] });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-cal-mono', weight: ['400', '600'] });

// Replace with your school's real dates — sourced by hand for now, or from
// a Directus "term dates" record later if one gets built.
const SCHOOL_YEAR = {
  start: new Date(2026, 8, 1), // 1 Sep 2026
  end: new Date(2027, 7, 31), // 31 Aug 2027
  terms: [
    { label: 'Autumn term', start: new Date(2026, 8, 1), end: new Date(2026, 11, 18) },
    { label: 'Spring term', start: new Date(2027, 0, 5), end: new Date(2027, 3, 1) },
    { label: 'Summer term', start: new Date(2027, 3, 19), end: new Date(2027, 6, 22) },
  ],
};

export default async function CalendarPage() {
  const calendarService = getCalendarService();
  const events = await calendarService.getEvents();

  return (
    <main className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
        <SchoolCalendar events={events} schoolYear={SCHOOL_YEAR} />
      </div>
    </main>
  );
}
