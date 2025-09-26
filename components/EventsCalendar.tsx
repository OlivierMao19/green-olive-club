"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { LoaderIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AttendeeTable from "@/components/AttendeeTable";
import { deconstructEvent, formatDate } from "@/lib/utils";
import { Activity } from "@/lib/types";
import EventCard from "./EventCardServer";
import { useRouter } from "next/navigation";

export default function EventsCalendar({ isAdmin = false }) {
  // Mock data for activities
  const today = new Date();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const [, setEvents] = useState<Activity[]>([]);
  const [filteredEvents, setfilteredEvents] = useState<Activity[]>([]);

  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/event_calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: date?.toISOString() }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.error ?? "Failed to fetch events");
        }

        const data = await response.json();
        const activities = deconstructEvent(data);

        setEvents(activities);
        setfilteredEvents(activities);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [date]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bible-study":
        return "bg-blue-100 text-blue-800";
      case "fellowship":
        return "bg-green-100 text-green-800";
      case "prayer":
        return "bg-purple-100 text-purple-800";
      case "service":
        return "bg-orange-100 text-orange-800";
      case "cultural":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // filteredEvents = date
  //   ? events.filter(
  //       (activity) =>
  //         activity.date.getDate() === date.getDate() &&
  //         activity.date.getMonth() === date.getMonth() &&
  //         activity.date.getFullYear() === date.getFullYear()
  //     )
  //   : events;

  return (
    <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 max-w-4xl sm:w-full">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tighter text-green-800 sm:text-4xl">
        Club Activities
      </h1>

      <div className="md:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-700">
            {date
              ? `Activities for ${formatDate(date)}`
              : "All Upcoming Activities"}
          </h2>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/events/timeline");
            }}
            className="mt-4"
          >
            {"View Event Timeline"}
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center w-full py-24">
            <LoaderIcon className="animate-spin h-16 w-16 text-green-700" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-center text-lg text-gray-600">
                No activities scheduled for today
              </p>
              <Button
                variant="outline"
                onClick={() => setDate(new Date(0))}
                className="mt-4"
              >
                {"View All Activities"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((activity) => (
              <EventCard
                key={activity.id}
                event={activity}
                isAdmin={isAdmin}
                setAttendeesOpen={setAttendeesOpen}
                setCurrentEvent={setCurrentEvent}
              />
            ))}
            <Dialog open={attendeesOpen} onOpenChange={setAttendeesOpen}>
              <DialogContent className="md:max-w-[800px] p-2 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle className="text-xl font-semibold text-event-green">
                    <div>
                      Attendees for {currentEvent ? currentEvent!.title : ""}
                      <p className="md:hidden text-sm text-gray-600">
                        Flip screen for all details
                      </p>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-2">
                  <AttendeeTable
                    eventId={currentEvent ? String(currentEvent!.id) : ""}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
