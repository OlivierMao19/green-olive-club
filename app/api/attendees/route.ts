import { prisma } from "@/lib/prisma";
import {
  normalizeCustomAnswers,
  parseCustomFields,
} from "@/lib/customFields";
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

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { customFields: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const customFields = parseCustomFields(event.customFields);

    const [userAttendees, guestAttendees] = await Promise.all([
      prisma.userOnEvent.findMany({
        select: {
          user: true,
          userId: true,
          createdAt: true,
          customAnswers: true,
        },
        where: { eventId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.guestRegistration.findMany({
        where: { eventId },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const attendees = [
      ...userAttendees.map((attendee) => ({
        id: attendee.userId,
        email: attendee.user.email,
        name: attendee.user.name ?? "",
        mcgillId: attendee.user.mcgillId ?? "",
        school: attendee.user.school ?? "",
        registrationDate: attendee.createdAt,
        isGuest: false,
        customAnswers: normalizeCustomAnswers(
          attendee.customAnswers as Record<string, string> | null
        ),
      })),
      ...guestAttendees.map((guest) => ({
        id: guest.id,
        email: guest.email,
        name: guest.name,
        mcgillId: guest.mcgillId ?? "",
        school: guest.school ?? "",
        registrationDate: guest.createdAt,
        isGuest: true,
        customAnswers: normalizeCustomAnswers(
          guest.customAnswers as Record<string, string> | null
        ),
      })),
    ].sort(
      (a, b) =>
        new Date(a.registrationDate).getTime() -
        new Date(b.registrationDate).getTime()
    );

    return NextResponse.json({ customFields, attendees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Interal Server Error" },
      { status: 500 }
    );
  }
}
