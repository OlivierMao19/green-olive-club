"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import MobileMenuToggle from "@/components/ui/MobileMenuToggle"
import NavLink from "@/components/NavLink"

interface NavLink {
    href: string
    text: string
}

interface MobileMenuProps {
    navLinks: NavLink[]
    session: any
    signOutAction: () => Promise<void>
}

export default function MobileMenu({ navLinks, session }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <div className="md:hidden">
            <MobileMenuToggle isOpen={isOpen} onToggle={setIsOpen} />

            {/* Mobile Menu Dropdown */}
            <div
                className={`absolute top-full left-0 right-0 bg-white shadow-md transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 invisible"}
    `}
            >
                <div className="flex flex-col p-4 space-y-4">

                    {navLinks.map((link, index) => (
                        <Link key={index} href={link.href} onClick={() => setTimeout(() => setIsOpen(false), 200)} >
                            {link.text}
                        </Link>
                    ))}

                    <div className="border-t border-gray-200 pt-4 mt-2">
                        {session && session?.user ? (
                            <div className="flex items-center justify-between">
                                <Link
                                    href='/profile'
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3"
                                >
                                    <Avatar className="size-10">
                                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                        <AvatarFallback>AV</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{session?.user?.name || "Profile"}</span>
                                </Link>

                            </div>
                        ) : (
                            <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                <Button className="w-full justify-center" />
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
    )
}

