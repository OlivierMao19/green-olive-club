import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) || {};
    const raw = body.date;

    let dateTime: Date;
    if (raw == null || raw === "") {
      dateTime = new Date();
    } else if (typeof raw === "number") {
      dateTime = raw < 1e12 ? new Date(raw * 1000) : new Date(raw);
    } else {
      dateTime = new Date(String(raw));
    }

    if (Number.isNaN(dateTime.getTime())) {
      console.error("Invalid date, defaulting to today");
      dateTime = new Date();
    }

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
