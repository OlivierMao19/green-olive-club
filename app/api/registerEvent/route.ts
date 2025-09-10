import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //POST (Register Event)
  //register user into event on UserOnEvent table?
  //Think of the method on how we can get the user ID using maybe session auth? and then adding the eventId to the user's
  //  events        UserOnEvent[]
  //  attendees     UserOnEvent[]
  try {
    // Check if user is authenticated

    const { userId, eventId, action } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if user is already registered for the event
    const existingRegistration = await prisma.userOnEvent.findUnique({
      where: {
        userId_eventId: {
          userId: userId!,
          eventId: eventId,
        },
      },
    });

    // Handle registration or unregistration based on action and current status
    if (action === "register" && !existingRegistration) {
      // Register the user
      await prisma.userOnEvent.create({
        data: {
          user: { connect: { id: userId } },
          event: { connect: { id: eventId } },
        },
      });

      return NextResponse.json(
        {
          message: "Successfully registered",
          registered: true,
        },
        { status: 201 }
      );
    } else if (action === "unregister" && existingRegistration) {
      // Unregister the user
      await prisma.userOnEvent.delete({
        where: {
          userId_eventId: {
            userId: userId!,
            eventId: eventId,
          },
        },
      });

      return NextResponse.json(
        {
          message: "Successfully unregistered",
          registered: false,
        },
        { status: 200 }
      );
    } else if (existingRegistration) {
      return NextResponse.json(
        {
          message: "Already registered for this event",
          registered: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Not registered for this event",
          registered: false,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error with event registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId, eventId } = await req.json();
    const registration = await prisma.userOnEvent.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });
    return NextResponse.json(registration, { status: 200 });
  } catch (error) {
    console.error("Error fetching event registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
