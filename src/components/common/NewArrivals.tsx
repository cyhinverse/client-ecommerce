// NewArrivals.jsx
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Card, CardContent } from "../ui/card";
import SpinnerLoading from "./SpinerLoading";
import { toast } from "sonner";
import { useEffect } from "react";
import { getNewArrivals } from "@/features/product/productAction";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const { isLoading, product, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getNewArrivals());
  }, [dispatch]);

  if (isLoading) return <SpinnerLoading />;
  if (error) toast.error(error);

  const newArrivalProducts = product?.filter((p) => p.isNewArrival) || [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Sản Phẩm Mới
        </h2>
        <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
          Khám phá những thiết kế mới nhất và xu hướng mới từ thương hiệu
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {newArrivalProducts.length > 0 ? (
          newArrivalProducts.map((p) => (
            <Card
              key={p._id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl shadow-sm"
            >
              <Link href={`/${p.slug}`}>
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-xl">
                    {p.images && p.images.length > 0 ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    <Badge className="absolute top-3 left-3 bg-black hover:bg-gray-800 text-white border-0 text-xs px-2 py-1 shadow-md">
                      MỚI
                    </Badge>

                    {p.price?.discountPrice && p.price.discountPrice < p.price.currentPrice && (
                      <Badge className="absolute top-3 right-3 bg-black hover:bg-gray-800 text-white border-0 text-xs px-2 py-1 shadow-md">
                        -{Math.round(((p.price.currentPrice - p.price.discountPrice) / p.price.currentPrice) * 100)}%
                      </Badge>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{p.brand}</p>
                    </div>

                    <div className="space-y-1">
                      {p.price?.discountPrice && p.price.discountPrice < p.price.currentPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-semibold text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(p.price.discountPrice)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(p.price.currentPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base font-semibold text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(p.price?.currentPrice || 0)}
                        </span>
                      )}
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-black hover:bg-gray-800 text-white border-0 text-xs transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-md"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm mới</p>
            <p className="text-sm text-gray-600">Sản phẩm mới sẽ được cập nhật sớm nhất</p>
          </div>
        )}
      </div>
    </div>
  );
}