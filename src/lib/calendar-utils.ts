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

export type CalendarNoteInput =
  | {
      kind: "date";
      date: string;
      text: string;
      color: string;
    }
  | {
      kind: "range";
      rangeStart: string;
      rangeEnd: string;
      text: string;
      color: string;
    };

export interface CalendarNote extends CalendarNoteInput {
  id: string;
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

export function getNormalizedRangeKeys(range: DateRange): { start: string; end: string } | null {
  if (!range.start || !range.end) return null;
  const [start, end] = range.start < range.end ? [range.start, range.end] : [range.end, range.start];

  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  };
}

export function noteMatchesDate(note: CalendarNote, date: Date | string): boolean {
  const dateKey = typeof date === "string" ? date : format(date, "yyyy-MM-dd");

  if (note.kind === "date") {
    return note.date === dateKey;
  }

  return dateKey >= note.rangeStart && dateKey <= note.rangeEnd;
}

export function getNotesForMonth(notes: CalendarNote[], month: Date): CalendarNote[] {
  const monthStr = format(month, "yyyy-MM");
  return notes.filter((note) => {
    if (note.kind === "date") {
      return note.date.startsWith(monthStr);
    }

    return note.rangeStart.slice(0, 7) <= monthStr && note.rangeEnd.slice(0, 7) >= monthStr;
  });
}

function createFallbackId(index: number): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `legacy-note-${index}`;
}

function normalizeLoadedNote(note: unknown, index: number): CalendarNote | null {
  if (!note || typeof note !== "object") return null;

  const candidate = note as Partial<CalendarNote> & { kind?: string };
  const id = typeof candidate.id === "string" && candidate.id ? candidate.id : createFallbackId(index);
  const text = typeof candidate.text === "string" ? candidate.text.trim() : "";
  const color = typeof candidate.color === "string" ? candidate.color : NOTE_COLORS[0];

  if (!text) return null;

  if (candidate.kind === "range" && typeof candidate.rangeStart === "string" && typeof candidate.rangeEnd === "string") {
    const [rangeStart, rangeEnd] =
      candidate.rangeStart <= candidate.rangeEnd
        ? [candidate.rangeStart, candidate.rangeEnd]
        : [candidate.rangeEnd, candidate.rangeStart];

    return {
      id,
      kind: "range",
      rangeStart,
      rangeEnd,
      text,
      color,
    };
  }

  if (typeof candidate.date === "string") {
    return {
      id,
      kind: "date",
      date: candidate.date,
      text,
      color,
    };
  }

  return null;
}

export function loadNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem("calendar-notes");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((note, index) => normalizeLoadedNote(note, index))
      .filter((note): note is CalendarNote => note !== null);
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
