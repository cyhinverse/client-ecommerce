import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getFeaturedProducts } from "@/features/product/productAction";
import { useEffect } from "react";
import SpinnerLoading from "./SpinerLoading";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function ProductFeatures() {
  const dispatch = useAppDispatch();
  const { isLoading, product, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  if (isLoading) {
    return <SpinnerLoading />;
  }
  if (error) {
    toast.error(error);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Sản Phẩm Nổi Bật
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Khám phá những sản phẩm được yêu thích nhất
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {product && product.length > 0 ? (
          product.map((p) => (
            <Card
              key={p._id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/${p.slug}`}>
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {p.images && p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-12 h-12 mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">No image</p>
                      </div>
                    )}

                    {/* Sale Badge */}
                    {p.price?.discountPrice &&
                      p.price.discountPrice < p.price.currentPrice && (
                        <Badge className="absolute top-3 right-3 bg-red-600 hover:bg-red-700">
                          -
                          {Math.round(
                            ((p.price.currentPrice - p.price.discountPrice) /
                              p.price.currentPrice) *
                              100
                          )}
                          %
                        </Badge>
                      )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-500">{p.brand}</p>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      {p.price?.discountPrice &&
                      p.price.discountPrice < p.price.currentPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(p.price.discountPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(p.price.currentPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(p.price?.currentPrice || 0)}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">💎</div>
            <p className="text-xl text-gray-600 mb-2">
              Chưa có sản phẩm nổi bật
            </p>
            <p className="text-gray-500">Sản phẩm sẽ được cập nhật sớm nhất</p>
          </div>
        )}
      </div>
    </div>
  );
}
