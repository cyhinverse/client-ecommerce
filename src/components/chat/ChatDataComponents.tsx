import React from "react";
import { Star, MapPin, Package, TrendingUp, ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Review List Component
 */
export const ReviewList = ({ reviews }: { reviews: any }) => {
    if (!reviews?.data || reviews.data.length === 0) return null;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="space-y-3 mt-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700">
                    📝 {reviews.pagination?.total || 0} đánh giá
                </p>
            </div>

            <div className="space-y-2">
                {reviews.data.slice(0, 3).map((review: any) => (
                    <Card key={review._id} className="border-gray-200">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        {renderStars(review.rating)}
                                        <span className="text-xs text-gray-500 ml-1">
                                            {review.user?.name || "Khách hàng"}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

/**
 * Category Grid Component
 */
export const CategoryGrid = ({ categories, onCategoryClick }: {
    categories: any;
    onCategoryClick: (categoryName: string) => void;
}) => {
    if (!categories?.data || categories.data.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-2 mt-3">
            {categories.data.slice(0, 6).map((category: any) => (
                <motion.div
                    key={category._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Card
                        className="cursor-pointer hover:shadow-md transition-all border-gray-200"
                        onClick={() => onCategoryClick(category.name)}
                    >
                        <CardContent className="p-3">
                            <div className="text-2xl mb-1">📁</div>
                            <p className="text-xs font-medium text-gray-900 line-clamp-1">
                                {category.name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                                {category.productCount || 0} sản phẩm
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

/**
 * Address List Component
 */
export const AddressList = ({ addresses }: { addresses: any[] }) => {
    if (!addresses || addresses.length === 0) {
        return (
            <p className="text-xs text-gray-500 mt-2">Chưa có địa chỉ nào.</p>
        );
    }

    return (
        <div className="space-y-2 mt-3">
            {addresses.map((address: any) => (
                <Card key={address._id} className="border-gray-200">
                    <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900">
                                    {address.fullName} • {address.phone}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {address.address}, {address.ward}, {address.district},{" "}
                                    {address.city}
                                </p>
                                {address.isDefault && (
                                    <Badge variant="secondary" className="mt-1 text-[10px] h-5">
                                        Mặc định
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

/**
 * Product Comparison Table
 */
export const ComparisonTable = ({ products }: { products: any[] }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left p-2 font-medium text-gray-700">Sản phẩm</th>
                        <th className="text-right p-2 font-medium text-gray-700">Giá</th>
                        <th className="text-center p-2 font-medium text-gray-700">Đánh giá</th>
                        <th className="text-center p-2 font-medium text-gray-700">Tồn kho</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: any) => (
                        <tr key={product.id} className="border-b border-gray-100">
                            <td className="p-2">
                                <div className="flex items-center gap-2">
                                    {product.image && (
                                        <div className="relative w-10 h-10 flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded"
                                                sizes="40px"
                                            />
                                        </div>
                                    )}
                                    <p className="font-medium text-gray-900 line-clamp-2">
                                        {product.name}
                                    </p>
                                </div>
                            </td>
                            <td className="p-2 text-right">
                                {product.salePrice ? (
                                    <div>
                                        <p className="font-bold text-red-600">
                                            {product.salePrice.toLocaleString("vi-VN")}đ
                                        </p>
                                        <p className="text-gray-400 line-through text-[10px]">
                                            {product.price.toLocaleString("vi-VN")}đ
                                        </p>
                                    </div>
                                ) : (
                                    <p className="font-bold">
                                        {product.price.toLocaleString("vi-VN")}đ
                                    </p>
                                )}
                            </td>
                            <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{product.rating || 0}</span>
                                    <span className="text-gray-400">({product.reviewCount || 0})</span>
                                </div>
                            </td>
                            <td className="p-2 text-center">
                                <Badge variant={product.stock > 0 ? "default" : "destructive"} className="text-[10px]">
                                    {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/**
 * Stock Status Badge
 */
export const StockStatus = ({ stockData }: { stockData: any }) => {
    if (!stockData) return null;

    const { inStock, quantity, productName } = stockData;

    return (
        <Card className="border-gray-200 mt-3">
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inStock ? "bg-green-100" : "bg-red-100"
                        }`}>
                        {inStock ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900 mb-1">
                            {productName}
                        </p>
                        <div className="flex items-center gap-2">
                            <Badge variant={inStock ? "default" : "destructive"} className="text-[10px]">
                                {inStock ? "Còn hàng" : "Hết hàng"}
                            </Badge>
                            {inStock && (
                                <span className="text-xs text-gray-600">
                                    Còn {quantity} sản phẩm
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Order Confirmation
 */
export const OrderConfirmation = ({ order }: { order: any }) => {
    if (!order) return null;

    return (
        <Card className="border-green-200 bg-green-50 mt-3">
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-green-900 mb-1">
                            ✅ Đơn hàng đã được tạo!
                        </p>
                        <p className="text-xs text-green-700">
                            Mã đơn hàng: <span className="font-mono font-bold">#{order._id}</span>
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                            Tổng tiền: {order.totalAmount?.toLocaleString("vi-VN")}đ
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Shipping Fee Display
 */
export const ShippingFeeCard = ({ shippingData }: { shippingData: any }) => {
    if (!shippingData) return null;

    return (
        <Card className="border-blue-200 bg-blue-50 mt-3">
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-blue-900">
                            🚚 Phí vận chuyển đến {shippingData.city}
                        </p>
                        {shippingData.district && (
                            <p className="text-[10px] text-blue-700 mt-0.5">
                                {shippingData.district}
                            </p>
                        )}
                    </div>
                    <p className="text-sm font-bold text-blue-900">
                        {shippingData.shippingFee.toLocaleString("vi-VN")}đ
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Voucher Applied Card
 */
export const VoucherCard = ({ voucherData }: { voucherData: any }) => {
    if (!voucherData) return null;

    return (
        <Card className="border-purple-200 bg-purple-50 mt-3">
            <CardContent className="p-3">
                <p className="text-xs font-semibold text-purple-900 mb-2">
                    🎉 Đã áp dụng mã giảm giá
                </p>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-purple-700">Mã:</span>
                        <span className="font-mono font-bold text-purple-900">
                            {voucherData.voucherCode}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-purple-700">Giảm:</span>
                        <span className="font-bold text-purple-900">
                            {voucherData.discountAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-purple-200">
                        <span className="font-medium text-purple-900">Tổng cộng:</span>
                        <span className="font-bold text-purple-900">
                            {voucherData.finalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// ============== PERSUASIVE COMMERCE COMPONENTS ==============

/**
 * Purchase History Stats
 */
export const PurchaseHistoryCard = ({ historyData }: { historyData: any }) => {
    if (!historyData?.stats) return null;

    const { stats } = historyData;

    return (
        <Card className="border-indigo-200 bg-indigo-50 mt-3">
            <CardContent className="p-3">
                <p className="text-xs font-semibold text-indigo-900 mb-2">
                    📊 Thống kê mua hàng của bạn
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2">
                        <p className="text-indigo-700">Tổng đơn</p>
                        <p className="font-bold text-indigo-900">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                        <p className="text-indigo-700">Tổng chi</p>
                        <p className="font-bold text-indigo-900">
                            {stats.totalSpent?.toLocaleString("vi-VN")}đ
                        </p>
                    </div>
                    {stats.favoriteCategories && stats.favoriteCategories.length > 0 && (
                        <div className="bg-white rounded p-2 col-span-2">
                            <p className="text-indigo-700 mb-1">Yêu thích</p>
                            <div className="flex gap-1 flex-wrap">
                                {stats.favoriteCategories.map((cat: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-[10px]">
                                        {cat}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Personalized Recommendations
 */
export const PersonalizedRecommendations = ({
    data,
    onProductClick,
}: {
    data: any;
    onProductClick: (slug: string) => void;
}) => {
    if (!data?.products || data.products.length === 0) return null;

    return (
        <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-pink-600">💝 {data.reason}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
                {data.products.slice(0, 5).map((product: any) => (
                    <Card
                        key={product._id}
                        className="min-w-[140px] cursor-pointer hover:shadow-md transition-all border-pink-200"
                        onClick={() => onProductClick(product.slug)}
                    >
                        <CardContent className="p-2">
                            <div className="relative w-full h-24 bg-gray-50 rounded mb-2">
                                {product.images?.[0] && (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover rounded"
                                        sizes="140px"
                                    />
                                )}
                            </div>
                            <p className="text-xs font-medium line-clamp-2 h-8">
                                {product.name}
                            </p>
                            <p className="text-xs font-bold text-pink-600">
                                {(product.salePrice || product.price)?.toLocaleString("vi-VN")}đ
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

/**
 * Flash Deals with Countdown
 */
export const FlashDealsCard = ({
    dealsData,
    onProductClick,
}: {
    dealsData: any;
    onProductClick: (slug: string) => void;
}) => {
    if (!dealsData?.deals || dealsData.deals.length === 0) return null;

    return (
        <div className="mt-3">
            <Card className="border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
                <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-red-600">
                            🔥 FLASH SALE
                        </p>
                        <Badge variant="destructive" className="text-xs animate-pulse">
                            ⏰ {dealsData.timeRemaining}
                        </Badge>
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {dealsData.deals.map((deal: any) => (
                            <Card
                                key={deal._id}
                                className="min-w-[150px] cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => onProductClick(deal.slug)}
                            >
                                <CardContent className="p-2">
                                    <div className="relative w-full h-28 bg-white rounded mb-2">
                                        {deal.images?.[0] && (
                                            <Image
                                                src={deal.images[0]}
                                                alt={deal.name}
                                                fill
                                                className="object-cover rounded"
                                                sizes="150px"
                                            />
                                        )}
                                        <Badge
                                            variant="destructive"
                                            className="absolute top-1 right-1 text-[10px]"
                                        >
                                            -{deal.percentOff}%
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-medium line-clamp-2 mb-1">
                                        {deal.name}
                                    </p>
                                    <p className="text-sm font-bold text-red-600">
                                        {deal.salePrice?.toLocaleString("vi-VN")}đ
                                    </p>
                                    <p className="text-[10px] text-gray-400 line-through">
                                        {deal.price?.toLocaleString("vi-VN")}đ
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

/**
 * Low Stock Urgency Badge
 */
export const LowStockBadge = ({ stockData }: { stockData: any }) => {
    if (!stockData) return null;

    const { stock, isLowStock, urgencyLevel, productName } = stockData;

    if (!isLowStock && stock > 10) return null;

    const urgencyColors = {
        critical: "bg-red-100 border-red-300 text-red-900",
        warning: "bg-orange-100 border-orange-300 text-orange-900",
        normal: "bg-green-100 border-green-300 text-green-900",
    };

    return (
        <Card className={`mt-3 border-2 ${urgencyColors[urgencyLevel as keyof typeof urgencyColors]}`}>
            <CardContent className="p-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">
                        {stock <= 3 ? "🚨" : stock <= 10 ? "⚠️" : "✅"}
                    </span>
                    <div className="flex-1">
                        <p className="text-xs font-bold">
                            {stock <= 3
                                ? `CHỈ CÒN ${stock} SẢN PHẨM!`
                                : `Sắp hết - Còn ${stock} sản phẩm`}
                        </p>
                        <p className="text-[10px] opacity-80">{productName}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Limited Time Offers
 */
export const LimitedOffersCard = ({ offersData }: { offersData: any }) => {
    if (!offersData?.offers || offersData.offers.length === 0) return null;

    return (
        <div className="mt-3 space-y-2">
            {offersData.offers.map((offer: any, index: number) => (
                <Card key={index} className="border-amber-200 bg-amber-50">
                    <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs font-bold text-amber-900 mb-1">
                                    🎁 {offer.code}
                                </p>
                                <p className="text-[10px] text-amber-700">
                                    {offer.description}
                                </p>
                                <p className="text-[10px] text-amber-600 mt-1">
                                    ⏰ Còn {offer.hoursRemaining} giờ
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-amber-900">
                                    {offer.discountPercent
                                        ? `-${offer.discountPercent}%`
                                        : `-${offer.discountAmount?.toLocaleString("vi-VN")}đ`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

/**
 * Recent Purchases (Social Proof)
 */
export const RecentPurchasesNotif = ({ purchasesData }: { purchasesData: any }) => {
    if (!purchasesData?.purchases || purchasesData.purchases.length === 0) return null;

    return (
        <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-gray-700">👥 Người khác vừa mua</p>
            {purchasesData.purchases.slice(0, 3).map((purchase: any, index: number) => (
                <Card key={index} className="border-blue-200 bg-blue-50">
                    <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                                {purchase.userName?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-blue-900 truncate">
                                    {purchase.userName} • {purchase.location}
                                </p>
                                <p className="text-[10px] text-blue-700">
                                    {purchase.timeAgo}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

/**
 * Trending Products with Stats
 */
export const TrendingProducts = ({
    trendingData,
    onProductClick,
}: {
    trendingData: any;
    onProductClick: (slug: string) => void;
}) => {
    if (!trendingData?.products || trendingData.products.length === 0) return null;

    return (
        <div className="mt-3">
            <p className="text-xs font-semibold text-orange-600 mb-2">
                🔥 TRENDING HÔM NAY
            </p>
            <div className="space-y-2">
                {trendingData.products.slice(0, 3).map((product: any) => (
                    <Card
                        key={product._id}
                        className="cursor-pointer hover:shadow-md transition-all border-orange-200"
                        onClick={() => onProductClick(product.slug)}
                    >
                        <CardContent className="p-2">
                            <div className="flex gap-2">
                                <div className="relative w-16 h-16 bg-gray-50 rounded flex-shrink-0">
                                    {product.images?.[0] && (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded"
                                            sizes="64px"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium line-clamp-2 mb-1">
                                        {product.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                        <span>👁️ {product.viewCount?.toLocaleString("vi-VN")}</span>
                                        <span>🛒 {product.purchaseCount}</span>
                                    </div>
                                    <p className="text-xs font-bold text-orange-600 mt-1">
                                        {(product.salePrice || product.price)?.toLocaleString("vi-VN")}đ
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

/**
 * Personalized Discount Code
 */
export const PersonalizedDiscountCard = ({ discountData }: { discountData: any }) => {
    if (!discountData) return null;

    const triggerEmojis: Record<string, string> = {
        first_purchase: "🎉",
        cart_abandonment: "💝",
        vip: "👑",
        loyalty: "❤️",
    };

    return (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 mt-3">
            <CardContent className="p-3">
                <p className="text-xs font-bold text-emerald-900 mb-2">
                    {triggerEmojis[discountData.trigger] || "🎁"} ƯU ĐÃI ĐẶC BIỆT CHO BẠN!
                </p>
                <div className="bg-white rounded-lg p-3 mb-2 border-2 border-dashed border-emerald-300">
                    <p className="text-center font-mono text-lg font-bold text-emerald-700">
                        {discountData.discountCode}
                    </p>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-emerald-700">Giảm giá:</span>
                        <span className="font-bold text-emerald-900">
                            {discountData.discountAmount?.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-emerald-700">Hết hạn sau:</span>
                        <span className="font-bold text-red-600">
                            {discountData.expiryMinutes} phút
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Bundle Savings Calculator
 */
export const BundleSavingsCard = ({ bundleData }: { bundleData: any }) => {
    if (!bundleData) return null;

    return (
        <Card className="border-teal-200 bg-teal-50 mt-3">
            <CardContent className="p-3">
                <p className="text-xs font-bold text-teal-900 mb-2">
                    💰 TIẾT KIỆM KHI MUA COMBO
                </p>
                <div className="space-y-1 text-xs mb-2">
                    {bundleData.products?.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between">
                            <span className="text-teal-700 truncate flex-1">{p.name}</span>
                            <span className="font-medium ml-2">
                                {p.price?.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-teal-200 pt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-teal-700">Giá lẻ:</span>
                        <span className="line-through">
                            {bundleData.individualPrice?.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-teal-700">Giá combo (-{bundleData.savingsPercent}%):</span>
                        <span className="font-bold text-teal-900">
                            {bundleData.bundlePrice?.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    <div className="flex justify-between items-center bg-teal-100 rounded p-2">
                        <span className="text-xs font-bold text-teal-900">Tiết kiệm:</span>
                        <span className="text-sm font-bold text-teal-700">
                            {bundleData.savings?.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Abandoned Cart Reminder
 */
export const AbandonedCartCard = ({ cartData }: { cartData: any }) => {
    if (!cartData) return null;

    return (
        <Card className="border-yellow-300 bg-yellow-50 mt-3">
            <CardContent className="p-3">
                <div className="flex items-start gap-2">
                    <span className="text-2xl">🛒</span>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-yellow-900 mb-1">
                            BẠN CÒN {cartData.itemCount} SẢN PHẨM TRONG GIỎ!
                        </p>
                        <p className="text-[10px] text-yellow-700 mb-2">
                            Bỏ dở {cartData.timeSinceAbandoned}
                        </p>
                        <div className="bg-white rounded p-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-yellow-700">Tổng giá trị:</span>
                                <span className="text-sm font-bold text-yellow-900">
                                    {cartData.totalValue?.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

/**
 * Cart Recovery Incentive
 */
export const CartRecoveryIncentive = ({ incentiveData }: { incentiveData: any }) => {
    if (!incentiveData?.incentive) return null;

    const { incentive } = incentiveData;

    const incentiveColors: Record<string, string> = {
        free_shipping: "from-blue-50 to-cyan-50 border-blue-200",
        discount: "from-purple-50 to-pink-50 border-purple-200",
        gift: "from-rose-50 to-orange-50 border-rose-200",
    };

    return (
        <Card className={`bg-gradient-to-br ${incentiveColors[incentive.type] || "from-gray-50 to-gray-100"} mt-3`}>
            <CardContent className="p-3">
                <p className="text-xs font-bold mb-2">
                    {incentive.message}
                </p>
                {incentive.code && (
                    <div className="bg-white rounded p-2 mb-2 border-2 border-dashed">
                        <p className="text-center font-mono font-bold text-sm">
                            {incentive.code}
                        </p>
                    </div>
                )}
                {incentive.giftName && (
                    <p className="text-xs text-center">
                        🎁 {incentive.giftName}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * Upgrade Suggestions
 */
export const UpgradeSuggestions = ({
    upgradeData,
    onProductClick,
}: {
    upgradeData: any;
    onProductClick: (slug: string) => void;
}) => {
    if (!upgradeData?.upgrades || upgradeData.upgrades.length === 0) return null;

    return (
        <div className="mt-3">
            <p className="text-xs font-semibold text-indigo-600 mb-2">
                📱 PHIÊN BẢN CAO CẤP HƠN
            </p>
            {upgradeData.upgrades.map((upgrade: any, index: number) => (
                <Card
                    key={index}
                    className="mb-2 cursor-pointer hover:shadow-md transition-all border-indigo-200"
                    onClick={() => onProductClick(upgrade.product.slug)}
                >
                    <CardContent className="p-3">
                        <div className="flex gap-2">
                            <div className="relative w-16 h-16 bg-gray-50 rounded">
                                {upgrade.product.images?.[0] && (
                                    <Image
                                        src={upgrade.product.images[0]}
                                        alt={upgrade.product.name}
                                        fill
                                        className="object-cover rounded"
                                        sizes="64px"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium mb-1">
                                    {upgrade.product.name}
                                </p>
                                <p className="text-[10px] text-gray-600 mb-1">
                                    {upgrade.benefits?.slice(0, 2).join(" • ")}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-indigo-600">
                                        +{upgrade.priceDiff?.toLocaleString("vi-VN")}đ
                                    </p>
                                    {upgrade.worthIt && (
                                        <Badge variant="secondary" className="text-[10px]">
                                            Đáng giá!
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

/**
 * Frequently Bought Together
 */
export const FrequentlyBoughtTogether = ({
    fbtData,
    onProductClick,
}: {
    fbtData: any;
    onProductClick: (slug: string) => void;
}) => {
    if (!fbtData?.suggestions || fbtData.suggestions.length === 0) return null;

    return (
        <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-cyan-700">
                    🎒 Thường mua cùng
                </p>
                <Badge variant="outline" className="text-[10px] border-cyan-300">
                    Giảm {fbtData.bundleDiscount}%
                </Badge>
            </div>
            <div className="flex gap-2 overflow-x-auto">
                {fbtData.suggestions.map((product: any) => (
                    <Card
                        key={product._id}
                        className="min-w-[130px] cursor-pointer hover:shadow-md transition-all border-cyan-200"
                        onClick={() => onProductClick(product.slug)}
                    >
                        <CardContent className="p-2">
                            <div className="relative w-full h-20 bg-gray-50 rounded mb-2">
                                {product.images?.[0] && (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover rounded"
                                        sizes="130px"
                                    />
                                )}
                            </div>
                            <p className="text-xs font-medium line-clamp-2 mb-1">
                                {product.name}
                            </p>
                            <Badge variant="secondary" className="text-[9px] mb-1">
                                {product.buyTogetherPercent}% mua cùng
                            </Badge>
                            <p className="text-xs font-bold text-cyan-700">
                                {(product.salePrice || product.price)?.toLocaleString("vi-VN")}đ
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
