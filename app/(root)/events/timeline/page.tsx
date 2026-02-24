"use client";

import { useState, useEffect } from "react";
import { Activity } from "@/lib/types";
import { deconstructEvent, formatPeriod } from "@/lib/utils";
import EventCard from "@/components/EventCard";
import { LoaderIcon } from "lucide-react";

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
    <div className="site-shell py-8 md:py-10">
      <div className="section-shell relative flex flex-col px-2">
        <h1 className="about-heading w-full pb-12 text-center text-4xl font-semibold text-emerald-800">
          Event Timeline
        </h1>
        {/* Timeline Spine - Hidden on mobile */}
        <div className="absolute top-0 bottom-0 left-[calc(16.666667%+5px)] hidden mt-36 w-0.5 -translate-x-px transform bg-gradient-to-b from-green-200 via-green-300 to-green-200 md:block"></div>

        {/* Events */}
        {isLoading ? (
          <div className="flex w-full items-center justify-center py-24">
            <LoaderIcon className="h-16 w-16 animate-spin text-emerald-700" />
          </div>
        ) : (
          <div className="space-y-12">
            {events.map((event) => {
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
                  <div className="absolute left-1/6 hidden -translate-x-1/2 -translate-y-2 transform md:block">
                    <div
                      className={`h-4 w-4 rounded-full border-4 shadow-md ${
                        isPast
                          ? "border-gray-300 bg-gray-400"
                          : "border-white bg-green-500 ring-4 ring-green-200 ring-opacity-50"
                      }`}
                    ></div>
                  </div>

                  {/* Event Card Container */}
                  <div className="relative hidden text-right text-xl font-bold md:mr-auto md:block md:w-1/6 md:pr-8">
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
                  <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-green-200 md:hidden"></div>
                  <div className="absolute left-2 top-6 h-4 w-4 rounded-full border-4 border-white bg-green-400 shadow-md md:hidden"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
