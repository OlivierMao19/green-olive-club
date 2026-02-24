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
import EventCard from "./EventCard";
import { useRouter } from "next/navigation";

export default function EventsCalendar({ isAdmin = false }) {
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

  return (
    <div className="site-shell py-8 md:py-10">
      <div className="section-shell">
        <h1 className="mb-7 text-center text-3xl font-bold tracking-tighter text-emerald-900 sm:text-4xl">
        Club Activities
        </h1>

        <div className="md:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-emerald-800">
            {date
              ? `Activities for ${formatDate(date)}`
              : "All Upcoming Activities"}
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                router.push("/events/timeline");
              }}
              className="rounded-full border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50"
            >
              View Event Timeline
            </Button>
          </div>

          {isLoading ? (
            <div className="flex w-full items-center justify-center py-24">
              <LoaderIcon className="h-16 w-16 animate-spin text-emerald-700" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <Card className="border-emerald-100/80 bg-white/85">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="mb-4 h-12 w-12 text-emerald-300" />
                <p className="text-center text-lg text-emerald-900/70">
                  No activities scheduled for today
                </p>
                <Button
                  variant="outline"
                  onClick={() => setDate(new Date(0))}
                  className="mt-4 rounded-full border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50"
                >
                  View All Activities
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
                <DialogContent className="overflow-hidden p-2 md:max-w-[800px]">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-semibold text-emerald-900">
                      <div>
                        Attendees for {currentEvent ? currentEvent.title : ""}
                        <p className="text-sm text-gray-600 md:hidden">
                          Flip screen for all details
                        </p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-6 pt-2">
                    <AttendeeTable
                      eventId={currentEvent ? String(currentEvent.id) : ""}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
