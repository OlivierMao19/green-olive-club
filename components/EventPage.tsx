"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CalendarIcon, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AttendeeTable from "@/components/AttendeeTable";

export default function EventsPage({ isAdmin = false }) {
  // Mock data for activities
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  interface Activity {
    id: number;
    title: string;
    description: string;
    date: Date;
    location: string;
    type: string;
    registered: boolean;
  }

  const [events, setEvents] = useState<Activity[]>([]);
  const [filteredEvents, setfilteredEvents] = useState<Activity[]>([]);

  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/calendar");
        const data = await response.json();
        const activities = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          date: new Date(event.scheduledAt),
          type: "service",
          registered: false,
        }));
        setEvents(activities);
        setfilteredEvents(activities);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 sm:w-full">
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
                onClick={() => setDate(undefined)}
                className="mt-4"
              >
                View All Activities
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-green-800">
                        {activity.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {activity.description}
                      </CardDescription>
                    </div>
                    <Badge className={getTypeColor(activity.type)}>
                      {activity.type
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(activity.date)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(activity.date)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {activity.location}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/events/${activity.id}`}>
                      Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={() => {
                        setAttendeesOpen(true);
                        setCurrentEvent(activity);
                      }}
                    >
                      View Attendees
                    </Button>
                  )}

                  <Link href={`/events/${activity.id}`}>
                    <Button
                      variant="default"
                      className="bg-green-700 hover:bg-green-800"
                    >
                      Register
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
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
