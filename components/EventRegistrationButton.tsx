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
      router.push("/signin");
      return;
    } else if (!hasMcGillId) {
      router.push("/home");
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
        className={
          isRegistered
            ? "bg-red-700 hover:bg-red-800"
            : "bg-green-700 hover:bg-green-800"
        }
        onClick={handleRegistration}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : isRegistered ? "Unregister" : "Register"}
      </Button>
    </>
  );
}
