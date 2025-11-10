import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "../ui/card";

export default function ListFeatures() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const features = [
    "Free Shipping on orders over $50",
    "24/7 Customer Support",
    "30-Day Money-Back Guarantee",
    "Secure Online Payments",
  ];

  const hoverEffects = [
    "bg-green-200",
    "bg-blue-200",
    "bg-red-200",
    "bg-yellow-200",
  ];

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      <div className="w-full flex justify-center m-10">
        <h1 className="text-5xl font-bold">Our Features</h1>
      </div>
      <div className="w-full max-w-7xl flex gap-10 mt-10 ">
        {features.map((feature, index) => (
          <Card
            onClick={() => handleClick(index)}
            className={`flex flex-col w-[300px] h-[300px] justify-center cursor-pointer items-center p-5 bg-white border ${
              currentIndex === index && isClient
                ? hoverEffects[currentIndex]
                : "bg-none"
            } shadow-sm hover:shadow-lg duration-300 ease-in-out transition-all`}
            key={index}
          >
            <CardTitle className="text-center">{feature}</CardTitle>
          </Card>
        ))}
      </div>
    </>
  );
}
