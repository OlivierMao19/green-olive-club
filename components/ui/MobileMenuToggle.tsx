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
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors z-50"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
    )
}

