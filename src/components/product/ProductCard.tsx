import Link from "next/link";
import Image from "next/image";

import { Product } from "@/types/product";

// ProductCard Component
export const ProductCard = ({ product }: { product: Product }) => (
  <Link
    href={`/products/${product.slug || product._id}`}
    className="group block h-full"
  >
    <div className="flex flex-col gap-2 p-2 rounded-xl hover:bg-card transition-colors duration-200">
      {/* Image Container - Reduced radius to rounded-xl */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {product.images?.[0] || product.variants?.[0]?.images?.[0] ? (
          <Image
            src={
              product.images?.[0] || product.variants?.[0]?.images?.[0] || ""
            }
            alt={product.name || "Product image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <span className="text-muted-foreground text-[10px]">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info - Compact layout */}
      <div className="space-y-1">
        <h3 className="font-medium text-[13px] leading-tight text-foreground line-clamp-2 h-9 group-hover:text-primary transition-colors">
          {product.name || "Product Name"}
        </h3>

        <div className="flex items-baseline gap-1.5 pt-1">
          {product.onSale &&
          product.price?.discountPrice &&
          product.price.discountPrice < product.price.currentPrice ? (
            <>
              <span className="font-bold text-[15px] text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(product.price.discountPrice)}
              </span>
              <span className="text-[11px] text-muted-foreground line-through decoration-muted-foreground/50">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(product.price.currentPrice)}
              </span>
            </>
          ) : (
            <span className="font-bold text-[15px] text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(product.price?.currentPrice || 0)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span className="truncate max-w-[80px]">
            {product.brand || "BaBy Shop"}
          </span>
          <span>
            {product.soldCount > 0 ? `${product.soldCount} đã bán` : "Mới"}
          </span>
        </div>
      </div>
    </div>
  </Link>
);
