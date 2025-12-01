"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Send, MessageSquare } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { createReview } from "@/features/reviews/reviewAction";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().min(1, "Vui lòng chọn đánh giá").max(5),
  comment: z
    .string()
    .min(1, "Vui lòng nhập đánh giá")
    .max(500, "Đánh giá quá dài"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewDialogProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewDialog({
  productId,
  onReviewSubmitted,
}: ReviewDialogProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");
  const comment = watch("comment");

  const onSubmit = async (data: ReviewFormData) => {
    if (!productId) {
      toast.error("Không tìm thấy sản phẩm");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createReview({
          productId,
          rating: data.rating,
          comment: data.comment,
        })
      ).unwrap();

      toast.success("Đánh giá đã được gửi thành công!");
      reset();
      setOpen(false);
      onReviewSubmitted?.();
    } catch (error: any) {
      const errorMessage = error?.message || "Gửi đánh giá thất bại";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setValue("rating", selectedRating, { shouldValidate: true });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      reset();
      setHoverRating(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Viết đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Viết đánh giá</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về sản phẩm này
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Rating Stars */}
              <div className="space-y-2">
                <Label>Đánh giá của bạn</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={isSubmitting}
                    >
                      <Star
                        className={`h-7 w-7 ${star <= (hoverRating || rating)
                          ? "fill-warning text-warning"
                          : "text-muted"
                          } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating > 0 ? `${rating} sao` : "Chọn số sao"}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-sm text-destructive">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">Nhận xét</Label>
                <Textarea
                  {...register("comment")}
                  id="comment"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  className="min-h-[100px] resize-none"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.comment?.message}</span>
                  <span>{comment.length}/500</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || rating === 0 || !comment.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi đánh giá
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
