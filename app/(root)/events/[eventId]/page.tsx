import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Clock, Info, MapPin } from "lucide-react";
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
      <Card className="h-[70svh] bg-green-50/30 border border-green-100/60 shadow-sm">
        <CardContent className="flex flex-col items-between justify-center py-5 space-y-10 text-gray-700">
          <Link className="" href="/events">
            <div className="flex gap-2">
              <ArrowLeft />
              <span className="font-bold text-gray-1000 text-1xl">Back</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold">{event!.title}</h1>
          <div className="flex items-center font-bold"><Info className="mr-1 h-4 w-4" /><p>Description: <span className="font-normal">{event!.description}</span></p></div>
          <div className="flex items-center font-bold"><MapPin className="mr-1 h-4 w-4" /><p>Location: <span className="font-normal">{event!.location}</span></p></div>
          <div className="flex items-center font-bold"><Clock className="mr-1 h-4 w-4" /><p>Scheduled At: <span className="font-normal">{new Date(event!.scheduledAt).toLocaleString()}</span></p></div>

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
