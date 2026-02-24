import { signOut, auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/customButton";
import NavLink from "@/components/NavLink";
import MobileMenu from "@/components/ui/MobileMenu";
import { Button as UiButton } from "@/components/ui/button";

const Navbar = async () => {
  const session = await auth();

  const navLinks = [
    { href: "/about", text: "About Us" },
    { href: "/events", text: "Event Calendar" },
    { href: "/executives", text: "Executives" },
  ];

  if (session?.user?.isAdmin) {
    navLinks.push({ href: "/admin", text: "Admin (Create Event)" });
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/78 py-3 shadow-[0_10px_30px_-26px_rgba(10,45,32,0.85)] backdrop-blur">
      <nav className="site-shell flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="GOCCC logo" width={44} height={44} className="rounded-full border border-emerald-100/80" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-900/70">Green Olive Club</p>
              <p className="text-xs text-emerald-900/55">McGill Chinese Christian Community</p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-emerald-100/70 bg-white/65 p-1 shadow-sm md:flex">
            {navLinks.map((link, index) => (
              <NavLink key={index} href={link.href}>
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session && session?.user ? (
            <>
              <form action={handleSignOut} className="hidden md:block">
                <UiButton
                  type="submit"
                  variant="outline"
                  className="rounded-full border-rose-200/90 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                >
                  <LogOut className="size-4" />
                  Logout
                </UiButton>
              </form>
              <Link href="/profile" className="hidden md:block">
                <Avatar className="size-10 ring-2 ring-white">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button />
            </Link>
          )}

          <MobileMenu
            navLinks={navLinks}
            session={session}
            signOutAction={handleSignOut}
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
