"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RegistrationDetailsForm from "@/components/RegistrationDetailsForm";
import {
  clearGuestRegistrationEmail,
  getGuestRegistrationEmail,
  setGuestRegistrationEmail,
} from "@/lib/guestRegistrationStorage";
import {
  type CustomAnswers,
  type CustomField,
  hasCustomFields,
} from "@/lib/customFields";
import {
  type RegistrationDetails,
  hasCompleteRegistrationDetails,
} from "@/lib/registrationDetails";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface EventRegistrationButtonProps {
  userId: string | null | undefined;
  eventId: string;
  initialRegistrationStatus?: boolean;
  userDetails?: RegistrationDetails | null;
  customFields?: CustomField[];
}

export default function EventRegistrationButton({
  userId,
  eventId,
  initialRegistrationStatus = false,
  userDetails = null,
  customFields = [],
}: EventRegistrationButtonProps) {
  const [isRegistered, setIsRegistered] = useState(initialRegistrationStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  const router = useRouter();

  const hasCompleteProfile = hasCompleteRegistrationDetails(userDetails);
  const eventHasCustomFields = hasCustomFields(customFields);

  useEffect(() => {
    if (userId) {
      setIsRegistered(initialRegistrationStatus);
      return;
    }

    const storedEmail = getGuestRegistrationEmail(eventId);
    if (storedEmail) {
      setGuestEmail(storedEmail);
      setIsRegistered(true);
    } else {
      setGuestEmail(null);
      setIsRegistered(false);
    }
  }, [userId, eventId, initialRegistrationStatus]);

  async function submitRegistration(
    details?: RegistrationDetails,
    customAnswers?: CustomAnswers
  ) {
    setIsLoading(true);

    try {
      const action = isRegistered ? "unregister" : "register";
      const payload: Record<string, unknown> = {
        eventId,
        action,
      };

      if (details) {
        payload.name = details.name;
        payload.email = details.email;
        payload.mcgillId = details.mcgillId;
        payload.school = details.school;
      } else if (!userId && action === "unregister" && guestEmail) {
        payload.email = guestEmail;
      }

      if (customAnswers) {
        payload.customAnswers = customAnswers;
      }

      const response = await fetch("/api/registerEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message ?? "Something went wrong");
        return;
      }

      setIsRegistered(data.registered);

      if (data.registered && !userId) {
        const email = data.guestEmail ?? details?.email;
        if (email) {
          setGuestRegistrationEmail(eventId, email);
          setGuestEmail(email);
        }
      } else if (!data.registered && !userId) {
        clearGuestRegistrationEmail(eventId);
        setGuestEmail(null);
      }

      toast.success(data.message);
      setFormDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegistrationClick() {
    if (isRegistered) {
      await submitRegistration();
      return;
    }

    if (userId && hasCompleteProfile && !eventHasCustomFields) {
      await submitRegistration();
      return;
    }

    setFormDialogOpen(true);
  }

  async function handleFormSubmit(
    details: RegistrationDetails,
    customAnswers?: CustomAnswers
  ) {
    await submitRegistration(details, customAnswers);
  }

  const formInitialData = useMemo<RegistrationDetails>(
    () => ({
      name: userDetails?.name ?? "",
      email: userDetails?.email ?? "",
      mcgillId: userDetails?.mcgillId ?? "",
      school: userDetails?.school ?? "",
    }),
    [
      userDetails?.name,
      userDetails?.email,
      userDetails?.mcgillId,
      userDetails?.school,
    ]
  );

  const showProfileFields = !userId || !hasCompleteProfile;
  const dialogDescription = eventHasCustomFields
    ? showProfileFields
      ? userId
        ? "Please confirm your details and answer the questions below to register."
        : "Enter your details and answer the questions below to register."
      : "Please answer the questions below to complete your registration."
    : userId
      ? "Please confirm your details to register. They will be saved to your profile."
      : "Enter your details to register without an account.";

  return (
    <>
      <Toaster />
      <Button
        variant="default"
        className={`cursor-pointer rounded-full px-6 text-sm font-semibold shadow-[0_16px_30px_-20px_rgba(12,84,58,0.85)] ${
          isRegistered
            ? "bg-red-600/90 hover:bg-red-700"
            : "bg-emerald-700 hover:bg-emerald-800"
        }`}
        onClick={() => void handleRegistrationClick()}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : isRegistered ? "Unregister" : "Register"}
      </Button>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Register for this event</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <RegistrationDetailsForm
            initialData={formInitialData}
            onSubmit={handleFormSubmit}
            submitLabel="Register"
            idPrefix="event-registration"
            customFields={customFields}
            showProfileFields={showProfileFields}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
