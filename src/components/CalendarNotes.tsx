import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarNote, NOTE_COLORS, format } from "@/lib/calendar-utils";
import { Plus, Trash2, StickyNote } from "lucide-react";
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
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <StickyNote className="h-4 w-4 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Notes</h3>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs text-muted-foreground font-medium">
          {dateKey ? dateLabel : "Click a date to add notes"}
        </p>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 min-h-0">
        {filtered.length === 0 && dateKey && (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No notes yet for this day</p>
        )}
        {filtered.map((note) => (
          <div
            key={note.id}
            className="animate-note-appear rounded-lg p-3 text-sm relative group"
            style={{ backgroundColor: note.color }}
          >
            <p className="text-foreground/90 pr-6 whitespace-pre-wrap text-xs sm:text-sm">{note.text}</p>
            <button
              onClick={() => onDelete(note.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Input area */}
      {dateKey && (
        <div className="px-4 py-3 border-t border-border mt-auto">
          <div className="flex gap-1 mb-2">
            {NOTE_COLORS.map((c, i) => (
              <button
                key={i}
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-transform",
                  i === colorIdx ? "border-primary scale-110" : "border-transparent",
                )}
                style={{ backgroundColor: c }}
                onClick={() => setColorIdx(i)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]"
              rows={2}
            />
            <Button
              size="icon"
              onClick={handleAdd}
              disabled={!text.trim()}
              className="h-auto self-end"
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
