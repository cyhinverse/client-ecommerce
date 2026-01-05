"use client";
import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const promoItems = [
  {
    id: 1,
    title: "Coupon Center",
    subtitle: "iPhone 15 Pro",
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200&h=200&fit=crop",
    price: "4390",
    badge: "Sale",
  },
  {
    id: 2,
    title: "Sourcing Deals",
    subtitle: "Office Chair",
    image:
      "https://images.unsplash.com/photo-1505797149-43b007662c21?w=200&h=200&fit=crop",
    price: "146",
    badge: "Choice",
  },
  {
    id: 3,
    title: "Tmall Factory",
    subtitle: "Bedding Set",
    image:
      "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=200&h=200&fit=crop",
    price: "23",
    badge: "Lowest",
  },
  {
    id: 4,
    title: "Flash Sale",
    subtitle: "Storage Rack",
    image:
      "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=200&h=200&fit=crop",
    price: "110",
    badge: "Flash",
  },
];

export default function PromoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {promoItems.map((item) => (
        <div
          key={item.id}
          className="bg-card rounded-xl p-4 transition-all hover:bg-card/80 cursor-pointer flex flex-col h-[200px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <span className="bg-primary text-primary-foreground text-[9px] px-1 rounded-sm font-bold uppercase">
              {item.badge}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[10px] text-muted-foreground line-clamp-2">
                {item.subtitle}
              </span>
              <div className="mt-auto">
                <div className="inline-flex items-center text-primary font-bold">
                  <span className="text-[10px]">¥</span>
                  <span className="text-xs leading-none">{item.price}</span>
                </div>
              </div>
            </div>
            <div className="relative w-24 h-24 shrink-0 transition-transform hover:scale-105">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
