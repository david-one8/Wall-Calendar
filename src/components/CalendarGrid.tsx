import { cn } from "@/lib/utils";
import {
  CalendarDay,
  DateRange,
  CalendarNote,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isSameDay,
  format,
} from "@/lib/calendar-utils";

interface CalendarGridProps {
  days: CalendarDay[];
  range: DateRange;
  notes: CalendarNote[];
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  hoverDate: Date | null;
  isSelecting: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({ days, range, notes, onDayClick, onDayHover, hoverDate, isSelecting }: CalendarGridProps) => {
  const previewRange: DateRange =
    isSelecting && range.start && hoverDate
      ? { start: range.start, end: hoverDate }
      : range;

  const hasNote = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return notes.some((n) => n.date === key);
  };

  return (
    <div className="calendar-grid px-2 sm:px-4 pb-5">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((day, i) => {
          const inRange = isInRange(day.date, previewRange);
          const start = isRangeStart(day.date, previewRange);
          const end = isRangeEnd(day.date, previewRange);
          const selected = start || end;
          const notePresent = hasNote(day.date);

          return (
            <button
              key={i}
              onClick={() => onDayClick(day.date)}
              onMouseEnter={() => onDayHover(day.date)}
              className={cn(
                "calendar-day-card relative aspect-square flex flex-col items-center justify-center text-xs sm:text-sm transition-all duration-200 cursor-pointer",
                "hover:-translate-y-0.5",
                !day.isCurrentMonth && "opacity-25",
                day.isCurrentMonth && "opacity-100",
                // Range background
                inRange && !selected && "calendar-range-mid-bg",
                start && "rounded-l-lg",
                end && "rounded-r-lg",
                inRange && start && !end && "rounded-r-none",
                inRange && end && !start && "rounded-l-none",
                start && "calendar-range-start-cell",
                end && "calendar-range-end-cell",
              )}
            >
              <span
                className={cn(
                  "relative z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all duration-200",
                  selected && "font-semibold shadow-md",
                  start && "calendar-range-start-pill",
                  end && "calendar-range-end-pill",
                  selected && !start && !end && "bg-primary text-primary-foreground",
                  day.isToday && !selected && "ring-2 ring-calendar-today text-calendar-today font-bold",
                  day.isHoliday && !selected && !day.isToday && "text-calendar-holiday font-medium",
                  day.isWeekend && !selected && !day.isToday && !day.isHoliday && "text-calendar-weekend",
                )}
              >
                {format(day.date, "d")}
              </span>
              {start && (
                <span className="calendar-range-edge-label absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                  Start
                </span>
              )}
              {end && (
                <span className="calendar-range-edge-label calendar-range-edge-label-end absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                  End
                </span>
              )}
              {/* Note indicator dot */}
              {notePresent && day.isCurrentMonth && (
                <span className="absolute bottom-0.5 sm:bottom-1 w-1 h-1 rounded-full bg-primary/60" />
              )}
              {/* Holiday tiny label */}
              {day.isHoliday && day.isCurrentMonth && (
                <span className="absolute -bottom-0.5 text-[6px] sm:text-[7px] text-calendar-holiday whitespace-nowrap font-medium hidden lg:block">
                  {day.holidayName}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
