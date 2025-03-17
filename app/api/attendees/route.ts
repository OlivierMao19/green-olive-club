import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const attendees = await prisma.userOnEvent.findMany({
      select: {
        user: true,
        userId: true,
        createdAt: true,
      },
      where: { eventId: eventId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(attendees, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Interal Server Error" },
      { status: 500 }
    );
  }
}
