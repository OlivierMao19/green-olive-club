import { signOut, auth } from "@/auth"
import Link from "next/link"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/ui/customButton"
import NavLink from "@/components/NavLink"
import MobileMenu from "@/components/ui/MobileMenu"

const Navbar = async () => {
    const session = await auth()

    const navLinks = [
        { href: "/about", text: "About Us" },
        { href: "/events", text: "Event Calendar" },
        { href: "/executives", text: "Executives" },
        { href: "/contact", text: "Contact Us" },
    ]

    if (session?.user?.isAdmin) {
        navLinks.push({ href: "/admin", text: "Admin (Create Event)" })
    }

    async function handleSignOut() {
        "use server"
        await signOut({ redirectTo: "/" })
    }

    return (
        <header className="px-4 md:px-15 py-3 bg-white shadow-sm font-work-sans relative z-50">
            <nav className="flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/" className="mr-6">
                        <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, index) => (
                            <NavLink key={index} href={link.href}>
                                {link.text}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-5 text-black">
                    {session && session?.user ? (
                        <>
                            <form action={handleSignOut} className="hidden md:block">
                                <button type="submit" className="flex items-center justify-center">
                                    <LogOut className="size-6 text-red-500 cursor-pointer" />
                                </button>
                            </form>
                            <Link href='/profile' className="hidden md:block">
                                <Avatar className="size-10">
                                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className="hidden md:block">
                            <Button />
                        </Link>
                    )}

                    {/* Mobile Menu Component */}
                    <MobileMenu navLinks={navLinks} session={session} signOutAction={handleSignOut} />
                </div>
            </nav>
        </header>
    )
}

export default Navbar

