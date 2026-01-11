"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const promoItems = [
  {
    id: 1,
    title: "Mã giảm giá",
    subtitle: "Giảm đến 50%",
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200&h=200&fit=crop",
    bgColor: "from-rose-500 to-pink-500",
    href: "/vouchers",
  },
  {
    id: 2,
    title: "Hàng mới về",
    subtitle: "Cập nhật mỗi ngày",
    image:
      "https://images.unsplash.com/photo-1505797149-43b007662c21?w=200&h=200&fit=crop",
    bgColor: "from-blue-500 to-cyan-500",
    href: "/new-arrivals",
  },
  {
    id: 3,
    title: "Freeship",
    subtitle: "Đơn từ 0đ",
    image:
      "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=200&h=200&fit=crop",
    bgColor: "from-emerald-500 to-teal-500",
    href: "/free-shipping",
  },
  {
    id: 4,
    title: "Flash Sale",
    subtitle: "Giá sốc mỗi giờ",
    image:
      "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=200&h=200&fit=crop",
    bgColor: "from-amber-500 to-orange-500",
    href: "/flash-sale",
  },
];

export default function PromoGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 h-full">
      {promoItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group relative bg-[#f7f7f7] rounded-lg overflow-hidden hover:bg-[#f0f0f0] transition-all duration-200 flex items-center p-3 gap-3"
        >
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E53935] transition-colors">
              {item.title}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{item.subtitle}</p>
            <span className="inline-flex items-center gap-0.5 text-[10px] text-[#E53935] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Xem ngay <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Image */}
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Decorative gradient corner - removed for flat design */}
        </Link>
      ))}
    </div>
  );
}
