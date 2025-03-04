
import { signOut, auth } from '@/auth'
import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/customButton";

const Navbar = async () => {
    const session = await auth();
    return (
        <header className="px-15 py-3 bg-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <div className="flex justify-between items-center gap-10">
                    <Link href="/">
                        <Image src="/logo.png" alt="Logo" width={50} height={50} />
                    </Link>

                    <Link href="/about">
                        <span className="cursor-pointer">About Us</span>
                    </Link>
                    <Link href="/events">
                        <span className="cursor-pointer">Event Calendar</span>
                    </Link>
                    <Link href="/executives">
                        <span className="cursor-pointer">Executives</span>
                    </Link>
                    <Link href="/contact">
                        <span className="cursor-pointer">Contact Us</span>
                    </Link>
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