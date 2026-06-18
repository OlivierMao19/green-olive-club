import type { Prisma, RecurrenceRule } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  MAX_FUTURE_INSTANCES,
  addRecurrenceInterval,
  advanceToNextFutureOccurrence,
  computeOccurrenceDates,
  getHorizonEnd,
} from "@/lib/recurrence";

type SeriesFields = {
  title: string;
  description?: string | null;
  location?: string | null;
  imageId?: string | null;
};

function buildEventData(
  seriesId: string,
  series: SeriesFields,
  scheduledAt: Date
): Prisma.EventCreateManyInput {
  return {
    seriesId,
    title: series.title,
    description: series.description,
    location: series.location,
    imageId: series.imageId,
    scheduledAt,
  };
}

export async function ensureFutureInstances(seriesId: string): Promise<void> {
  const series = await prisma.eventSeries.findUnique({
    where: { id: seriesId },
  });

  if (!series?.active) {
    return;
  }

  const now = new Date();
  const horizonEnd = getHorizonEnd(now);

  const futureEvents = await prisma.event.findMany({
    where: {
      seriesId,
      scheduledAt: { gt: now },
    },
    orderBy: { scheduledAt: "asc" },
    select: { scheduledAt: true },
  });

  const existingFutureCount = futureEvents.length;
  if (existingFutureCount >= MAX_FUTURE_INSTANCES) {
    return;
  }

  let cursor: Date;

  if (futureEvents.length > 0) {
    cursor = addRecurrenceInterval(
      futureEvents[futureEvents.length - 1].scheduledAt,
      series.recurrence
    );
  } else {
    const latestEvent = await prisma.event.findFirst({
      where: { seriesId },
      orderBy: { scheduledAt: "desc" },
      select: { scheduledAt: true },
    });

    if (latestEvent) {
      cursor = advanceToNextFutureOccurrence(
        latestEvent.scheduledAt,
        series.recurrence,
        now
      );
    } else {
      cursor = new Date(series.startAt);
      while (cursor <= now) {
        cursor = addRecurrenceInterval(cursor, series.recurrence);
      }
    }
  }

  const toCreate: Prisma.EventCreateManyInput[] = [];
  let plannedCount = existingFutureCount;

  while (plannedCount < MAX_FUTURE_INSTANCES && cursor <= horizonEnd) {
    if (cursor > now) {
      const exists = await prisma.event.findFirst({
        where: { seriesId, scheduledAt: cursor },
        select: { id: true },
      });

      if (!exists) {
        toCreate.push(buildEventData(seriesId, series, new Date(cursor)));
        plannedCount++;
      }
    }

    cursor = addRecurrenceInterval(cursor, series.recurrence);
  }

  if (toCreate.length > 0) {
    await prisma.event.createMany({ data: toCreate });
  }
}

export async function topUpAllActiveSeries(): Promise<void> {
  const activeSeries = await prisma.eventSeries.findMany({
    where: { active: true },
    select: { id: true },
  });

  await Promise.all(activeSeries.map((series) => ensureFutureInstances(series.id)));
}

export async function createRecurringEvent(
  fields: SeriesFields & { scheduledAt: Date; recurrence: RecurrenceRule }
) {
  const now = new Date();
  const horizonEnd = getHorizonEnd(now);
  const occurrenceDates = computeOccurrenceDates(
    fields.scheduledAt,
    fields.recurrence,
    { horizonEnd, now }
  );

  if (occurrenceDates.length === 0) {
    throw new Error("No occurrences fall within the allowed horizon");
  }

  return prisma.$transaction(async (tx) => {
    const series = await tx.eventSeries.create({
      data: {
        title: fields.title,
        description: fields.description,
        location: fields.location,
        imageId: fields.imageId,
        recurrence: fields.recurrence,
        startAt: fields.scheduledAt,
      },
    });

    await tx.event.createMany({
      data: occurrenceDates.map((scheduledAt) =>
        buildEventData(series.id, fields, scheduledAt)
      ),
    });

    const events = await tx.event.findMany({
      where: { seriesId: series.id },
      orderBy: { scheduledAt: "asc" },
    });

    return { series, events };
  });
}
