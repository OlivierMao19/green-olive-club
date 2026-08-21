import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { trimRegistrationDetails } from "@/lib/registrationDetails";
import { NextResponse } from "next/server";

type RegisterEventBody = {
  eventId: string;
  action: "register" | "unregister";
  name?: string;
  email?: string;
  mcgillId?: string;
  school?: string;
};

async function eventExists(eventId: string): Promise<boolean> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });

  return Boolean(event);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = (await req.json()) as RegisterEventBody;
    const { eventId, action } = body;

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    if (!(await eventExists(eventId))) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const sessionUserId = session?.user?.id;

    if (action === "unregister") {
      if (sessionUserId) {
        const existingRegistration = await prisma.userOnEvent.findUnique({
          where: {
            userId_eventId: {
              userId: sessionUserId,
              eventId,
            },
          },
        });

        if (!existingRegistration) {
          return NextResponse.json(
            { message: "Not registered for this event", registered: false },
            { status: 200 }
          );
        }

        await prisma.userOnEvent.delete({
          where: {
            userId_eventId: {
              userId: sessionUserId,
              eventId,
            },
          },
        });

        return NextResponse.json(
          { message: "Successfully unregistered", registered: false },
          { status: 200 }
        );
      }

      const guestEmail = body.email?.trim().toLowerCase();
      if (!guestEmail) {
        return NextResponse.json(
          { message: "Email is required to unregister as a guest" },
          { status: 400 }
        );
      }

      const guestRegistration = await prisma.guestRegistration.findUnique({
        where: {
          eventId_email: {
            eventId,
            email: guestEmail,
          },
        },
      });

      if (!guestRegistration) {
        return NextResponse.json(
          { message: "Not registered for this event", registered: false },
          { status: 200 }
        );
      }

      await prisma.guestRegistration.delete({
        where: {
          eventId_email: {
            eventId,
            email: guestEmail,
          },
        },
      });

      return NextResponse.json(
        { message: "Successfully unregistered", registered: false },
        { status: 200 }
      );
    }

    if (action !== "register") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    if (sessionUserId) {
      const details =
        body.name && body.email
          ? trimRegistrationDetails({
              name: body.name,
              email: body.email,
              mcgillId: body.mcgillId ?? "",
              school: body.school ?? "",
            })
          : null;

      if (details) {
        await prisma.user.update({
          where: { id: sessionUserId },
          data: {
            name: details.name,
            email: details.email,
            mcgillId: details.mcgillId || null,
            school: details.school || null,
          },
        });
      } else {
        const user = await prisma.user.findUnique({
          where: { id: sessionUserId },
          select: { name: true, email: true },
        });

        if (!user?.name?.trim() || !user.email?.trim()) {
          return NextResponse.json(
            { message: "Please provide your name and email" },
            { status: 400 }
          );
        }
      }

      const existingRegistration = await prisma.userOnEvent.findUnique({
        where: {
          userId_eventId: {
            userId: sessionUserId,
            eventId,
          },
        },
      });

      if (existingRegistration) {
        return NextResponse.json(
          { message: "Already registered for this event", registered: true },
          { status: 200 }
        );
      }

      await prisma.userOnEvent.create({
        data: {
          user: { connect: { id: sessionUserId } },
          event: { connect: { id: eventId } },
        },
      });

      return NextResponse.json(
        { message: "Successfully registered", registered: true },
        { status: 201 }
      );
    }

    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const details = trimRegistrationDetails({
      name: body.name,
      email: body.email,
      mcgillId: body.mcgillId ?? "",
      school: body.school ?? "",
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: details.email },
      select: { id: true },
    });

    if (existingUser) {
      const userRegistration = await prisma.userOnEvent.findUnique({
        where: {
          userId_eventId: {
            userId: existingUser.id,
            eventId,
          },
        },
      });

      if (userRegistration) {
        return NextResponse.json(
          { message: "Already registered for this event", registered: true },
          { status: 200 }
        );
      }
    }

    const existingGuestRegistration = await prisma.guestRegistration.findUnique(
      {
        where: {
          eventId_email: {
            eventId,
            email: details.email,
          },
        },
      }
    );

    if (existingGuestRegistration) {
      return NextResponse.json(
        { message: "Already registered for this event", registered: true },
        { status: 200 }
      );
    }

    await prisma.guestRegistration.create({
      data: {
        eventId,
        name: details.name,
        email: details.email,
        mcgillId: details.mcgillId || null,
        school: details.school || null,
      },
    });

    return NextResponse.json(
      {
        message: "Successfully registered",
        registered: true,
        guestEmail: details.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error with event registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
