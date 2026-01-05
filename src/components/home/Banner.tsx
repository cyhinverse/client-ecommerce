"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getBanners } from "@/features/banner/bannerAction";
import { useRouter } from "next/navigation";

export default function Banner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { banners, isLoading } = useAppSelector((state) => state.banner);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    dispatch(getBanners({ isActive: true }));
  }, [dispatch]);

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
      <div className="w-full h-full bg-neutral-900 animate-pulse flex items-center justify-center rounded-sm">
        <span className="text-white/20 text-xl font-medium">
          Loading Experience...
        </span>
      </div>
    );
  }

  return (
    <section
      className="relative w-full h-full overflow-hidden bg-black group rounded-sm"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
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
              src={banners[currentIndex].imageUrl}
              alt={banners[currentIndex].title}
              fill
              className="object-cover w-full h-full select-none"
              priority
            />

            {/* Dynamic Vignette & Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            {/* Content Layer */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center px-6 text-center z-10">
              <div className="max-w-2xl space-y-4">
                <motion.span
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-[0.15em] uppercase mb-2"
                >
                  Prime Selection
                </motion.span>

                <motion.h2
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className={cn(
                    "text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter drop-shadow-md leading-tight",
                    banners[currentIndex].theme === "light"
                      ? "text-black"
                      : "text-white"
                  )}
                >
                  {banners[currentIndex].title}
                </motion.h2>

                <motion.p
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className={cn(
                    "text-xs md:text-sm font-medium max-w-xs mx-auto",
                    banners[currentIndex].theme === "light"
                      ? "text-black/80"
                      : "text-white/80"
                  )}
                >
                  {banners[currentIndex].subtitle}
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
                      const link = banners[currentIndex].link;
                      if (link) {
                        router.push(link);
                      }
                    }}
                    className={cn(
                      "rounded-full px-4 py-1 text-[10px] font-bold transition-all hover:scale-105 active:scale-95",
                      banners[currentIndex].theme === "light"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    )}
                  >
                    Shop Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Hidden on Idle */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none z-20">
        <button
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-black/10 hover:bg-black/40 text-white/40 hover:text-white backdrop-blur-md border border-white/5 transition-all pointer-events-auto group/nav"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover/nav:-translate-x-0.5" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-black/10 hover:bg-black/40 text-white/40 hover:text-white backdrop-blur-md border border-white/5 transition-all pointer-events-auto group/nav"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover/nav:translate-x-0.5" />
        </button>
      </div>

      {/* Modern Pagination - Sleek Apple Style Bars */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4">
        <div className="flex gap-2.5 max-w-full overflow-x-auto no-scrollbar py-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className="relative h-1 w-8 sm:w-16 rounded-full bg-white/20 overflow-hidden transition-all duration-300 hover:bg-white/40"
            >
              {idx === currentIndex && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute inset-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none blur-3xl z-[5]" />
    </section>
  );
}
