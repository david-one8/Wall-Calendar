import { useState, useCallback, useEffect } from "react";
import {
  getCalendarDays,
  DateRange,
  CalendarNote,
  loadNotes,
  saveNotes,
  addMonths,
  subMonths,
  isSameDay,
} from "@/lib/calendar-utils";
import CalendarSpiral from "./CalendarSpiral";
import CalendarHeroImage from "./CalendarHeroImage";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarNotes from "./CalendarNotes";
import RangeIndicator from "./RangeIndicator";

const WallCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<CalendarNote[]>(loadNotes);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getCalendarDays(currentMonth);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const flipAndSet = useCallback((newMonth: Date) => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth(newMonth);
      setIsFlipping(false);
    }, 250);
  }, []);

  const handlePrev = () => flipAndSet(subMonths(currentMonth, 1));
  const handleNext = () => flipAndSet(addMonths(currentMonth, 1));
  const handleToday = () => flipAndSet(new Date());

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    if (!range.start || (range.start && range.end)) {
      // Start new selection
      setRange({ start: date, end: null });
      setIsSelecting(true);
    } else {
      // Complete selection
      setRange({ start: range.start, end: date });
      setIsSelecting(false);
    }
  };

  const handleDayHover = (date: Date) => {
    if (isSelecting) setHoverDate(date);
  };

  const clearRange = () => {
    setRange({ start: null, end: null });
    setIsSelecting(false);
    setHoverDate(null);
  };

  const addNote = (note: Omit<CalendarNote, "id">) => {
    const newNote: CalendarNote = { ...note, id: crypto.randomUUID() };
    setNotes((prev) => [...prev, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Calendar Panel */}
        <div className="flex-1 calendar-paper rounded-xl overflow-hidden">
          <CalendarSpiral />
          <CalendarHeroImage month={currentMonth.getMonth()} />
          <CalendarHeader
            currentMonth={currentMonth}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            isFlipping={isFlipping}
          />
          <RangeIndicator range={range} onClear={clearRange} />
          <CalendarGrid
            days={days}
            range={range}
            notes={notes}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            hoverDate={hoverDate}
            isSelecting={isSelecting}
          />
          {/* Footer */}
          <div className="flex items-center justify-center gap-4 px-4 py-2 text-[10px] text-muted-foreground border-t border-border/50">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-calendar-today" /> Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-calendar-weekend" /> Weekend
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-calendar-holiday" /> Holiday
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> Selected
            </span>
          </div>
        </div>

        {/* Notes Panel */}
        <div className="w-full lg:w-80 calendar-paper rounded-xl overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
          <CalendarNotes
            notes={notes}
            selectedDate={selectedDate}
            onAdd={addNote}
            onDelete={deleteNote}
          />
        </div>
      </div>
    </div>
  );
};

export default WallCalendar;
