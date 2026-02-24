"use client"

import { useEffect } from "react"
import { Menu, X } from "lucide-react"


interface MobileMenuToggleProps {
    onToggle: (isOpen: boolean) => void
    isOpen: boolean

}

export default function MobileMenuToggle({ onToggle, isOpen }: MobileMenuToggleProps) {
    const handleToggle = () => {
        onToggle(!isOpen)
    }

    // Close menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                onToggle(false)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [isOpen, onToggle])

    return (
        <button
            onClick={handleToggle}
            className="md:hidden rounded-full border border-emerald-200/80 bg-white/80 p-2.5 text-emerald-900 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
    )
}
