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
    <div className="relative overflow-hidden md:min-w-56 md:flex-none md:max-w-[38%]">
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-100">
        <img
          src="/logo.png"
          alt="GOCCC logo"
          className="block h-36 w-auto object-contain opacity-85 md:h-full md:w-full"
        />
      </div>
    </div>
  );

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-emerald-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_45px_-30px_rgba(18,72,52,0.8)] ${
        isPast ? "bg-emerald-50/60 ring-1 ring-emerald-200/90" : "bg-white/90"
      } ${className} md:flex md:min-h-[190px] md:items-stretch`}
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
              sizes="(max-width: 768px) 100vw, 38vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
          </div>
        </div>
      ) : (
        getPlaceholder()
      )}

      <div className="p-6 w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors duration-200">
            {event.title}
          </h3>
          <Button
            variant="outline"
            asChild
            className="border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50"
          >
            <Link href={`/events/${event.id}`} onClick={(e) => e.stopPropagation()}>
              Details <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="mb-4 leading-relaxed text-emerald-900/72">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-emerald-900/65">
            <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
            <span>
              {event.date.toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-emerald-900/65">
              <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
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
