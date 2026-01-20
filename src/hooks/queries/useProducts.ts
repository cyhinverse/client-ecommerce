/**
 * Product React Query Hooks
 * Replaces productAction.ts async thunks with React Query
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import instance from "@/api/api";
import { extractApiData } from "@/api";
import { errorHandler } from "@/services/errorHandler";
import { STALE_TIME } from "@/constants/cache";
import { productKeys } from "@/lib/queryKeys";
import { Product, Variant, Price } from "@/types/product";
import { Shop } from "@/types/shop";
import { useAddToCart } from "./useCart";

export interface ProductListParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  isActive?: boolean;
  rating?: string;
  colors?: string;
  sizes?: string;
  shop?: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Server response structure (may differ from client interface)
interface ServerProductListResponse {
  data?: Product[];
  products?: Product[];
  pagination: {
    currentPage?: number;
    page?: number;
    pageSize?: number;
    limit?: number;
    totalItems?: number;
    total?: number;
    totalPages: number;
  };
}

const productApi = {
  getAll: async (params: ProductListParams): Promise<ProductListResponse> => {
    const queryParams: Record<string, string | number | boolean> = {};

    // Only add params that have values
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.sort) queryParams.sort = params.sort;
    if (params.category) queryParams.category = params.category;
    if (params.brand) queryParams.brand = params.brand;
    if (params.minPrice) queryParams.minPrice = params.minPrice;
    if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params.tags?.length) queryParams.tags = params.tags.join(",");
    if (params.search) queryParams.search = params.search;
    if (params.isActive !== undefined) queryParams.isActive = params.isActive;
    if (params.rating) queryParams.rating = params.rating;
    if (params.colors) queryParams.colors = params.colors;
    if (params.sizes) queryParams.sizes = params.sizes;
    if (params.shop) queryParams.shop = params.shop;

    const response = await instance.get("/products", { params: queryParams });
    const serverData = extractApiData<ServerProductListResponse>(response);

    // Normalize server response to client interface
    // Server returns { data: [...], pagination: {...} } but client expects { products: [...], pagination: {...} }
    return {
      products: serverData.data || serverData.products || [],
      pagination: {
        page:
          serverData.pagination.currentPage || serverData.pagination.page || 1,
        limit:
          serverData.pagination.pageSize || serverData.pagination.limit || 10,
        total:
          serverData.pagination.totalItems || serverData.pagination.total || 0,
        totalPages: serverData.pagination.totalPages || 1,
      },
    };
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await instance.get(`/products/slug/${slug}`);
    return extractApiData(response);
  },

  getById: async (productId: string): Promise<Product> => {
    const response = await instance.get(`/products/${productId}`);
    return extractApiData(response);
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await instance.get("/products/featured");
    return extractApiData(response);
  },

  getNewArrivals: async (): Promise<Product[]> => {
    const response = await instance.get("/products/new-arrivals");
    return extractApiData(response);
  },

  getOnSale: async (): Promise<Product[]> => {
    const response = await instance.get("/products/on-sale");
    return extractApiData(response);
  },

  getByCategory: async (categorySlug: string): Promise<Product[]> => {
    const response = await instance.get(`/products/category/${categorySlug}`);
    const result = extractApiData<{ data: Product[] }>(response);
    return result.data || [];
  },

  getRelated: async (productId: string): Promise<Product[]> => {
    const response = await instance.get(`/products/related/${productId}`);
    return extractApiData(response);
  },

  search: async (params: {
    keyword: string;
    limit?: number;
  }): Promise<Product[]> => {
    const response = await instance.get("/products/search", {
      params: { q: params.keyword, limit: params.limit || 10 },
    });
    return extractApiData(response);
  },

  // Mutations
  create: async (formData: FormData): Promise<Product> => {
    const response = await instance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(response);
  },

  update: async ({
    productId,
    formData,
  }: {
    productId: string;
    formData: FormData;
  }): Promise<Product> => {
    const response = await instance.put(`/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(response);
  },

  delete: async (productId: string): Promise<void> => {
    await instance.delete(`/products/${productId}/permanent`);
  },

  // Seller mutations
  updateSeller: async ({
    productId,
    formData,
  }: {
    productId: string;
    formData: FormData;
  }): Promise<Product> => {
    const response = await instance.put(
      `/products/seller/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return extractApiData(response);
  },

  deleteSeller: async (productId: string): Promise<void> => {
    await instance.delete(`/products/seller/${productId}`);
  },

  // Model mutations
  updateModel: async (params: {
    productId: string;
    modelId: string;
    updateData: { price?: number; stock?: number; sku?: string };
  }): Promise<Product> => {
    const { productId, modelId, updateData } = params;
    const response = await instance.put(
      `/products/${productId}/models/${modelId}`,
      updateData,
    );
    return extractApiData(response);
  },

  deleteModel: async (params: {
    productId: string;
    modelId: string;
  }): Promise<void> => {
    await instance.delete(
      `/products/${params.productId}/models/${params.modelId}`,
    );
  },
};

/**
 * Get all products with filters and pagination
 */
