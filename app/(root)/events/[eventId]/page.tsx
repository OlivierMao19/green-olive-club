import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { EventPage } from "@/components/EventPage";
import type { Event } from "@prisma/client";

// Define a wrapper function that matches the expected PageProps constraint
export default async function Event({
  params: paramsPromise,
}: {
  params: Promise<{ eventId: string }>;
}) {
  // Await the params
  const params = await paramsPromise;
  const { eventId } = params;

  const event: Event | null = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      scheduledAt: true,
    },
  });

  const session = await auth();
  const userId = session?.user?.id;

  const hasMcGillId = session?.user?.mcgillId;

  // async function onRegister({ params }: { params: { action: string } }) {
  //   if (!userId || !session) {
  //     redirect("/signin");
  //   } else if (!session?.user?.mcgillId) {
  //     //TODO change to profile page
  //     redirect("/home");
  //   } else {
  //     const response = await fetch("/api/registerEvent", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userId, eventId, params }),
  //     });
  //     if (response.ok) {
  //       const userRegistrations = await response.json();
  //     }
  //   }
  // }
  const registration = userId
    ? await prisma.userOnEvent.findFirst({ where: { userId, eventId } })
    : null;
  const isRegistered = !!registration;

  return (
    <EventPage
      event={event}
      userId={userId}
      initialRegistrationStatus={isRegistered}
      hasMcGillId={hasMcGillId}
    />
  );
}
