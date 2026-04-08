import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
      <div className={`${isFlipping ? 'animate-page-flip' : ''}`}>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
          {format(currentMonth, "MMMM")}
        </h2>
        <p className="text-sm text-muted-foreground font-light tracking-widest uppercase">
          {format(currentMonth, "yyyy")}
        </p>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex"
        >
          Today
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CalendarHeader;
