// src/features/bookings/blockedDates.ts
import { eachDayOfInterval, formatISO, subDays } from "date-fns";

/**
 * Converts bookings to a set of blocked dates.
 * Note: dateTo is exclusive (check-out day), so we only block dates from dateFrom up to (but not including) dateTo.
 */
export function toBlockedSet(
  bookings: { dateFrom: string; dateTo: string }[]
) {
  const set = new Set<string>();
  for (const b of bookings) {
    const start = new Date(b.dateFrom);
    const end = new Date(b.dateTo);
    // dateTo is exclusive (check-out day), so we subtract 1 day to exclude it
    const endExclusive = subDays(end, 1);
    for (const d of eachDayOfInterval({ start, end: endExclusive })) {
      set.add(formatISO(d, { representation: "date" }));
    }
  }
  return set;
}
