import { addMonths, addWeeks } from "date-fns";
import type { RecurrenceRule } from "@prisma/client";

export const MAX_FUTURE_INSTANCES = 5;
export const HORIZON_MONTHS = 1;

export type RecurrenceInput = RecurrenceRule | "NONE";

export function getHorizonEnd(from: Date = new Date()): Date {
  return addMonths(from, HORIZON_MONTHS);
}

export function addRecurrenceInterval(
  date: Date,
  recurrence: RecurrenceRule
): Date {
  return recurrence === "WEEKLY" ? addWeeks(date, 1) : addWeeks(date, 2);
}

export function computeOccurrenceDates(
  startAt: Date,
  recurrence: RecurrenceRule,
  options: {
    maxCount?: number;
    horizonEnd?: Date;
    now?: Date;
  } = {}
): Date[] {
  const maxCount = options.maxCount ?? MAX_FUTURE_INSTANCES;
  const horizonEnd = options.horizonEnd ?? getHorizonEnd(options.now);
  const dates: Date[] = [];
  let cursor = new Date(startAt);

  while (dates.length < maxCount && cursor <= horizonEnd) {
    dates.push(new Date(cursor));
    cursor = addRecurrenceInterval(cursor, recurrence);
  }

  return dates;
}

export function advanceToNextFutureOccurrence(
  lastScheduledAt: Date,
  recurrence: RecurrenceRule,
  now: Date
): Date {
  let cursor = new Date(lastScheduledAt);

  while (cursor <= now) {
    cursor = addRecurrenceInterval(cursor, recurrence);
  }

  return cursor;
}
