import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Card, CardContent } from "../ui/card";
import SpinnerLoading from "./SpinerLoading";
import { toast } from "sonner";
import { useEffect } from "react";
import { getOnSaleProducts } from "@/features/product/productAction";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function OnSaleProduct() {
  const dispatch = useAppDispatch();
  const { isLoading, product, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getOnSaleProducts());
  }, [dispatch]);

  if (isLoading) {
    return <SpinnerLoading />;
  }
  if (error) {
    toast.error(error);
  }

  const saleProducts =
    product?.filter(
      (p) =>
        p.onSale &&
        p.price?.discountPrice &&
        p.price?.currentPrice &&
        p.price.discountPrice < p.price.currentPrice
    ) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Sản Phẩm Giảm Giá
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Ưu đãi đặc biệt - Mua ngay kẻo lỡ
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {saleProducts.length > 0 ? (
          saleProducts.map((p) => {
            if (!p.price?.currentPrice || !p.price?.discountPrice) return null;

            const discountPercentage = Math.round(
              ((p.price.currentPrice - p.price.discountPrice) /
                p.price.currentPrice) *
                100
            );

            const savedAmount = p.price.currentPrice - p.price.discountPrice;

            return (
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
                      <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">
                        GIẢM {discountPercentage}%
                      </Badge>

                      {/* Hot Deal Badge */}
                      {discountPercentage >= 30 && (
                        <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
                          🔥 HOT
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
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-red-600">
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
                        <p className="text-xs text-green-600 font-medium">
                          Tiết kiệm{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(savedAmount)}
                        </p>
                      </div>

                      {/* Action Button */}
                      <Button className="w-full bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">🏷️</div>
            <p className="text-xl text-gray-600 mb-2">
              Chưa có sản phẩm giảm giá
            </p>
            <p className="text-gray-500">Ưu đãi sẽ được cập nhật sớm nhất</p>
          </div>
        )}
      </div>
    </div>
  );
}
