"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getProductBySlug } from "@/features/product/productAction";
import { addToCart } from "@/features/cart/cartAction";
import { Product, Variant, Shop, Price } from "@/types/product";

export interface UseProductDetailOptions {
  slug: string;
}

export interface UseProductDetailReturn {
  // Data
  product: Product | null;
  selectedVariant: Variant | null;
  selectedVariantIndex: number;
  selectedSize: string | null;
  quantity: number;
  selectedImageIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  displayImages: string[];
  activePrice: Price | null;
  shop: Shop | null;
  hasVariants: boolean;
  hasSizes: boolean;
  maxStock: number;
  availableSizes: string[];
  
  // Actions
  setSelectedVariantIndex: (index: number) => void;
  setSelectedSize: (size: string | null) => void;
  setQuantity: (qty: number) => void;
  setSelectedImageIndex: (index: number) => void;
  handleQuantityChange: (change: number) => void;
  handleVariantSelect: (index: number) => void;
  handleSizeSelect: (size: string) => void;
  handleAddToCart: () => Promise<boolean>;
  handleBuyNow: () => Promise<void>;
}

export function useProductDetail({ slug }: UseProductDetailOptions): UseProductDetailReturn {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.product
  );
  
  // Local state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }
  }, [dispatch, slug]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Auto-select first size when product loads
  useEffect(() => {
    if (currentProduct?.sizes?.length && !selectedSize) {
      setSelectedSize(currentProduct.sizes[0]);
    }
  }, [currentProduct, selectedSize]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!currentProduct?.variants?.length) return null;
    return currentProduct.variants[selectedVariantIndex] || currentProduct.variants[0];
  }, [currentProduct, selectedVariantIndex]);

  // Check if product has variants
  const hasVariants = useMemo(() => {
    return Boolean(currentProduct?.variants && currentProduct.variants.length > 0);
  }, [currentProduct]);

  // Check if product has sizes
  const hasSizes = useMemo(() => {
    return Boolean(currentProduct?.sizes && currentProduct.sizes.length > 0);
  }, [currentProduct]);

  // Get available sizes
  const availableSizes = useMemo(() => {
    return currentProduct?.sizes || [];
  }, [currentProduct]);

  // Get active price based on selection
  const activePrice = useMemo((): Price | null => {
    if (selectedVariant) {
      return { 
        currentPrice: selectedVariant.price, 
        discountPrice: null,
        currency: 'VND'
      };
    }
    return currentProduct?.price || null;
  }, [selectedVariant, currentProduct]);

  // Get shop info
  const shop = useMemo((): Shop | null => {
    if (!currentProduct?.shop) return null;
    if (typeof currentProduct.shop === 'string') {
      return { _id: currentProduct.shop, name: 'Shop' };
    }
    return currentProduct.shop;
  }, [currentProduct]);

  // Get display images - always from selected variant (no fallback to product.images)
  const displayImages = useMemo(() => {
    if (!currentProduct) return [];
    // Always use selected variant images
    if (selectedVariant?.images?.length && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    // Fallback to first variant images if selected variant has no images
    if (currentProduct.variants?.[0]?.images?.length) {
      return currentProduct.variants[0].images;
    }
    return [];
  }, [currentProduct, selectedVariant]);

  // Get max stock for quantity validation
  const maxStock = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return currentProduct?.stock || 99;
  }, [selectedVariant, currentProduct]);

  // Handle quantity change
  const handleQuantityChange = useCallback((change: number) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity >= 1 && newQuantity <= Math.min(maxStock, 99)) {
        return newQuantity;
      }
      return prev;
    });
  }, [maxStock]);

  // Handle variant selection
  const handleVariantSelect = useCallback((index: number) => {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0); // Reset image when variant changes
    setQuantity(1); // Reset quantity when variant changes
  }, []);

  // Handle size selection
  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
    setQuantity(1); // Reset quantity when size changes
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(async (): Promise<boolean> => {
    if (!currentProduct || isAddingToCart) return false;
    
    // Validate variant selection if product has variants
    if (currentProduct.variants?.length && !selectedVariant) {
      toast.error("Vui lòng chọn màu sắc");
      return false;
    }
    
    // Validate variant stock
    if (selectedVariant && selectedVariant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return false;
    }
    
    // Validate quantity against stock
    if (selectedVariant && quantity > selectedVariant.stock) {
      toast.error(`Chỉ còn ${selectedVariant.stock} sản phẩm`);
      return false;
    }
    
    // Validate size selection if product has sizes
    if (currentProduct.sizes?.length && !selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return false;
    }
    
    setIsAddingToCart(true);
    try {
      const result = await dispatch(
        addToCart({
          productId: currentProduct._id,
          shopId: shop?._id || '',
          quantity,
          modelId: selectedVariant?._id ?? undefined,  // Use modelId instead of variantId
          size: selectedSize ?? undefined,
        })
      );
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Đã thêm vào giỏ hàng");
        return true;
      } else {
        toast.error("Không thể thêm vào giỏ hàng");
        return false;
      }
    } catch {
      toast.error("Có lỗi xảy ra");
      return false;
    } finally {
      setIsAddingToCart(false);
    }
  }, [currentProduct, dispatch, quantity, selectedVariant, selectedSize, shop, isAddingToCart]);

  // Handle buy now
  const handleBuyNow = useCallback(async () => {
    const success = await handleAddToCart();
    if (success) {
      router.push('/checkout');
    }
  }, [handleAddToCart, router]);

  return {
    // Data
    product: currentProduct,
    selectedVariant,
    selectedVariantIndex,
    selectedSize,
    quantity,
    selectedImageIndex,
    isLoading,
    error,
    
    // Computed
    displayImages,
    activePrice,
    shop,
    hasVariants,
    hasSizes,
    maxStock,
    availableSizes,
    
    // Actions
    setSelectedVariantIndex,
    setSelectedSize,
    setQuantity,
    setSelectedImageIndex,
    handleQuantityChange,
    handleVariantSelect,
    handleSizeSelect,
    handleAddToCart,
    handleBuyNow,
  };
}

export default useProductDetail;
