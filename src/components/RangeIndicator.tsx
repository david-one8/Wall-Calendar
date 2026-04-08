import { DateRange, format } from "@/lib/calendar-utils";
import { CalendarRange, X } from "lucide-react";

interface RangeIndicatorProps {
  range: DateRange;
  onClear: () => void;
}

const RangeIndicator = ({ range, onClear }: RangeIndicatorProps) => {
  if (!range.start) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 sm:px-6 bg-calendar-range/50 animate-fade-slide-up">
      <CalendarRange className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-medium text-foreground/80">
        {format(range.start, "MMM d")}
        {range.end && ` - ${format(range.end, "MMM d")}`}
      </span>
      <button onClick={onClear} className="ml-auto text-muted-foreground transition-colors hover:text-foreground">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default RangeIndicator;
