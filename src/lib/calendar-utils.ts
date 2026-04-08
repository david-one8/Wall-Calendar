import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isWeekend,
  format,
  addMonths,
  subMonths,
} from "date-fns";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  date: string; // ISO date key
  text: string;
  color: string;
}

const US_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "07-04": "Independence Day",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
  "02-14": "Valentine's Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
};

export function getCalendarDays(month: Date): CalendarDay[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const today = new Date();

  return eachDayOfInterval({ start, end }).map((date) => {
    const mmdd = format(date, "MM-dd");
    return {
      date,
      isCurrentMonth: isSameMonth(date, month),
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      isHoliday: !!US_HOLIDAYS[mmdd],
      holidayName: US_HOLIDAYS[mmdd],
    };
  });
}

export function isInRange(date: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  const s = range.start < range.end ? range.start : range.end;
  const e = range.start < range.end ? range.end : range.start;
  return isWithinInterval(date, { start: s, end: e });
}

export function isRangeStart(date: Date, range: DateRange): boolean {
  if (!range.start) return false;
  const s = range.end && range.end < range.start ? range.end : range.start;
  return isSameDay(date, s);
}

export function isRangeEnd(date: Date, range: DateRange): boolean {
  if (!range.end) return false;
  const e = range.end < range.start! ? range.start! : range.end;
  return isSameDay(date, e);
}

export function getNotesForMonth(notes: CalendarNote[], month: Date): CalendarNote[] {
  const monthStr = format(month, "yyyy-MM");
  return notes.filter((n) => n.date.startsWith(monthStr));
}

export function loadNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem("calendar-notes");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: CalendarNote[]) {
  localStorage.setItem("calendar-notes", JSON.stringify(notes));
}

export const NOTE_COLORS = [
  "hsl(48 60% 95%)",
  "hsl(18 55% 92%)",
  "hsl(150 35% 92%)",
  "hsl(200 45% 92%)",
  "hsl(280 35% 93%)",
];

export const MONTH_IMAGES: Record<number, string> = {};

export { addMonths, subMonths, format, isSameDay };
