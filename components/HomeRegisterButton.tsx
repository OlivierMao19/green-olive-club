"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
interface HomeRegisterButtonProps {
  isLoggedIn: boolean;
}
export default function HomeRegisterButton({
  isLoggedIn,
}: HomeRegisterButtonProps) {
  const handleRegisterClick = () => {
    if (isLoggedIn) {
      toast("You are already logged in. Head to Events to register.", {
        icon: "OK",
      });
    }
  };

  return isLoggedIn ? (
    <Button
      size="lg"
      className="rounded-full bg-emerald-700 px-7 text-white hover:bg-emerald-800"
      onClick={handleRegisterClick}
    >
      Register for an Event
    </Button>
  ) : (
    <Button
      asChild
      size="lg"
      className="rounded-full bg-emerald-700 px-7 text-white hover:bg-emerald-800"
    >
      <Link href="/login">Create Account</Link>
    </Button>
  );
}
