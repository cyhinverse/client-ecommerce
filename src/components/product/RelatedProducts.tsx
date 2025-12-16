"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getRelatedProducts } from "@/features/product/productAction";
import { ProductCard } from "./ProductCard";
import SpinnerLoading from "../common/SpinnerLoading";

interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const dispatch = useAppDispatch();
  const { related } = useAppSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      await dispatch(
        getRelatedProducts({ productId })
      );
      setIsLoading(false);
    };

    if (productId) {
      fetchRelated();
    }
  }, [dispatch, productId]);

  return (
    <div className="space-y-6 mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Related Products</h2>
      </div>

      {isLoading ? <SpinnerLoading/> : related && related.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {related.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No related products found.</p>
        </div>
      )}
    </div>
  );
}