export function useProducts(
  params: ProductListParams = { page: 1, limit: 20 },
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getAll(params),
    staleTime: STALE_TIME.LONG,
  });
}

/**
 * Get product by slug (for product detail page)
 */
export function useProduct(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productApi.getBySlug(slug),
    enabled: options?.enabled ?? !!slug,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get product by ID
 */
export function useProductById(
  productId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: productKeys.detailById(productId),
    queryFn: () => productApi.getById(productId),
    enabled: options?.enabled ?? !!productId,
  });
}

/**
 * Get featured products
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: productApi.getFeatured,
    staleTime: STALE_TIME.STATIC,
  });
}

/**
 * Get new arrivals
 */
export function useNewArrivals() {
  return useQuery({
    queryKey: productKeys.newArrivals(),
    queryFn: productApi.getNewArrivals,
    staleTime: STALE_TIME.STATIC,
  });
}

/**
 * Get on sale products
 */
export function useOnSaleProducts() {
  return useQuery({
    queryKey: productKeys.onSale(),
    queryFn: productApi.getOnSale,
    staleTime: STALE_TIME.VERY_LONG,
  });
}

/**
 * Get products by category
 */
export function useProductsByCategory(
  categorySlug: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: productKeys.byCategory(categorySlug),
    queryFn: () => productApi.getByCategory(categorySlug),
    enabled: options?.enabled ?? !!categorySlug,
  });
}

/**
 * Get related products
 */
export function useRelatedProducts(
  productId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () => productApi.getRelated(productId),
    enabled: options?.enabled ?? !!productId,
    staleTime: STALE_TIME.STATIC,
  });
}

/**
 * Get shop products
 */
export function useShopProducts(
  shopId: string,
  params?: Omit<ProductListParams, "shop">,
) {
  return useQuery({
    queryKey: productKeys.shopProducts(shopId, params),
    queryFn: () => productApi.getAll({ ...params, shop: shopId }),
    enabled: !!shopId,
  });
}

/**
 * Search products
 */
export function useProductSearch(keyword: string, limit?: number) {
  return useQuery({
    queryKey: productKeys.search(keyword, limit),
    queryFn: () => productApi.search({ keyword, limit }),
    enabled: keyword.length >= 2,
    staleTime: STALE_TIME.MEDIUM,
  });
}

/**
 * Create product mutation
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      // Invalidate product lists to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Create product failed" });
    },
  });
}

/**
 * Update product mutation
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.update,
    onSuccess: (data, variables) => {
      // Invalidate specific product and lists
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      // Update cache directly if we have slug
      if (data.slug) {
        queryClient.setQueryData(productKeys.detail(data.slug), data);
      }
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Update product failed" });
    },
  });
}

/**
 * Delete product mutation
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Delete product failed" });
    },
  });
}

/**
 * Seller update product mutation
 */
export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.updateSeller,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      if (data.slug) {
        queryClient.setQueryData(productKeys.detail(data.slug), data);
      }
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Seller update product failed" });
    },
  });
}

/**
 * Seller delete product mutation
 */
export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Seller delete product failed" });
    },
  });
}

/**
 * Update product model mutation
 */
export function useUpdateProductModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.updateModel,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(variables.productId),
      });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Update model failed" });
    },
  });
}

/**
 * Delete product model mutation
 */
