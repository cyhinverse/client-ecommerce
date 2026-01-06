"use client";
import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

const subsidyProducts = [
  {
    id: 1,
    name: "Router WiFi 6",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop",
    price: "167.200",
    originalPrice: "299.000",
    tag: "Giá sốc",
  },
  {
    id: 2,
    name: "Nước sốt Nhật",
    image:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&h=200&fit=crop",
    price: "13.900",
    originalPrice: "25.000",
    tag: "Hot",
  },
  {
    id: 3,
    name: "Hộp đựng đồ",
    image:
      "https://images.unsplash.com/photo-1582030043134-8da0f9919f03?w=200&h=200&fit=crop",
    price: "9.800",
    originalPrice: "19.000",
    tag: "Deal",
  },
  {
    id: 4,
    name: "Máy giặt mini",
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&h=200&fit=crop",
    price: "949.400",
    originalPrice: "1.500.000",
    tag: "Best",
  },
];

export default function SubsidySection() {
  return (
    <div className="w-full h-full bg-[#f7f7f7] rounded-lg p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#E53935] fill-[#E53935]" />
          <h3 className="text-base font-bold text-[#E53935]">Flash Sale</h3>
          <span className="bg-[#E53935] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            Kết thúc sau 02:30:45
          </span>
        </div>
        <Link 
          href="/flash-sale" 
          className="flex items-center gap-1 text-gray-600 text-xs hover:text-[#E53935] transition-colors"
        >
          Xem tất cả
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="flex-1 grid grid-cols-4 gap-2">
        {subsidyProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="flex flex-col items-center group cursor-pointer bg-white rounded-lg p-2 hover:shadow-lg transition-all duration-200"
          >
            {/* Product Image */}
            <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-md">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Tag Badge */}
              <span className="absolute top-1 left-1 bg-[#E53935] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                {product.tag}
              </span>
            </div>
            
            {/* Price */}
            <div className="flex flex-col items-center w-full">
              <div className="flex items-baseline gap-0.5 text-[#E53935]">
                <span className="text-[10px] font-medium">₫</span>
                <span className="text-sm font-bold">{product.price}</span>
              </div>
              <span className="text-[10px] text-gray-400 line-through">
                ₫{product.originalPrice}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
