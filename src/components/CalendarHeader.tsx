import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isFlipping: boolean;
}

const CalendarHeader = ({ currentMonth, onPrev, onNext, onToday, isFlipping }: CalendarHeaderProps) => {
  return (
    <div className="calendar-header flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
      <div className={`${isFlipping ? "animate-page-flip" : ""}`}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground shadow-sm">
          <Sparkles className="h-3 w-3 text-primary" />
          Monthly focus
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          {format(currentMonth, "MMMM")}
        </h2>
        <p className="text-sm text-muted-foreground font-light tracking-[0.35em] uppercase">
          {format(currentMonth, "yyyy")}
        </p>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          className="calendar-action-btn text-xs hidden sm:inline-flex"
        >
          Today
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrev} className="calendar-icon-btn h-9 w-9">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} className="calendar-icon-btn h-9 w-9">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CalendarHeader;