export function useDeleteProductModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteModel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detailById(variables.productId),
      });
    },
    onError: (error) => {
      errorHandler.log(error, { context: "Delete model failed" });
    },
  });
}

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

/**
 * Composite hook for product detail page
 * Handles product data fetching, variant selection, and cart operations
 */
export function useProductDetail({
  slug,
}: UseProductDetailOptions): UseProductDetailReturn {
  const router = useRouter();

  // Use React Query for product data
  const {
    data: currentProduct,
    isLoading,
    error: queryError,
  } = useProduct(slug);
  const addToCartMutation = useAddToCart();

  // Convert error to string
  const error = queryError ? (queryError as Error).message : null;

  // Local state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeInternal, setSelectedSizeInternal] = useState<
    string | null
  >(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Derived selected size: use internal state or default to first available size
  const selectedSize = useMemo(() => {
    return selectedSizeInternal || currentProduct?.sizes?.[0] || null;
  }, [selectedSizeInternal, currentProduct]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!currentProduct?.variants?.length) return null;
    return (
      currentProduct.variants[selectedVariantIndex] ||
      currentProduct.variants[0]
    );
  }, [currentProduct, selectedVariantIndex]);

  // Check if product has variants
  const hasVariants = useMemo(() => {
    return Boolean(
      currentProduct?.variants && currentProduct.variants.length > 0,
    );
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
        currency: "VND",
      };
    }
    return currentProduct?.price || null;
  }, [selectedVariant, currentProduct]);

  // Get shop info
  const shop = useMemo((): Shop | null => {
    if (!currentProduct?.shop) return null;
    if (typeof currentProduct.shop === "string") {
      return { _id: currentProduct.shop, name: "Shop" } as Shop;
    }
    return currentProduct.shop;
  }, [currentProduct]);

  // Get display images - always from selected variant
  const displayImages = useMemo(() => {
    if (!currentProduct) return [];
    if (selectedVariant?.images?.length && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
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
  const handleQuantityChange = useCallback(
    (change: number) => {
      setQuantity((prev) => {
        const newQuantity = prev + change;
        if (newQuantity >= 1 && newQuantity <= Math.min(maxStock, 99)) {
          return newQuantity;
        }
        return prev;
      });
    },
    [maxStock],
  );

  // Handle variant selection
  const handleVariantSelect = useCallback((index: number) => {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0);
    setQuantity(1);
  }, []);

  // Handle size selection
  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSizeInternal(size);
    setQuantity(1);
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(async (): Promise<boolean> => {
    if (!currentProduct || addToCartMutation.isPending) return false;

    if (currentProduct.variants?.length && !selectedVariant) {
      toast.error("Vui lòng chọn màu sắc");
      return false;
    }

    if (selectedVariant && selectedVariant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return false;
    }

    if (selectedVariant && quantity > selectedVariant.stock) {
      toast.error(`Chỉ còn ${selectedVariant.stock} sản phẩm`);
      return false;
    }

    if (currentProduct.sizes?.length && !selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return false;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: currentProduct._id,
        shopId: shop?._id || "",
        quantity,
        modelId: selectedVariant?._id ?? undefined,
        size: selectedSize ?? undefined,
      });

      toast.success("Đã thêm vào giỏ hàng");
      return true;
    } catch {
      toast.error("Không thể thêm vào giỏ hàng");
      return false;
    }
  }, [
    currentProduct,
    addToCartMutation,
    quantity,
    selectedVariant,
    selectedSize,
    shop,
  ]);

  // Handle buy now
  const handleBuyNow = useCallback(async () => {
    const success = await handleAddToCart();
    if (success) {
      router.push("/checkout");
    }
  }, [handleAddToCart, router]);

  return {
    product: currentProduct ?? null,
    selectedVariant,
    selectedVariantIndex,
    selectedSize,
    quantity,
    selectedImageIndex,
    isLoading,
    error,
    displayImages,
    activePrice,
    shop,
    hasVariants,
    hasSizes,
    maxStock,
    availableSizes,
    setSelectedVariantIndex,
    setSelectedSize: setSelectedSizeInternal,
    setQuantity,
    setSelectedImageIndex,
    handleQuantityChange,
    handleVariantSelect,
    handleSizeSelect,
    handleAddToCart,
    handleBuyNow,
  };
}
