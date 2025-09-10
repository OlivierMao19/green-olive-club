"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Info, MapPin } from "lucide-react";
import Link from "next/link";
import EventRegistrationButton from "@/components/EventRegistrationButton";
import { Button } from "@/components/ui/button";
import type { Event } from "@prisma/client";

type EventPagePayload = {
  event: Event | null;
  userId: string | undefined;
  initialRegistrationStatus: boolean;
  mcGillId: string | undefined;
};
export default function EventPage({
  event,
  userId,
  initialRegistrationStatus,
  mcGillId,
}: EventPagePayload) {
  if (!event) return <div>Event not found</div>;
  return (
    <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 sm:w-full mt-6">
      <Card className="h-[70svh] bg-green-50/30 border border-green-100/60 shadow-sm">
        <CardContent className="flex flex-col items-between justify-center py-5 space-y-10 text-gray-700">
          <div className="flex items-justify-center items-center justify-between">
            <Link className="" href="/events">
              <div className="flex gap-2">
                <ArrowLeft />
                <span className="font-bold text-gray-1000 text-1xl">Back</span>
              </div>
            </Link>
            <Button
              className="px-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600"
              onClick={() => {}}
            >
              <span className="font-bold text-gray-1000 text-1xl">Delete</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{event!.title}</h1>
          <div className="flex items-center font-bold">
            <Info className="mr-1 h-4 w-4" />
            <p>
              Description:{" "}
              <span className="font-normal">{event!.description}</span>
            </p>
          </div>
          <div className="flex items-center font-bold">
            <MapPin className="mr-1 h-4 w-4" />
            <p>
              Location: <span className="font-normal">{event!.location}</span>
            </p>
          </div>
          <div className="flex items-center font-bold">
            <Clock className="mr-1 h-4 w-4" />
            <p>
              Scheduled At:{" "}
              <span className="font-normal">
                {new Date(event!.scheduledAt).toLocaleString()}
              </span>
            </p>
          </div>

          <EventRegistrationButton
            userId={userId}
            eventId={event.id}
            initialRegistrationStatus={initialRegistrationStatus}
            hasMcGillId={!!mcGillId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
