/**
 * Calendar utilities for CAREER-GUD Mentor Consultations
 * Supports iCalendar (.ics) export and 1-click Google Calendar web deep-links.
 */

export interface CalendarEventData {
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // e.g. "17:00 - 17:45 IST"
  location?: string;
  meetingUrl?: string;
}

/**
 * Parses a slot string like "17:00 - 17:45 IST" into start and end HHMMSS in IST.
 */
function parseSlotTimes(slot: string): { startHHMM: string; endHHMM: string } {
  const match = slot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) {
    return { startHHMM: '170000', endHHMM: '174500' };
  }
  const [, startH, startM, endH, endM] = match;
  const pad = (s: string) => s.padStart(2, '0');
  return {
    startHHMM: `${pad(startH)}${pad(startM)}00`,
    endHHMM: `${pad(endH)}${pad(endM)}00`,
  };
}

/**
 * Converts YYYY-MM-DD to YYYYMMDD
 */
function formatDateBasic(dateStr: string): string {
  return dateStr.replace(/[^0-9]/g, '');
}

/**
 * Generates an RFC 5545 compliant .ics file string
 */
export function generateIcsContent(event: CalendarEventData): string {
  const { startHHMM, endHHMM } = parseSlotTimes(event.timeSlot);
  const basicDate = formatDateBasic(event.date);
  const uid = `careergud-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@career-gud.in`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const cleanDescription = (event.description + (event.meetingUrl ? `\n\nJoin Video Room: ${event.meetingUrl}` : ''))
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const location = event.meetingUrl || event.location || 'CAREER-GUD Private Video Session';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAREER-GUD//Mentorship Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Kolkata',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Kolkata:${basicDate}T${startHHMM}`,
    `DTEND;TZID=Asia/Kolkata:${basicDate}T${endHHMM}`,
    `SUMMARY:${event.title.replace(/[,;]/g, ' ')}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${location}`,
    event.meetingUrl ? `URL:${event.meetingUrl}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

/**
 * Triggers a browser file download for the .ics calendar file.
 */
export function downloadIcsFile(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a direct Google Calendar web link.
 */
export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const { startHHMM, endHHMM } = parseSlotTimes(event.timeSlot);
  const basicDate = formatDateBasic(event.date);

  // Approximate UTC by subtracting 5h30m for Google Calendar ISO UTC param
  // Or use dates with TZ via format YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS in Asia/Kolkata
  const dates = `${basicDate}T${startHHMM}/${basicDate}T${endHHMM}`;
  const details = `${event.description}${event.meetingUrl ? `\n\nJoin Video Room: ${event.meetingUrl}` : ''}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: dates,
    ctz: 'Asia/Kolkata',
    details: details,
    location: event.meetingUrl || event.location || 'Online Video Room',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
