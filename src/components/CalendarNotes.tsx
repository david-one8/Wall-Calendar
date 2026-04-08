import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarNote, NOTE_COLORS, format } from "@/lib/calendar-utils";
import { ArrowDown, PenLine, Plus, Trash2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarNotesProps {
  notes: CalendarNote[];
  selectedDate: Date | null;
  onAdd: (note: Omit<CalendarNote, "id">) => void;
  onDelete: (id: string) => void;
}

const CalendarNotes = ({ notes, selectedDate, onAdd, onDelete }: CalendarNotesProps) => {
  const [text, setText] = useState("");
  const [colorIdx, setColorIdx] = useState(0);

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const dateLabel = selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date";
  const shortDateLabel = selectedDate ? format(selectedDate, "MMMM d") : "this day";
  const filtered = dateKey ? notes.filter((n) => n.date === dateKey) : [];

  const handleAdd = () => {
    if (!text.trim() || !dateKey) return;
    onAdd({ date: dateKey, text: text.trim(), color: NOTE_COLORS[colorIdx] });
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
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Pinned to date</p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border/40 bg-background/40">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.18em]">
          {dateKey ? dateLabel : "Click a date to add notes"}
        </p>
      </div>

      {/* Notes list */}
      <div className="notes-scroll flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {filtered.length === 0 && dateKey && (
          <div className="notes-empty-state rounded-2xl px-4 py-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PenLine className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-foreground/80">No notes yet for this day</p>
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
            className="note-card animate-note-appear rounded-2xl p-4 text-sm relative group"
            style={{ backgroundColor: note.color }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">{dateLabel}</span>
            </div>
            <p className="text-foreground/90 pr-6 whitespace-pre-wrap text-sm leading-6">{note.text}</p>
            <button
              onClick={() => onDelete(note.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Input area */}
      {dateKey && (
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
              Write note here
            </div>
            <p className="text-[11px] text-muted-foreground">Press `Enter` to save</p>
          </div>
          <div className="notes-composer flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Write a note for ${shortDateLabel}...`}
              className="note-input flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 min-h-[84px]"
              rows={3}
              aria-label={`Write a note for ${dateLabel}`}
            />
            <Button
              size="icon"
              onClick={handleAdd}
              disabled={!text.trim()}
              className="h-auto self-end rounded-2xl"
              aria-label={`Add note for ${dateLabel}`}
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
