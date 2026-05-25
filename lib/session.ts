/**
 * Date-range parsing and presets for analytics queries.
 */
import { subDays, startOfDay, endOfDay, startOfToday, startOfYesterday, endOfYesterday } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export function parseRange(searchParams: URLSearchParams): DateRange {
  const preset = searchParams.get("range");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (from && to) {
    return {
      from: startOfDay(new Date(from)),
      to: endOfDay(new Date(to)),
    };
  }

  const now = new Date();
  switch (preset) {
    case "today":
      return { from: startOfToday(), to: now };
    case "yesterday":
      return { from: startOfYesterday(), to: endOfYesterday() };
    case "7d":
      return { from: startOfDay(subDays(now, 6)), to: now };
    case "30d":
      return { from: startOfDay(subDays(now, 29)), to: now };
    case "90d":
      return { from: startOfDay(subDays(now, 89)), to: now };
    default:
      return { from: startOfDay(subDays(now, 6)), to: now };
  }
}
