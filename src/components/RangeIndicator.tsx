import { DateRange, format } from "@/lib/calendar-utils";
import { CalendarRange, X } from "lucide-react";

interface RangeIndicatorProps {
  range: DateRange;
  onClear: () => void;
}

const RangeIndicator = ({ range, onClear }: RangeIndicatorProps) => {
  if (!range.start) return null;

  const dayCount = range.end
    ? Math.floor(Math.abs(range.end.getTime() - range.start.getTime()) / 86400000) + 1
    : 1;

  return (
    <div className="range-indicator flex items-center gap-3 px-4 py-3 sm:px-6 animate-fade-slide-up">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarRange className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Selected Range</span>
        <span className="text-sm font-medium text-foreground/80">
          {format(range.start, "MMM d")}
          {range.end && ` - ${format(range.end, "MMM d")}`}
        </span>
      </div>
      <span className="ml-auto rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        {dayCount} {dayCount === 1 ? "day" : "days"}
      </span>
      <button onClick={onClear} className="text-muted-foreground transition-colors hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RangeIndicator;
