import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event } from "@prisma/client";
import { Activity } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function deconstructEvent(events: Event[]) {
  const data: Activity[] = events.map(
    (event: {
      id: string;
      title: string;
      description: string | null;
      scheduledAt: Date;
      location: string | null;
      image_url: string | null;
    }) => ({
      id: event.id,
      title: event.title,
      description: event.description ?? "",
      date: new Date(event.scheduledAt),
      location: event.location ?? "",
      type: "service",
      registered: false,
      image_url: event.image_url,
    })
  );

  return data;
}
