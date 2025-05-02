"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

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
        className="px-6 py-3 rounded-md inline-flex bg-gradient-to-b from-blue-950 to-black hover:bg-opacity-90"
        whileHover={{ scale: 1.05 }}
      >
        <button className="text-white rounded-md font-medium flex items-center">
          {children}
        </button>
      </motion.div>
    </Link>
  );
}
