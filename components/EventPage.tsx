"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Info, MapPin } from "lucide-react";
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
import { useState } from "react";
import Image from "next/image";
import { deleteEventImage, postEventImage } from "@/lib/services";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (!event) return <div>Event not found</div>;
  const currentEvent = event;

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

  return (
    <div className="container mx-auto px-2 py-6 md:px-4 md:w-9/10 sm:w-full mt-6">
      <Card className="h-[70svh] bg-green-50/30 border border-green-100/60 shadow-sm">
        <CardContent className="flex flex-col items-between justify-center py-5 space-y-10 text-gray-700 relative">
          <div className="flex items-justify-center items-center justify-between">
            <Link className="" href="/events">
              <div className="flex gap-2">
                <ArrowLeft />
                <span className="font-bold text-gray-1000 text-1xl">Back</span>
              </div>
            </Link>
            {isAdmin && (
              <Button
                className="px-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                <span className="font-bold text-gray-1000 text-1xl">
                  Delete
                </span>
              </Button>
            )}
          </div>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete recurring event</DialogTitle>
                <DialogDescription>
                  This event is part of a recurring series. Choose what you want
                  to delete.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:space-x-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => void deleteEvent("THIS")}
                  disabled={isDeleting}
                >
                  Delete only this event
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => void deleteEvent("THIS_AND_FUTURE")}
                  disabled={isDeleting}
                >
                  Delete this and all future events
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <h1 className="text-3xl font-bold">{currentEvent.title}</h1>
          <div className="flex items-center font-bold">
            <Info className="mr-1 h-4 w-4" />
            <p>
              Description:{" "}
              <span className="font-normal">{currentEvent.description}</span>
            </p>
          </div>
          <div className="flex items-center font-bold">
            <MapPin className="mr-1 h-4 w-4" />
            <p>
              Location: <span className="font-normal">{currentEvent.location}</span>
            </p>
          </div>
          <div className="flex items-center font-bold">
            <Clock className="mr-1 h-4 w-4" />
            <p>
              Scheduled At:{" "}
              <span className="font-normal">
                {new Date(currentEvent.scheduledAt).toLocaleString()}
              </span>
            </p>
          </div>

          <EventRegistrationButton
            userId={userId}
            eventId={currentEvent.id}
            initialRegistrationStatus={initialRegistrationStatus}
            hasMcGillId={!!mcGillId}
          />
          {isAdmin && (
            <>
              <label htmlFor="image-event" className="flex w-fit">
                {isLoading ? (
                  <>Is loading plz wait</>
                ) : (
                  <>
                    Insert Input
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      className="hidden"
                      id="image-event"
                      onChange={(e) => {
                        handleFileInput(e.target.files?.[0]);
                      }}
                    ></input>
                  </>
                )}
              </label>
              <div className="w-40 h-40 relative">
                {imageSelected && (
                  <Image
                    src={imageSelected}
                    alt="image"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
