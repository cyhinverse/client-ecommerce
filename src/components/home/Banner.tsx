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
      {
        id: 1,
        imageUrl: "/images/CyBer.jpg",
        title: "Summer Collection",
        subtitle: "Pro. Beyond.",
      },
      {
        id: 2,
        imageUrl: "/images/lading.jpg",
        title: "Winter Essentials",
        subtitle: "Titanium. So strong. So light.",
      },
      {
        id: 3,
        imageUrl: "/images/online.jpg",
        title: "New Arrivals",
        subtitle: "Lovable. Drawable. Magical.",
      },
      {
        id: 4,
        imageUrl: "/images/shopping.jpg",
        title: "Fall Fashion",
        subtitle: "Wonder awaits.",
      },
    ],
    []
  );

  const length = banners.length;

  const goTo = useCallback(
    (idx: number) => {
      setCurrentIndex((prev) => {
        if (idx === prev) return prev;
        if (idx < 0) return length - 1;
        if (idx >= length) return 0;
        return idx;
      });
    },
    [length]
  );



  // Autoplay with pause on hover/focus
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayRef.current) return;
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) {
          setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
        }
      }, 6000);
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
      className="relative w-full h-[calc(100vh-48px)] overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Slides wrapper uses transform for sliding (GPU) */}
      <div
        className="flex h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"
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
              width={1920}
              height={1080}
              className="object-cover w-full h-full opacity-80"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pb-32 pointer-events-none">
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-4 drop-shadow-2xl">
                {banner.title}
              </h2>
              <p className="text-xl md:text-3xl font-normal tracking-wide mb-8 drop-shadow-lg opacity-90">
                {banner.subtitle}
              </p>
              <div className="pointer-events-auto flex gap-4">
                 <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium transition-transform hover:scale-105"
                >
                  Learn More
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-6 text-base font-medium transition-transform hover:scale-105 bg-transparent backdrop-blur-md"
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ease-out backdrop-blur-md ${
              idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
