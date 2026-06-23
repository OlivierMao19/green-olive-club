"use client";

import { ArrowLeft, Calendar, MapPin, Pencil, Trash2, Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DeleteEventScope } from "@/lib/eventSeries";
import type { Event } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
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

function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDateTime, setEditDateTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/events");
    }
  }

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setImageURL(null);

    if (!event?.imageId) {
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
            variant="outline"
            className="mt-4 rounded-full border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50"
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  const currentEvent = event;
  const hasImage = Boolean(currentEvent.imageId || imageSelected);
  const showImageKitImage =
    !imageSelected &&
    imageURL &&
    !imageError &&
    process.env.NEXT_PUBLIC_IMAGEKIT_URL;

  const imageContainerClass =
    "relative min-h-[220px] w-full md:min-h-0 md:max-w-[42%] md:flex-none";

  const defaultImageSection = (
    <div className={imageContainerClass}>
      <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-100 md:min-h-[320px]">
        <div className="relative h-full w-full">
          <NextImage
            src="/bigLogo.png"
            alt="GOCCC logo"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-contain p-6 opacity-90"
          />
        </div>
      </div>
    </div>
  );

  const imageSection = hasImage ? (
    <div className={imageContainerClass}>
      <div className="relative h-full min-h-[220px] w-full md:min-h-[320px]">
        {imageSelected ? (
          <NextImage
            src={imageSelected}
            alt={`${currentEvent.title} event photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
        ) : showImageKitImage ? (
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
        ) : null}
        {(!imageSelected && (!showImageKitImage || !imageLoaded)) && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
      </div>
    </div>
  ) : (
    defaultImageSection
  );

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

  function openEditDialog() {
    setEditTitle(currentEvent.title);
    setEditDescription(currentEvent.description ?? "");
    setEditLocation(currentEvent.location ?? "");
    setEditDateTime(toDatetimeLocalValue(new Date(currentEvent.scheduledAt)));
    setEditDialogOpen(true);
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();

    if (!editDateTime) {
      alert("Please select a valid date and time");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentEvent.id,
          title: editTitle,
          description: editDescription,
          location: editLocation,
          scheduledAt: new Date(editDateTime).toISOString(),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to update event");
      }

      setEditDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating event:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update event."
      );
    } finally {
      setIsSaving(false);
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

  const scheduledAt = new Date(currentEvent.scheduledAt);

  return (
    <div className="site-shell py-8 md:py-10">
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
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
                <>
                  <Button
                    variant="outline"
                    className="rounded-full border-emerald-200 bg-white/80 text-emerald-800 hover:bg-emerald-50"
                    onClick={openEditDialog}
                    disabled={isSaving}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Event
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-red-200 bg-white/80 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Event
                  </Button>
                </>
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>
              Update the details for this event.
              {isRecurring && " Changes apply to this occurrence only."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => void handleEditSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-datetime">Scheduled at</Label>
              <Input
                id="edit-datetime"
                type="datetime-local"
                value={editDateTime}
                onChange={(e) => setEditDateTime(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-emerald-200"
                onClick={() => setEditDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
