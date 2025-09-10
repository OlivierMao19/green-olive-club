import { prisma } from "@/lib/prisma";
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

export async function GET() {
  try {
    const dateTime = new Date();
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        scheduledAt: true,
      },
      where: {
        scheduledAt: {
          gte: dateTime,
        },
      },
      orderBy: { scheduledAt: "asc" },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Interal Server Error" },
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
