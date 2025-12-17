"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getRelatedProducts } from "@/features/product/productAction";
import { ProductCard } from "./ProductCard"; 
import SpinnerLoading from "../common/SpinnerLoading";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const dispatch = useAppDispatch();
  const { related } = useAppSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!productId) return;
      setIsLoading(true);
      try {
        await dispatch(getRelatedProducts({ productId }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [dispatch, productId]);

  if (!isLoading && (!related || related.length === 0)) {
    return null; // Don't show section if empty
  }

  return (
    <div className="space-y-8 mt-16 pt-8 border-t border-border/50">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
      </div>

      <div className="relative min-h-[200px]">
         {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
         
         <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {related.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
             </div>
         </div>
      </div>
    </div>
  );
}
