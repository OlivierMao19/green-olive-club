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
import { Activity } from "@/lib/types";
import { deconstructEvent, formatPeriod } from "@/lib/utils";
import EventCard from "@/components/EventCard";
import { format } from "path";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Activity[]>([]);
  const today = new Date();
  let prevDate = new Date(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/event_calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: 0, order: "desc" }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.error ?? "Failed to fetch events");
        }

        const data = await response.json();
        const activities = deconstructEvent(data);
        setEvents(activities);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto py-18 flex flex-col px-2">
      <h1 className="text-4xl font-bold w-full text-center pb-12 text-emerald-500">
        Event Timeline
      </h1>
      {/* Timeline Spine - Hidden on mobile */}
      <div className="hidden mt-37 md:block absolute left-[calc(16.666667%+5px)] transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-200 via-green-300 to-green-200"></div>

      {/* Events */}
      <div className="space-y-12">
        {events.map((event, index) => {
          const isPast = event.date.getTime() < today.getTime();
          let eventPeriod = formatPeriod(event.date);
          if (eventPeriod === formatPeriod(prevDate)) {
            eventPeriod = "";
          } else {
            prevDate = event.date;
          }

          return (
            <div key={event.id} className="relative flex">
              {/* Timeline Dot */}
              <div className="hidden md:block absolute left-1/6 transform -translate-x-1/2 -translate-y-2">
                <div
                  className={`w-4 h-4 rounded-full border-4 shadow-md ${
                    isPast
                      ? "bg-gray-400 border-gray-300"
                      : "bg-green-500 ring-4 ring-green-200 ring-opacity-50 border-white"
                  }`}
                ></div>
              </div>

              {/* Event Card Container */}
              <div className="hidden md:block relative md:w-1/6 md:mr-auto md:pr-8 text-right text-xl font-bold">
                {eventPeriod}
              </div>

              <div
                className={`
                  relative ml-10 w-full md:w-5/6 md:ml-auto md:pl-8
                `}
              >
                <div
                  className={`
                    transform transition-all duration-500 hover:scale-105 md:translate-x-0
                  `}
                >
                  <EventCard
                    event={event}
                    isPast={isPast}
                    isAdmin={false}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Mobile Timeline Connector */}
              <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-green-200"></div>
              <div className="md:hidden absolute left-2 top-6 w-4 h-4 bg-green-400 rounded-full border-4 border-white shadow-md"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
