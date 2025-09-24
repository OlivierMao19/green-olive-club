import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { Event } from "@prisma/client";
import EventPage from "@/components/EventPage";

export default async function Event({
  params: paramsPromise,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const params = await paramsPromise;
  const { eventId } = params;

  const event: Event | null = await prisma.event.findUnique({
    where: { id: eventId },
  });

  const session = await auth();
  const userId = session?.user?.id;

  const mcGillId = session?.user?.mcgillId;

  const registration = userId
    ? await prisma.userOnEvent.findUnique({
        where: { userId_eventId: { userId, eventId } },
      })
    : null;
  const isRegistered = !!registration;

  return (
    <EventPage
      event={event}
      userId={userId}
      initialRegistrationStatus={isRegistered}
      mcGillId={mcGillId}
      isAdmin={session?.user?.isAdmin || false}
    />
  );
}
