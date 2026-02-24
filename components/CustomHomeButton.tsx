"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { ArrowRight } from "lucide-react";

interface CustomHomeButtonProp {
  link: string;
}

export default function CustomHomeButton({
  link,
  children,
}: PropsWithChildren<CustomHomeButtonProp>) {
  return (
    <Link href={link} className="inline-block">
      <motion.div
        className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(12,84,58,0.85)] transition-colors hover:bg-emerald-800"
        whileHover={{ scale: 1.03, y: -1 }}
      >
        <span className="flex items-center gap-2">
          {children}
          <ArrowRight className="h-4 w-4" />
        </span>
      </motion.div>
    </Link>
  );
}
