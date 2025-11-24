// src/features/bookings/blockedDates.ts
import { eachDayOfInterval, formatISO } from "date-fns";

export function toBlockedSet(
  bookings: { dateFrom: string; dateTo: string }[]
) {
  const set = new Set<string>();
  for (const b of bookings) {
    const start = new Date(b.dateFrom);
    const end = new Date(b.dateTo);
    for (const d of eachDayOfInterval({ start, end })) {
      set.add(formatISO(d, { representation: "date" }));
    }
  }
  return set;
}
