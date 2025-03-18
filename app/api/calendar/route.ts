import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let dateTime = new Date();
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
