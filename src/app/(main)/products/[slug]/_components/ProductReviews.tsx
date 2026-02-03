"use client";

import { useState, useMemo } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewItem from "@/components/review/ReviewItem";
import { useProductReviews } from "@/hooks/queries/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { Review, RatingBreakdown } from "@/types/review";

interface ProductReviewsProps {
  productId: string;
  ratingAverage?: number;
  reviewCount?: number;
}

// Rating Breakdown Component
function RatingBreakdownComponent({
  breakdown,
  total,
}: {
  breakdown: RatingBreakdown;
  total: number;
}) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = breakdown[rating as keyof RatingBreakdown] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={rating} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-gray-600">{rating}</span>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-gray-400 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ProductReviews({
  productId,
  ratingAverage = 0,
  reviewCount = 0,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProductReviews(productId, { page, limit: 5 });

  const reviews = useMemo(() => {
    if (!data?.reviews) return [];
    return data.reviews.map((review) => ({
      ...review,
      user: {
        ...review.user,
        name: review.user.username,
      },
    }));
  }, [data?.reviews]);

  const totalPages = data?.pagination?.totalPages || 1;
  const ratingBreakdown: RatingBreakdown = useMemo(() => {
    // Compute rating breakdown from reviews
    const breakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        breakdown[r.rating as keyof RatingBreakdown] = (breakdown[r.rating as keyof RatingBreakdown] || 0) + 1;
      }
    });
    return breakdown;
  }, [reviews]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const maskName = (name: string) => {
    if (!name || name.length <= 2) return name || "User";
    return `${name.charAt(0)}***${name.charAt(name.length - 1)}`;
  };

  return (
    <section id="section-reviews" className="py-8">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
        Đánh giá từ người mua
        <span className="text-sm font-normal text-gray-400">
          ({reviewCount})
        </span>
      </h2>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center md:w-1/3 py-4">
          <div className="text-4xl font-bold text-[#E53935]">
            {ratingAverage.toFixed(1)}
          </div>
          <div className="flex items-center gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(ratingAverage)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {reviewCount} đánh giá
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1">
          <RatingBreakdownComponent breakdown={ratingBreakdown} total={reviewCount} />
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
          <p className="text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              initial={getInitial(review.user?.name)}
              name={maskName(review.user?.name)}
              rating={review.rating}
              date={formatDate(review.createdAt)}
              verified={(review as Review).verified}
              comment={review.comment}
            />
          ))}
        </div>
      )}

      {/* Load More / Pagination */}
      {totalPages > 1 && (
        <div className="text-center pt-6">
          {page < totalPages ? (
            <Button
              variant="ghost"
              onClick={() => setPage((p) => p + 1)}
              className="text-xs text-gray-400 hover:text-[#E53935]"
            >
              Xem thêm đánh giá <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          ) : (
            <span className="text-xs text-gray-400">
              Đã hiển thị tất cả đánh giá
            </span>
          )}
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
