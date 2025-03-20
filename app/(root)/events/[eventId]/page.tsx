import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EventRegistrationButton from "@/components/EventRegistrationButton";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await Promise.resolve(params);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  const session = await auth();
  const userId = session?.user?.id;

  const hasMcGillId = session?.user?.mcgillId;

  if (!event) {
    return <div className="container mx-auto px-4 py-6">Event not found</div>;
  }

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
  let isRegistered = false;
  if (userId) {
    const registration = await prisma.userOnEvent.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });
    isRegistered = !!registration;
  }

  return (
    <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 sm:w-full mt-6">
      <Card className="h-[75svh]">
        <CardContent className="flex flex-col items-between justify-center py-5 space-y-10">
          <Link className="" href="/events">
            <div className="flex gap-2">
              <ArrowLeft />
              <span className="font-bold text-gray-1000 text-1xl">Back</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold">{event!.title}</h1>
          <p className="text-gray-600 mt-2">Description: </p>
          <p>{event!.description}</p>
          <p className="text-gray-500 mt-4">Location: {event!.location}</p>
          <p className="text-gray-500 mt-4">
            Scheduled At: {new Date(event!.scheduledAt).toLocaleString()}
          </p>
          <EventRegistrationButton
            userId={userId}
            eventId={eventId}
            initialRegistrationStatus={isRegistered}
            hasMcGillId={hasMcGillId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
