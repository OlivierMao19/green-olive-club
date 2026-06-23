"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Image as ImageKitImage } from "@imagekit/next";
import { Activity } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEventImage } from "@/lib/services";
import NextImage from "next/image";

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
    setImageLoaded(false);
    setImageError(false);
    setImageURL(null);

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

  const imageContainerClass =
    "relative overflow-hidden md:flex-none md:max-w-[40%] md:min-w-52";

  const showImage =
    event.imageId &&
    !imageError &&
    imageURL &&
    process.env.NEXT_PUBLIC_IMAGEKIT_URL;

  const cardClassName = isPast
    ? "border-slate-200 bg-slate-50 shadow-sm hover:border-slate-300 hover:shadow-md"
    : "border-emerald-300/80 bg-white shadow-lg hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-xl";

  const titleClassName = isPast
    ? "text-slate-600 group-hover:text-slate-700"
    : "text-emerald-950 group-hover:text-emerald-700";

  const descriptionClassName = isPast
    ? "text-slate-500"
    : "text-emerald-900/72";

  const metaClassName = isPast ? "text-slate-500" : "text-emerald-900/65";

  const iconClassName = isPast ? "text-slate-400" : "text-emerald-500";

  const detailsButtonClassName = isPast
    ? "border-slate-200 bg-slate-100/80 text-slate-600 hover:bg-slate-100"
    : "border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50";

  const defaultImageSection = (
    <div className={imageContainerClass}>
      <div className="flex h-full min-h-36 w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-100">
        <div className="relative h-full w-full">
          <NextImage
            src="/bigLogo.png"
            alt="GOCCC logo"
            fill
            sizes="(max-width: 768px) 100vw, 38vw"
            className={`object-contain p-4 ${isPast ? "opacity-70 grayscale-[40%]" : "opacity-90"}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${cardClassName} ${className} md:flex md:min-h-[190px] md:items-stretch`}
      role="article"
      aria-label={`Event: ${event.title}${isPast ? " (past)" : ""}`}
      onClick={handleActivate}
    >
      {event.imageId ? (
        <div className={imageContainerClass}>
          <div className="relative h-full min-h-36 w-full">
            {showImage ? (
              <ImageKitImage
                urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}`}
                src={imageURL}
                alt={`${event.title} event photo`}
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } ${isPast ? "grayscale-[65%] opacity-80" : ""}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                fill
                sizes="(max-width: 768px) 100vw, 38vw"
              />
            ) : null}
            {(!showImage || !imageLoaded) && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        </div>
      ) : (
        defaultImageSection
      )}

      <div className="p-6 w-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex min-w-0 items-center gap-2">
            {isPast && (
              <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Past
              </span>
            )}
            <h3
              className={`text-xl font-bold leading-tight transition-colors duration-200 ${titleClassName}`}
            >
              {event.title}
            </h3>
          </div>
          <Button
            variant="outline"
            asChild
            className={detailsButtonClassName}
          >
            <Link
              href={`/events/${event.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              Details <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className={`mb-4 leading-relaxed ${descriptionClassName}`}>
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className={`flex items-center text-sm ${metaClassName}`}>
            <Calendar className={`mr-2 h-4 w-4 ${iconClassName}`} />
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
            <div className={`flex items-center text-sm ${metaClassName}`}>
              <MapPin className={`mr-2 h-4 w-4 ${iconClassName}`} />
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
