"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface EventRegistrationButtonProps {
  userId: string | null | undefined;
  eventId: string;
  initialRegistrationStatus?: boolean;
  hasMcGillId: boolean;
}

export default function EventRegistrationButton({
  userId,
  eventId,
  initialRegistrationStatus = false,
  hasMcGillId,
}: EventRegistrationButtonProps) {
  const [isRegistered, setIsRegistered] = useState(initialRegistrationStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRegistration() {
    if (!userId) {
      router.push("/login");

      return;
    } else if (!hasMcGillId) {
      router.push("/profile");
    } else {
      setIsLoading(true);

      try {
        const action = isRegistered ? "unregister" : "register";

        const response = await fetch("/api/registerEvent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, eventId, action }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsRegistered(data.registered);
          toast.success(data.message);

          router.refresh(); // Refresh the page to update any server components
        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

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
        onClick={handleRegistration}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : isRegistered ? "Unregister" : "Register"}
      </Button>
    </>
  );
}
