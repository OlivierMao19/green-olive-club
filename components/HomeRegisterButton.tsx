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
      toast("You're already logged in dummy!", { icon: "🤪" });
    }
  };

  return isLoggedIn ? (
    <Button
      size="lg"
      className="bg-green-700 hover:bg-green-800"
      onClick={handleRegisterClick}
    >
      Register Now
    </Button>
  ) : (
    <Button asChild size="lg" className="bg-green-700 hover:bg-green-800">
      <Link href="/login">Register Now</Link>
    </Button>
  );
}
