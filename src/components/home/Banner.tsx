"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useActiveBanners } from "@/hooks/queries";
import { useRouter } from "next/navigation";

export default function Banner() {
  const router = useRouter();
  const { data: banners = [], isLoading } = useActiveBanners();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  const length = banners.length;

  const paginate = useCallback(
    (newDirection: number) => {
      if (length === 0) return;
      setDirection(newDirection);
      setCurrentIndex(
        (prevIndex) => (prevIndex + newDirection + length) % length
      );
    },
    [length]
  );

  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) {
          paginate(1);
        }
      }, 3000);
    };

    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [paginate]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "20%" : "-20%",
      scale: 1.1,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "10%" : "-10%",
      scale: 0.95,
      opacity: 0,
    }),
  };

  const textVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.4 + i * 0.1,
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      },
    }),
  };

  if (isLoading || length === 0) {
    return (
      <div className="w-full h-full bg-[#f7f7f7] animate-pulse flex items-center justify-center rounded-lg">
        <span className="text-gray-400 text-sm font-medium">Đang tải...</span>
      </div>
    );
  }

  // Ensure index is valid
  const safeIndex =
    currentIndex >= 0 && currentIndex < length ? currentIndex : 0;
  const banner = banners[safeIndex];

  if (!banner) {
    return (
      <div className="w-full h-full bg-[#f7f7f7] animate-pulse flex items-center justify-center rounded-lg">
        <span className="text-gray-400 text-sm font-medium">
          Đang tải banner...
        </span>
      </div>
    );
  }

  return (
    <section
      className="relative w-full h-full overflow-hidden bg-gray-100 group rounded-lg"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={safeIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 35 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 },
          }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover w-full h-full select-none"
              priority
            />

            {/* Dynamic Vignette & Gradient */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            {/* Content Layer */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center px-6 text-center z-10">
              <div className="max-w-2xl space-y-4">
                <motion.span
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="inline-block px-3 py-1 rounded-full bg-[#E53935]/90 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase mb-2"
                >
                  Ưu đãi đặc biệt
                </motion.span>

                <motion.h2
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className={cn(
                    "text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter drop-shadow-md leading-tight",
                    banner.theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  {banner.title}
                </motion.h2>

                <motion.p
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className={cn(
                    "text-xs md:text-sm font-medium max-w-xs mx-auto",
                    banner.theme === "light" ? "text-black/80" : "text-white/80"
                  )}
                >
                  {banner.subtitle}
                </motion.p>

                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="flex flex-col sm:flex-row gap-2 justify-center pt-2"
                >
                  <Button
                    size="sm"
                    onClick={() => {
                      const link = banner.link;
                      if (link) {
                        router.push(link);
                      }
                    }}
                    className={cn(
                      "rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
                      banner.theme === "light"
                        ? "bg-[#E53935] text-white hover:bg-[#D32F2F]"
                        : "bg-white text-[#E53935] hover:bg-gray-100"
                    )}
                  >
                    Mua ngay
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Visible on hover */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => paginate(-1)}
          className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-[#E53935] shadow-md transition-all pointer-events-auto"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-[#E53935] shadow-md transition-all pointer-events-auto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dots - Taobao Style */}
      <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center">
        <div className="flex gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "bg-white w-5"
                  : "bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
