"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type BannerItem = {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
};

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const autoplayRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  // Banner data memoized so reference stable
  const banners: BannerItem[] = useMemo(
    () => [
      { id: 1, imageUrl: "/images/CyBer.jpg", title: "SUMMER COLLECTION", subtitle: "Discover the latest trends." },
      { id: 2, imageUrl: "/images/lading.jpg", title: "WINTER ESSENTIALS", subtitle: "Stay warm in style." },
      { id: 3, imageUrl: "/images/online.jpg", title: "NEW ARRIVALS", subtitle: "Be the first to wear it." },
      { id: 4, imageUrl: "/images/shopping.jpg", title: "FALL FASHION", subtitle: "Upgrade your wardrobe." },
    ],
    []
  );

  const length = banners.length;

  const goTo = useCallback((idx: number) => {
    setCurrentIndex((prev) => {
      if (idx === prev) return prev;
      if (idx < 0) return length - 1;
      if (idx >= length) return 0;
      return idx;
    });
  }, [length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  }, [length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  // Autoplay with pause on hover/focus
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) {
          setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
        }
      }, 5000);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };

    startAutoplay();
    return () => stopAutoplay();
  }, [length]);

  // Pause on hover/focus
  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
  }, []);
  const handleFocus = useCallback(() => {
    isHoveringRef.current = true;
  }, []);
  const handleBlur = useCallback(() => {
    isHoveringRef.current = false;
  }, []);

  return (
    <section
      className="relative w-full h-[80vh] min-h-[480px] overflow-hidden bg-gray-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Slides wrapper uses transform for sliding (GPU) */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          willChange: "transform",
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
            aria-hidden={index !== currentIndex}
            role="group"
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              // Provide natural sizes to avoid reflow
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
              // Only first image get priority; others lazy load
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />

            {/* Content (lightweight animations only on text, not whole slide) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 pointer-events-auto">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3 transform-gpu transition-opacity duration-400">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl font-light tracking-wide mb-6 transform-gpu transition-opacity duration-400">
                {banner.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-none px-6 py-2"
                aria-label={`Shop now for ${banner.title}`}
              >
                SHOP NOW
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm transition"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
