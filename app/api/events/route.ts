import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteEventImage } from "@/lib/services";
import {
  createRecurringEvent,
  deleteEventWithScope,
  getUnusedEventImageIds,
  type DeleteEventScope,
} from "@/lib/eventSeries";
import type { RecurrenceRule } from "@prisma/client";
import { NextResponse } from "next/server";

const RECURRENCE_VALUES: RecurrenceRule[] = ["WEEKLY", "BIWEEKLY"];
const DELETE_SCOPES: DeleteEventScope[] = ["THIS", "THIS_AND_FUTURE"];

function isRecurrenceRule(value: string): value is RecurrenceRule {
  return RECURRENCE_VALUES.includes(value as RecurrenceRule);
}

function isDeleteScope(value: string): value is DeleteEventScope {
  return DELETE_SCOPES.includes(value as DeleteEventScope);
}

export async function POST(req: Request) {
  try {
    const { title, description, location, scheduledAt, recurrence } =
      await req.json();
    const parsedDate = new Date(scheduledAt);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid scheduled date" },
        { status: 400 }
      );
    }

    if (recurrence && recurrence !== "NONE" && isRecurrenceRule(recurrence)) {
      const { series, events } = await createRecurringEvent({
        title,
        description,
        location,
        scheduledAt: parsedDate,
        recurrence,
      });

      return NextResponse.json(
        { message: "Recurring event created", series, events },
        { status: 201 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        scheduledAt: parsedDate,
      },
    });
    return NextResponse.json(
      { message: "Event created", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, title, description, location, scheduledAt } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let parsedDate: Date | undefined;
    if (scheduledAt !== undefined) {
      parsedDate = new Date(scheduledAt);
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid scheduled date" },
          { status: 400 }
        );
      }

      if (existing.seriesId) {
        const conflict = await prisma.event.findFirst({
          where: {
            seriesId: existing.seriesId,
            scheduledAt: parsedDate,
            NOT: { id },
          },
        });

        if (conflict) {
          return NextResponse.json(
            {
              error:
                "Another event in this series already exists at that time",
            },
            { status: 409 }
          );
        }
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(parsedDate !== undefined && { scheduledAt: parsedDate }),
      },
    });

    return NextResponse.json({ message: "Event updated", event });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, scope = "THIS" } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    if (!isDeleteScope(scope)) {
      return NextResponse.json(
        { error: "Invalid delete scope" },
        { status: 400 }
      );
    }

    const { deletedCount, imageIds } = await deleteEventWithScope(id, scope);
    const unusedImageIds = await getUnusedEventImageIds(imageIds);

    await Promise.all(unusedImageIds.map((imageId) => deleteEventImage(imageId)));

    return NextResponse.json(
      { message: "Event deleted", deletedCount, scope },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Event not found") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (
      error instanceof Error &&
      error.message === "Cannot delete future series events for a one-off event"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
