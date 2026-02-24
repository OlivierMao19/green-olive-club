"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MobileMenuToggle from "@/components/ui/MobileMenuToggle";
import { LogOut } from "lucide-react";
import { Session } from "next-auth";

interface NavLink {
  href: string;
  text: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  session: Session | null;
  signOutAction: () => Promise<void>;
}

export default function MobileMenu({ navLinks, session, signOutAction }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOutAction();
  };

  return (
    <div className="md:hidden relative z-50">
      <MobileMenuToggle isOpen={isOpen} onToggle={setIsOpen} />

      <div
        className={`absolute right-0 top-[calc(100%+0.7rem)] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-[0_24px_55px_-30px_rgba(12,63,45,0.75)] backdrop-blur transition-all duration-300 ease-out ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        } z-50`}
      >
        <div className="flex flex-col gap-2 p-3">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-emerald-900/80 hover:bg-emerald-50"
              onClick={() => setTimeout(() => setIsOpen(false), 120)}
            >
              {link.text}
            </Link>
          ))}

          <div className="mt-1 border-t border-emerald-100 px-1 pt-3">
            {session && session?.user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-emerald-50"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-emerald-950">{session?.user?.name || "Profile"}</span>
                </Link>
                <div className="pt-1">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center bg-emerald-600 text-white hover:bg-emerald-700">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-emerald-950/15 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
