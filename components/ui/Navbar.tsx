
import { signOut, auth } from '@/auth'
import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/customButton";
import NavLink from "@/components/NavLink";

const Navbar = async () => {
    const session = await auth();
    const navLinks = [
        { href: "/about", text: "About Us" },
        { href: "/events", text: "Event Calendar" },
        { href: "/executives", text: "Executives" },
        { href: "/contact", text: "Contact Us" },
    ];
    return (
        <header className="px-15 py-3 bg-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <div className="flex justify-between items-center gap-10">
                    <Link href="/">
                        <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    </Link>

                    {navLinks.map((link, index) => (
                        <NavLink key={index} href={link.href}>{link.text}</NavLink>)
                    )}
                </div>
                <div className="flex items-center gap-5 text-black">
                    {session && session?.user ? (
                        <>
                            <form
                                action={async () => {
                                    "use server";

                                    await signOut({ redirectTo: "/" });
                                }}
                            >
                                <button type="submit" className="flex items-center justify-center">
                                    <LogOut className="size-6 text-red-500 cursor-pointer" />
                                </button>
                            </form>
                            <Link href={`/user/${session?.id}`}>
                                <Avatar className="size-10">
                                    <AvatarImage
                                        src={session?.user?.image || ""}
                                        alt={session?.user?.name || ""}
                                    />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </Link>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button />
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar