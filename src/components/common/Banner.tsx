"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Banner() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const banners = [
    {
      id: 1,
      imageUrl: "/images/CyBer.jpg",
      title: "SUMMER COLLECTION",
      subtitle: "Discover the latest trends.",
    },
    {
      id: 2,
      imageUrl: "/images/lading.jpg",
      title: "WINTER ESSENTIALS",
      subtitle: "Stay warm in style.",
    },
    {
      id: 3,
      imageUrl: "/images/online.jpg",
      title: "NEW ARRIVALS",
      subtitle: "Be the first to wear it.",
    },
    {
      id: 4,
      imageUrl: "/images/shopping.jpg",
      title: "FALL FASHION",
      subtitle: "Upgrade your wardrobe.",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-gray-100">
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {banner.title}
              </h2>
              <p className="text-xl md:text-2xl font-light tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                {banner.subtitle}
              </p>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 rounded-none px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
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
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
