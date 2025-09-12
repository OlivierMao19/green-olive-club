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
import { deconstructEvent } from "@/lib/utils";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Activity[]>([]);
  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/event_calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: 0 }),
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
    <div className="container relative max-w-6xl mx-auto">
      {/* Timeline Spine - Hidden on mobile */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-200 via-green-300 to-green-200"></div>

      {/* Events */}
      <div className="space-y-12">
        {events.map((event, index) => {
          const isPast = event.date.getTime() < today.getTime();

          return (
            <div key={event.id} className="relative">
              {/* Timeline Dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div
                  className={`w-4 h-4 rounded-full border-4 border-white shadow-md ${
                    isPast
                      ? "bg-"
                      : "bg-green-500 ring-4 ring-green-200 ring-opacity-50"
                  }`}
                ></div>
              </div>

              {/* Event Card Container */}
              <div
                className={`
                  relative md:w-1/2 
                  ${isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}
                `}
              >
                <div
                  className={`
                    transform transition-all duration-500 hover:scale-105
                    ${isLeft ? "md:translate-x-0" : "md:translate-x-0"}
                  `}
                >
                  <EventCard
                    event={event}
                    isPresent={isPresent}
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
