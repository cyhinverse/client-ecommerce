import Link from "next/link";
import Image from "next/image";

import { Product } from "@/types/product";

// ProductCard Component
export const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/products/${product.slug || product._id}`} className="group block">
    <div className="flex flex-col gap-4">
      {/* Image Container - Apple style: Clean, centered, subtle background */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E] transition-all duration-500 group-hover:scale-[1.02]">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name || "Product image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <span className="text-muted-foreground text-xs">No Image</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNewArrival && (
             <span className="text-[10px] font-semibold text-blue-600 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
               New
             </span>
          )}
          {product.onSale && (
             <span className="text-[10px] font-semibold text-orange-600 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
               Sale
             </span>
          )}
        </div>
      </div>

      {/* Product Info - Minimalist, centered or clean left align? Apple uses centered or left. Left fits grid better here. */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
            <div>
                 {product.isNewArrival && (
                    <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wide mb-0.5">New</p>
                 )}
                <h3 className="font-semibold text-[15px] text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {product.name || "Product Name"}
                </h3>
            </div>
             <div className="flex flex-col items-end">
                {product.onSale && product.price?.discountPrice && product.price.discountPrice < product.price.currentPrice ? (
                  <>
                    <span className="font-semibold text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price.discountPrice)}
                  </span>
                  <span className="text-[11px] text-muted-foreground line-through">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price.currentPrice)}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-sm">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price?.currentPrice || 0)}
                  </span>
                )}
             </div>
        </div>
        <p className="text-sm text-muted-foreground truncate">{product.category?.name || product.brand}</p>
      </div>
    </div>
  </Link>
);