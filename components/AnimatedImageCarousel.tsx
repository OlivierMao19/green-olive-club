"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(
    () => new Set()
  );
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const currentImage = images[currentIndex];
  const imageSrc = currentImage?.src?.startsWith("/")
    ? currentImage.src
    : `/${currentImage?.src ?? ""}`;

  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoadedIndices((prev) => {
        if (prev.has(currentIndex)) return prev;
        return new Set(prev).add(currentIndex);
      });
    }
  }, [currentIndex, imageSrc]);

  if (images.length === 0) {
    return null;
  }

  const nextIndex = (currentIndex + 1) % images.length;
  const nextImageSrc = images[nextIndex]?.src?.startsWith("/")
    ? images[nextIndex].src
    : `/${images[nextIndex]?.src ?? ""}`;
  const isCurrentLoaded = loadedIndices.has(currentIndex);

  function handleImageLoad(index: number) {
    setLoadedIndices((prev) => new Set(prev).add(index));
  }

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
            <div className="relative h-full w-full overflow-hidden rounded-[1.35rem]">
              {!isCurrentLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-emerald-100 via-emerald-50 to-lime-100" />
              )}

              <div className="relative h-full w-full animate-carousel-breathe">
                <Image
                  ref={imageRef}
                  src={imageSrc}
                  alt={currentImage?.alt ?? "Club image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 512px"
                  priority={currentIndex === 0}
                  className={`object-cover transition-opacity duration-500 ${
                    isCurrentLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(currentIndex)}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Preload the next slide through Next.js image optimization */}
        {images.length > 1 && (
          <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
            <Image
              src={nextImageSrc}
              alt=""
              width={512}
              height={640}
              aria-hidden
              onLoad={() => handleImageLoad(nextIndex)}
            />
          </div>
        )}
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
