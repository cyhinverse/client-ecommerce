"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const subsidyProducts = [
  {
    id: 1,
    name: "Router",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop",
    price: "167.2",
    tag: "Lowest",
  },
  {
    id: 2,
    name: "Sauce",
    image:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&h=200&fit=crop",
    price: "13.9",
    tag: "Hot",
  },
  {
    id: 3,
    name: "Box",
    image:
      "https://images.unsplash.com/photo-1582030043134-8da0f9919f03?w=200&h=200&fit=crop",
    price: "9.8",
    tag: "Deal",
  },
  {
    id: 4,
    name: "Washer",
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&h=200&fit=crop",
    price: "949.4",
    tag: "Best",
  },
];

export default function SubsidySection() {
  return (
    <div className="flex-1 bg-card rounded-xl p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-bold text-foreground">
          10 Billion Subsidy
        </h3>
        <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold border border-black">
          OFFICIAL
        </span>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 items-start">
        {subsidyProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-full aspect-square mb-2 bg-transparent p-2 transition-transform group-hover:-translate-y-1">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center bg-orange-600 text-white rounded-[4px] px-1.5 py-0.5 w-full max-w-[60px]">
                <span className="text-[10px] font-medium">¥</span>
                <span className="text-sm font-bold leading-none ml-0.5">
                  {product.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
