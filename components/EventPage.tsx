"use client";

import { ArrowLeft, Calendar, MapPin, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import EventRegistrationButton from "@/components/EventRegistrationButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeleteEventScope } from "@/lib/eventSeries";
import type { Event } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NextImage from "next/image";
import { Image as ImageKitImage } from "@imagekit/next";
import { deleteEventImage, getEventImage, postEventImage } from "@/lib/services";

type EventPagePayload = {
  event: Event | null;
  userId: string | undefined;
  initialRegistrationStatus: boolean;
  mcGillId: string | undefined;
  isAdmin: boolean;
  isRecurring: boolean;
};

export default function EventPage({
  event,
  userId,
  initialRegistrationStatus,
  mcGillId,
  isAdmin,
  isRecurring,
}: EventPagePayload) {
  const [imageSelected, setImageSelected] = useState<string | undefined>(
    undefined
  );
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!event?.imageId) {
      setImageURL(null);
      return;
    }

    let mounted = true;

    async function fetchImage() {
      try {
        const { uploadedUrl, relativeUrl } = await getEventImage(event!.imageId!);
        if (!mounted) return;
        setImageURL(relativeUrl ?? uploadedUrl ?? null);
      } catch (error) {
        console.error("Error fetching event image:", error);
        if (mounted) setImageURL(null);
      }
    }

    void fetchImage();

    return () => {
      mounted = false;
    };
  }, [event?.imageId]);

  if (!event) {
    return (
      <div className="site-shell py-8 md:py-10">
        <div className="section-shell flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-emerald-900/70">Event not found</p>
          <Button
            asChild
            variant="outline"
            className="mt-4 rounded-full border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50"
          >
            <Link href="/events">Back to Activities</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentEvent = event;
  const displayImage = imageSelected ?? imageURL;
  const scheduledAt = new Date(currentEvent.scheduledAt);

  async function deleteEvent(scope: DeleteEventScope) {
    setIsDeleting(true);

    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentEvent.id, scope }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to delete event");
      }

      setDeleteDialogOpen(false);
      router.push("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete event."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteClick() {
    if (isRecurring) {
      setDeleteDialogOpen(true);
      return;
    }

    if (window.confirm("Delete this event?")) {
      void deleteEvent("THIS");
    }
  }

  async function handleFileInput(file?: File) {
    if (!file || isLoading) return;

    setIsLoading(true);
    if (imageSelected) {
      URL.revokeObjectURL(imageSelected);
    }
    setImageSelected(URL.createObjectURL(file));

    const { prevImageId } = await postEventImage(
      currentEvent.id,
      file,
      currentEvent.title
    );
    if (prevImageId) {
      await deleteEventImage(prevImageId);
    }

    setIsLoading(false);
  }

  const imageSection =
    displayImage && !imageError && process.env.NEXT_PUBLIC_IMAGEKIT_URL ? (
      <div className="relative min-h-[220px] w-full md:min-h-0 md:max-w-[42%] md:flex-none">
        <div className="relative h-full min-h-[220px] w-full md:min-h-[320px]">
          {imageSelected ? (
            <NextImage
              src={imageSelected}
              alt={`${currentEvent.title} event photo`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          ) : (
            <ImageKitImage
              urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}`}
              src={imageURL!}
              alt={`${currentEvent.title} event photo`}
              className={`object-cover transition-opacity duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              priority
            />
          )}
          {!imageLoaded && !imageSelected && (
            <div className="absolute inset-0 animate-pulse bg-emerald-100" />
          )}
        </div>
      </div>
    ) : (
      <div className="relative min-h-[220px] w-full md:min-h-0 md:max-w-[42%] md:flex-none">
        <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-100 md:min-h-[320px]">
          <div className="relative h-full w-full">
            <NextImage
              src="/logo.png"
              alt="GOCCC logo"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-contain p-8 opacity-85"
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="site-shell py-8 md:py-10">
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activities
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-emerald-100/80 bg-white/90 shadow-[0_24px_45px_-30px_rgba(18,72,52,0.8)]">
        <div className="md:flex md:items-stretch">
          {imageSection}

          <div className="flex w-full flex-col p-6 md:p-8">
            <h1 className="about-heading mb-4 text-3xl font-semibold leading-tight text-emerald-950 md:text-4xl">
              {currentEvent.title}
            </h1>

            <p className="mb-6 text-base leading-relaxed text-emerald-900/72 md:text-lg">
              {currentEvent.description}
            </p>

            <div className="mb-8 space-y-3">
              <div className="flex items-center text-sm text-emerald-900/65 md:text-base">
                <Calendar className="mr-2 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  {scheduledAt.toLocaleString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {currentEvent.location && (
                <div className="flex items-center text-sm text-emerald-900/65 md:text-base">
                  <MapPin className="mr-2 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{currentEvent.location}</span>
                </div>
              )}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-emerald-100/80 pt-6">
              <EventRegistrationButton
                userId={userId}
                eventId={currentEvent.id}
                initialRegistrationStatus={initialRegistrationStatus}
                hasMcGillId={!!mcGillId}
              />

              {isAdmin && (
                <Button
                  variant="outline"
                  className="rounded-full border-red-200 bg-white/80 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Event
                </Button>
              )}
            </div>

            {isAdmin && (
              <div className="mt-6 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
                <p className="mb-3 text-sm font-semibold text-emerald-900">
                  Event Image
                </p>
                <label
                  htmlFor="image-event"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50"
                >
                  <Upload className="h-4 w-4" />
                  {isLoading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    id="image-event"
                    onChange={(e) => {
                      void handleFileInput(e.target.files?.[0]);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </article>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete recurring event</DialogTitle>
            <DialogDescription>
              This event is part of a recurring series. Choose what you want to
              delete.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:space-x-0">
            <Button
              variant="outline"
              className="w-full rounded-full border-emerald-200"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => void deleteEvent("THIS")}
              disabled={isDeleting}
            >
              Delete only this event
            </Button>
            <Button
              variant="destructive"
              className="w-full rounded-full"
              onClick={() => void deleteEvent("THIS_AND_FUTURE")}
              disabled={isDeleting}
            >
              Delete this and all future events
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
