import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect } from "react";

export default function Banner() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const banners = [
    {
      id: 1,
      imageUrl: "/images/CyBer.jpg",
      altText: "Summer Sale - Up to 50% Off!",
    },
    {
      id: 2,
      imageUrl: "/images/lading.jpg",
      altText: "Winter Clearance - Up to 70% Off!",
    },
    {
      id: 3,
      imageUrl: "/images/online.jpg",
      altText: "Spring Collection - New Arrivals!",
    },
    {
      id: 4,
      imageUrl: "/images/shopping.jpg",
      altText: "Fall Fashion - Trends You Can't Miss!",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="flex-1 h-[400px] flex border border-gray-200 rounded-xl overflow-hidden relative">
      {/* Chỉ hiển thị banner hiện tại */}
      <div key={banners[currentIndex].id} className="w-full h-full relative">
        <img
          className="object-cover w-full h-full relative"
          src={banners[currentIndex].imageUrl}
        />

        {/* Nút điều hướng */}
        <ArrowLeft
          onClick={handlePrev}
          className="absolute h-[30px] w-[30px] top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200 opacity-80 border border-gray-300"
        />
        <ArrowRight
          onClick={handleNext}
          className="absolute h-[30px] w-[30px] top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200 opacity-80 border border-gray-300"
        />
      </div>

      {/* Indicators/Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
