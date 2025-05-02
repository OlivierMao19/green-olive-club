import { PropsWithChildren, ReactNode } from "react";

interface NavLinkProp {
  href: string;
}

export default function NavLink({
  href,
  children,
}: PropsWithChildren<NavLinkProp>) {
  return (
    <a href={href} className="text-gray-800 hover:text-gray-600">
      {children}
    </a>
  );
}
