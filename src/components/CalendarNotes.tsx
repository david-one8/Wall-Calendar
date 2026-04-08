import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarNote, CalendarNoteInput, DateRange, NOTE_COLORS, format, getNormalizedRangeKeys } from "@/lib/calendar-utils";
import { ArrowDown, PenLine, Plus, Trash2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarNotesProps {
  notes: CalendarNote[];
  selectedDate: Date | null;
  range: DateRange;
  onAdd: (note: CalendarNoteInput) => void;
  onDelete: (id: string) => void;
}

const CalendarNotes = ({ notes, selectedDate, range, onAdd, onDelete }: CalendarNotesProps) => {
  const [text, setText] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [noteTarget, setNoteTarget] = useState<"date" | "range">("date");

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const dateLabel = selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date";
  const shortDateLabel = selectedDate ? format(selectedDate, "MMMM d") : "this day";
  const rangeKeys = getNormalizedRangeKeys(range);
  const rangeStart = range.start && range.end ? (range.start < range.end ? range.start : range.end) : null;
  const rangeEnd = range.start && range.end ? (range.start < range.end ? range.end : range.start) : null;
  const rangeLabel =
    rangeStart && rangeEnd
      ? `${format(rangeStart, "MMMM d")} - ${format(rangeEnd, "MMMM d, yyyy")}`
      : "Select a range";
  const hasRangeSelection = !!rangeKeys;
  const activeTarget = noteTarget === "range" && hasRangeSelection ? "range" : "date";
  const activeLabel = activeTarget === "range" ? rangeLabel : dateLabel;
  const canWriteNote = activeTarget === "range" ? hasRangeSelection : !!dateKey;
  const filtered = notes.filter((note) => {
    if (activeTarget === "range") {
      return !!rangeKeys && note.kind === "range" && note.rangeStart === rangeKeys.start && note.rangeEnd === rangeKeys.end;
    }

    return !!dateKey && note.kind === "date" && note.date === dateKey;
  });

  useEffect(() => {
    setNoteTarget(hasRangeSelection ? "range" : "date");
  }, [hasRangeSelection, rangeKeys?.start, rangeKeys?.end]);

  const handleAdd = () => {
    if (!text.trim()) return;

    const trimmedText = text.trim();

    if (activeTarget === "range" && rangeKeys) {
      onAdd({
        kind: "range",
        rangeStart: rangeKeys.start,
        rangeEnd: rangeKeys.end,
        text: trimmedText,
        color: NOTE_COLORS[colorIdx],
      });
    } else if (dateKey) {
      onAdd({
        kind: "date",
        date: dateKey,
        text: trimmedText,
        color: NOTE_COLORS[colorIdx],
      });
    } else {
      return;
    }

    setText("");
    setColorIdx((c) => (c + 1) % NOTE_COLORS.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="notes-header flex items-center gap-3 px-4 py-4 border-b border-border/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <StickyNote className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">Notes</h3>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {activeTarget === "range" ? "Pinned to selected range" : "Pinned to date"}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border/40 bg-background/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.18em]">
            {activeTarget === "range"
              ? hasRangeSelection
                ? activeLabel
                : "Complete a range to add notes"
              : dateKey
                ? activeLabel
                : "Click a date to add notes"}
          </p>
          {selectedDate && hasRangeSelection && (
            <div className="inline-flex rounded-full border border-border bg-background/85 p-1">
              <button
                type="button"
                onClick={() => setNoteTarget("date")}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  activeTarget === "date" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                Date
              </button>
              <button
                type="button"
                onClick={() => setNoteTarget("range")}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  activeTarget === "range" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                Range
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes list */}
      <div className="notes-scroll flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {filtered.length === 0 && canWriteNote && (
          <div className="notes-empty-state rounded-2xl px-4 py-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PenLine className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-foreground/80">
              {activeTarget === "range" ? "No notes yet for this range" : "No notes yet for this day"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Write your first note in the box below</p>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <ArrowDown className="h-3.5 w-3.5" />
              Start typing below
            </div>
          </div>
        )}
        {filtered.map((note) => (
          <div
            key={note.id}
            className="note-card animate-note-appear rounded-2xl p-4 text-sm relative group text-stone-800"
            style={{ backgroundColor: note.color }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-500/40" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">{activeLabel}</span>
            </div>
            <p className="pr-6 whitespace-pre-wrap text-sm leading-6 text-stone-800">{note.text}</p>
            <button
              onClick={() => onDelete(note.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-stone-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Input area */}
      {canWriteNote && (
        <div className="px-4 py-4 border-t border-border/60 mt-auto bg-background/55 backdrop-blur-sm">
          <div className="flex gap-2 mb-3">
            {NOTE_COLORS.map((c, i) => (
              <button
                key={i}
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-transform shadow-sm",
                  i === colorIdx ? "border-primary scale-110 ring-2 ring-primary/15" : "border-transparent",
                )}
                style={{ backgroundColor: c }}
                onClick={() => setColorIdx(i)}
              />
            ))}
          </div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <PenLine className="h-3.5 w-3.5" />
              {activeTarget === "range" ? "Write range note here" : "Write note here"}
            </div>
            <p className="text-[11px] text-muted-foreground">Press `Enter` to save</p>
          </div>
          <div className="notes-composer flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeTarget === "range"
                  ? "Write a note for the selected range..."
                  : `Write a note for ${shortDateLabel}...`
              }
              className="note-input flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 min-h-[84px]"
              rows={3}
              aria-label={
                activeTarget === "range" ? `Write a note for range ${activeLabel}` : `Write a note for ${dateLabel}`
              }
            />
            <Button
              size="icon"
              onClick={handleAdd}
              disabled={!text.trim()}
              className="h-auto self-end rounded-2xl"
              aria-label={
                activeTarget === "range" ? `Add note for range ${activeLabel}` : `Add note for ${dateLabel}`
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarNotes;
