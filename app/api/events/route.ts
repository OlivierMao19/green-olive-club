import { prisma } from "@/lib/prisma";
import { deleteEventImage } from "@/lib/services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, location, scheduledAt } = await req.json();
    const parsedDate = new Date(scheduledAt);
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

export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json();

    const event = await prisma.$transaction(async (tx) => {
      await tx.userOnEvent.deleteMany({
        where: {
          eventId: id,
        },
      });

      return tx.event.delete({
        where: {
          id: id,
        },
      });
    });

    if (event?.imageId) {
      await deleteEventImage(event.imageId);
    }

    return NextResponse.json(
      { message: "Event deleted", event },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
