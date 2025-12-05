// src/components/booking/BookingCalendar.tsx
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { formatISO } from "date-fns";

type BookingCalendarProps = {
  blockedDates: Set<string>;
  selected?: { from?: Date; to?: Date };
  onSelect?: (date: Date | undefined) => void;
  minDate?: Date;
};

export default function BookingCalendar({
  blockedDates,
  selected,
  onSelect,
  minDate = new Date(),
}: BookingCalendarProps) {
  const modifiers = {
    blocked: (date: Date) => {
      const dateStr = formatISO(date, { representation: "date" });
      return blockedDates.has(dateStr);
    },
    selected: (date: Date) => {
      if (!selected) return false;
      const dateStr = formatISO(date, { representation: "date" });
      if (selected.from) {
        const fromStr = formatISO(selected.from, { representation: "date" });
        if (dateStr === fromStr) return true;
      }
      if (selected.to) {
        const toStr = formatISO(selected.to, { representation: "date" });
        if (dateStr === toStr) return true;
      }
      return false;
    },
    range: (date: Date) => {
      if (!selected?.from || !selected?.to) return false;
      const dateStr = formatISO(date, { representation: "date" });
      const fromStr = formatISO(selected.from, { representation: "date" });
      const toStr = formatISO(selected.to, { representation: "date" });
      return dateStr > fromStr && dateStr < toStr;
    },
  };

  const modifiersClassNames = {
    blocked: "bg-red-100 text-red-800 line-through cursor-not-allowed",
    selected: "bg-[var(--ink)] text-white font-semibold",
    range: "bg-[var(--ink)]/20 text-[var(--ink)]",
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <DayPicker
        mode="single"
        selected={selected?.from}
        onSelect={onSelect}
        disabled={(date) => {
          const dateStr = formatISO(date, { representation: "date" });
          return blockedDates.has(dateStr) || date < minDate;
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="rounded-lg"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100 [&:has([aria-selected])]:bg-[var(--ink)]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          day_selected: "bg-[var(--ink)] text-white hover:bg-[var(--ink)] hover:text-white focus:bg-[var(--ink)] focus:text-white",
          day_today: "bg-gray-100 text-[var(--ink)] font-semibold",
          day_outside: "text-gray-400 opacity-50",
          day_disabled: "text-gray-300 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-[var(--ink)]/20 aria-selected:text-[var(--ink)]",
          day_hidden: "invisible",
        }}
      />
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-red-100 border border-red-300" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-[var(--ink)]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-gray-200" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}

