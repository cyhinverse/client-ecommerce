import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Product } from "@/types/product";

// ProductCard Component
export const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/products/${product.slug || product._id}`} className="group block">
    <Card className="overflow-hidden border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name || "Product image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-xs">No Image</span>
            </div>
          )}

          {product.onSale && (
            <Badge className="absolute top-2 right-2 bg-black text-white border-0 text-[10px] h-5 px-2">
              SALE
            </Badge>
          )}

          {product.isNewArrival && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 text-[10px] h-5 px-2 backdrop-blur-sm bg-white/80"
            >
              NEW
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:underline">
            {product.name || "Product Name"}
          </h3>
          <p className="text-xs text-muted-foreground">{product.brand || "Brand"}</p>
          <div className="flex items-baseline gap-2 pt-1">
            {product.onSale && product.price?.discountPrice && product.price.discountPrice < product.price.currentPrice ? (
              <>
                <span className="font-semibold text-sm">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price.discountPrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
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
      </CardContent>
    </Card>
  </Link>
);