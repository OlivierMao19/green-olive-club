"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MobileMenuToggle from "@/components/ui/MobileMenuToggle";
import NavLink from "@/components/NavLink";
import { LogOut } from "lucide-react";

interface NavLink {
  href: string;
  text: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  session: any;
  signOutAction: () => Promise<void>;
}

export default function MobileMenu({ navLinks, session, signOutAction }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    setIsOpen(false)
    await signOutAction()
  }

  return (
    <div className="md:hidden">
      <MobileMenuToggle isOpen={isOpen} onToggle={setIsOpen} />

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-full left-0 right-0 bg-white shadow-md transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 invisible"}
    `}
      >
        <div className="flex flex-col p-4 space-y-4 text-gray-800">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setTimeout(() => setIsOpen(false), 200)}
            >
              {link.text}
            </Link>
          ))}

          <div className="border-t border-gray-200 pt-4 mt-2">
            {session && session?.user ? (
              <div className="flex flex-col gap-3">
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{session?.user?.name || "Profile"}</span>
                </Link>
                <div className="text-red-600">
                  <Button variant="outline" className="w-full justify-center mt-2 border-gray-200 bg-red-50/30" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-center border-gray-200 bg-green-600/90 text-gray-100">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
