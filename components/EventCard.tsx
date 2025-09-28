"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Image } from "@imagekit/next";
import { Activity } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEventImage } from "@/lib/services";

type BaseProps = {
  event: Activity;
  isPast?: boolean;
  className?: string;
};

type AdminProps = BaseProps & {
  isAdmin: true;
  setAttendeesOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentEvent: Dispatch<SetStateAction<Activity | null>>;
};

type NonAdminProps = BaseProps & {
  isAdmin?: false | undefined;
};

type EventCardProps = AdminProps | NonAdminProps;

function isAdminProps(props: EventCardProps): props is AdminProps {
  return props.isAdmin === true;
}

export default function EventCard(props: EventCardProps) {
  const { event, isPast = false, className = "" } = props;
  const isAdmin = props.isAdmin ?? false;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function getImageUrl() {
      const imageId = event.imageId;
      if (!imageId) {
        setImageURL(null);
        return;
      }
      try {
        const { uploadedUrl, relativeUrl } = await getEventImage(imageId);
        if (!mounted) return;
        setImageURL(relativeUrl ?? uploadedUrl ?? null);
        console.log("Image URL:", relativeUrl ?? uploadedUrl ?? null);
      } catch (error) {
        console.error("Error fetching event image:", error);
        if (mounted) setImageURL(null);
      } finally {
      }
    }

    getImageUrl();
    return () => {
      mounted = false;
    };
  }, [event.imageId]);

  const router = useRouter();

  let handleViewAttendees: (() => void) | undefined;

  if (isAdminProps(props)) {
    // Here TypeScript knows `props` is AdminProps
    const { setAttendeesOpen, setCurrentEvent } = props;
    handleViewAttendees = () => {
      setAttendeesOpen(true);
      setCurrentEvent(event);
    };
  }

  function handleActivate() {
    router.push(`/events/${event.id}`);
  }

  function handleImageLoad() {
    setImageLoaded(true);
  }

  function handleImageError() {
    setImageError(true);
    setImageLoaded(true);
  }

  const getPlaceholder = () => (
    <div className="relative overflow-hidden md:flex-none md:max-w-[40%] md:min-w-52 ">
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="GOCCC logo"
          className="block h-full md:w-full w-50 md:object-contain"
        />
      </div>
    </div>
  );

  return (
    <article
      className={`group relative  rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isPast ? "ring-2 ring-gray-400 ring-opacity-50 bg-gray-200" : "bg-white"
      } ${className} md:flex md:items-stretch md:min-h-[160px]`}
      role="article"
      aria-label={`Event: ${event.title}`}
      onClick={handleActivate}
    >
      {/* {isPast && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          Happening Now
        </div>
      )} */}

      {event.imageId &&
      !imageError &&
      imageURL &&
      process.env.NEXT_PUBLIC_IMAGEKIT_URL ? (
        <div className="relative overflow-hidden md:flex-none md:max-w-[40%] md:min-w-52 ">
          <div className="relative h-full w-full">
            <Image
              urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}`}
              src={imageURL}
              alt={`${event.title} event photo`}
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              fill
              sizes="(max-width: 50px) 100vw, 50px"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="p-6 w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-green-600 transition-colors duration-200">
            {event.title}
          </h3>
          <Button variant="outline" asChild>
            <Link href={`/events/${event.id}`}>
              Details <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="text-slate-600 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2 text-green-500" />
            <span>{event.date.toUTCString()}</span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        {isAdmin && handleViewAttendees && (
          <div className="w-full flex flex-col items-center">
            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleViewAttendees?.();
              }}
            >
              View Attendees
            </Button>
          </div>
        )}

        {/* {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </article>
  );
}
