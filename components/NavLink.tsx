"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface NavLinkProp {
  href: string;
}

export default function NavLink({
  href,
  children,
}: PropsWithChildren<NavLinkProp>) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-emerald-100/80 text-emerald-900 shadow-sm"
          : "text-emerald-900/75 hover:bg-white/75 hover:text-emerald-900"
      }`}
    >
      {children}
    </Link>
  );
}
