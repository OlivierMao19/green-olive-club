"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedImageCarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  interval?: number;
}

const AnimatedImageCarousel: React.FC<AnimatedImageCarouselProps> = ({
  images,
  interval = 10000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  const imageSrc = currentImage?.src?.startsWith("/")
    ? currentImage.src
    : `/${currentImage?.src ?? ""}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative aspect-[4/5]">
        <div className="absolute -left-5 top-8 h-24 w-24 rounded-2xl bg-emerald-200/45 blur-xl" />
        <div className="absolute -right-6 bottom-10 h-32 w-32 rounded-full bg-lime-200/45 blur-xl" />

        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{
              opacity: 0,
              y: 30,
              rotate: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 0,
              zIndex: 1,
              transition: {
                duration: 0.6,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: -24,
              rotate: 2,
              zIndex: 0,
              transition: {
                duration: 0.4,
                ease: "easeIn",
              },
            }}
            className="absolute inset-0 overflow-hidden rounded-[1.8rem] border border-white/70 bg-white p-2 shadow-[0_32px_60px_-32px_rgba(17,78,58,0.9)]"
            style={{ transformOrigin: "center center" }}
          >
            <motion.img
              src={imageSrc}
              alt={currentImage?.alt ?? "Club image"}
              className="h-full w-full rounded-[1.35rem] object-cover"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Show ${image.alt}`}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "w-8 bg-emerald-700"
                : "w-2 bg-emerald-200 hover:bg-emerald-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AnimatedImageCarousel;
