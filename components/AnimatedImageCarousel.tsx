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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative aspect-square max-w-md mx-auto overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{
              opacity: 0,
              x: 300,
              rotate: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: 0,
              zIndex: 1,
              transition: {
                duration: 0.8,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: 300,
              rotate: 10,
              zIndex: 0,
              transition: {
                duration: 0.8,
                ease: "easeIn",
              },
            }}
            className="absolute inset-0 rounded-lg bg-white shadow-xl overflow-hidden"
          >
            <motion.img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover p-4"
              animate={{
                scale: [1, 1.02, 1],
                rotate: [0, 1, 0, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="absolute -bottom-4 -right-4 rounded-lg bg-club-green py-3 px-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white font-medium">Join us today!</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedImageCarousel;
