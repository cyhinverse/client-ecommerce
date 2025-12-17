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
import { Star, MessageSquare } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { createReview } from "@/features/reviews/reviewAction";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(1, "Please enter your review")
    .max(500, "Review is too long"),
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
      toast.error("Product not found");
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

      toast.success("Review submitted successfully!");
      reset();
      setOpen(false);
      onReviewSubmitted?.();
    } catch (error: unknown) {
      const err = error as { message?: string };
      const errorMessage = err?.message || "Failed to submit review";
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
        <Button variant="outline" className="flex items-center gap-2 rounded-full">
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold tracking-tight">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this product
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Rating Stars */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={isSubmitting}
                >
                    <Star
                    className={cn(
                        "h-8 w-8 transition-colors duration-200",
                        star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/20 fill-muted-foreground/5"
                    )}
                    />
                </button>
                ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground h-5">
                {rating > 0 ? (
                    rating === 5 ? "Excellent!" :
                    rating === 4 ? "Good" :
                    rating === 3 ? "Average" :
                    rating === 2 ? "Poor" : "Terrible"
                ) : "Select a rating"}
            </span>
            {errors.rating && (
                <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1">
                {errors.rating.message}
                </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="sr-only">Comment</Label>
            <Textarea
                {...register("comment")}
                id="comment"
                placeholder="What did you like or dislike? What did you use this product for?"
                className="min-h-[120px] resize-none border-border/50 bg-muted/30 focus:bg-background transition-colors"
                disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span className="text-destructive font-medium">{errors.comment?.message}</span>
                <span>{comment.length}/500</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
