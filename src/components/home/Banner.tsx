"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

type BannerItem = {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  theme?: "light" | "dark";
};

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  // Banner data with themes for text contrast
  const banners: BannerItem[] = useMemo(
    () => [
      {
        id: 1,
        imageUrl: "/images/1.png",
        title: "The Future of Fluidity",
        subtitle: "Experience the ultimate collection designed for the modern era.",
        theme: "dark",
      },
      {
        id: 2,
        imageUrl: "/images/2.png",
        title: "Titanium Strength",
        subtitle: "Minimalist aesthetic meets uncompromising durability.",
        theme: "light",
      },
      {
        id: 3,
        imageUrl: "/images/3.png",
        title: "Vibrant Expressions",
        subtitle: "Colors that define your unique style journey.",
        theme: "light",
      },
      {
        id: 4,
        imageUrl: "/images/4.png",
        title: "Autumn Elegance",
        subtitle: "Layered textures for the season of transitions.",
        theme: "dark",
      },
      {
        id: 5,
        imageUrl: "/images/5.png",
        title: "Urban Utility",
        subtitle: "Functionality redefined for the city explorer.",
        theme: "dark",
      },
      {
        id: 6,
        imageUrl: "/images/6.png",
        title: "Celestial Glow",
        subtitle: "Ethereal materials that capture the light.",
        theme: "light",
      },
      {
        id: 7,
        imageUrl: "/images/7.png",
        title: "Pure Comfort",
        subtitle: "The softest fabrics you've ever experienced.",
        theme: "light",
      },
      {
        id: 8,
        imageUrl: "/images/8.png",
        title: "Precision Edge",
        subtitle: "Sharp silhouettes for a lasting impression.",
        theme: "dark",
      },
      {
        id: 9,
        imageUrl: "/images/9.png",
        title: "Timeless Classic",
        subtitle: "Style that transcends trends and generations.",
        theme: "dark",
      },
      {
        id: 10,
        imageUrl: "/images/10.png",
        title: "Bold Frontier",
        subtitle: "A daring approach to modern sportswear.",
        theme: "light",
      },
      {
        id: 11,
        imageUrl: "/images/11.png",
        title: "Final Horizon",
        subtitle: "Where technology meets the ultimate craftsmanship.",
        theme: "dark",
      },
    ],
    []
  );

  const length = banners.length;

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => (prevIndex + newDirection + length) % length);
    },
    [length]
  );

  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) {
          paginate(1);
        }
      }, 1000);
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

  return (
    <section
      className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-black group"
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
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center md:pb-20 px-6 text-center z-10">
              <div className="max-w-4xl space-y-6">
                 <motion.span
                   custom={0}
                   initial="hidden"
                   animate="visible"
                   variants={textVariants}
                   className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase mb-4"
                 >
                   Prime Selection
                 </motion.span>
                 
                 <motion.h2
                   custom={1}
                   initial="hidden"
                   animate="visible"
                   variants={textVariants}
                   className={cn(
                     "text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-[0.9]",
                     banners[currentIndex].theme === "light" ? "text-black drop-shadow-none" : "text-white"
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
                     "text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-lg",
                     banners[currentIndex].theme === "light" ? "text-black/80 drop-shadow-none" : "text-white/80"
                   )}
                 >
                   {banners[currentIndex].subtitle}
                 </motion.p>
                 
                 <motion.div
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                 >
                   <Button
                     size="lg"
                     className={cn(
                       "rounded-full px-12 py-8 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl",
                       banners[currentIndex].theme === "light" 
                        ? "bg-black text-white hover:bg-black/90 shadow-black/10" 
                        : "bg-white text-black hover:bg-white/90 shadow-white/10"
                     )}
                   >
                     <ShoppingBag className="mr-2 h-5 w-5" />
                     Shop the Look
                   </Button>
                   <Button
                     size="lg"
                     variant="outline"
                     className={cn(
                       "rounded-full px-12 py-8 text-lg font-bold backdrop-blur-md transition-all hover:scale-105",
                       banners[currentIndex].theme === "light"
                        ? "border-black/20 text-black hover:bg-black/5 bg-white/10"
                        : "border-white/40 text-white hover:bg-white/20 bg-black/10"
                     )}
                   >
                     Explore Collection
                   </Button>
                 </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Hidden on Idle */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20">
         <button
           onClick={() => paginate(-1)}
           className="p-4 rounded-full bg-black/10 hover:bg-black/40 text-white/40 hover:text-white backdrop-blur-md border border-white/5 transition-all pointer-events-auto group/nav"
         >
           <ChevronLeft className="w-8 h-8 transition-transform group-hover/nav:-translate-x-1" />
         </button>
         <button
           onClick={() => paginate(1)}
           className="p-4 rounded-full bg-black/10 hover:bg-black/40 text-white/40 hover:text-white backdrop-blur-md border border-white/5 transition-all pointer-events-auto group/nav"
         >
           <ChevronRight className="w-8 h-8 transition-transform group-hover/nav:translate-x-1" />
         </button>
      </div>

      {/* Modern Pagination - Sleek Apple Style Bars */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center px-4">
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
      
      {/* Decorative Bloom Overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none blur-3xl z-[5]" />
    </section>
  );
}
