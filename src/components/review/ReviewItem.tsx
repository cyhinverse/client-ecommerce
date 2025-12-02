import { Star } from "lucide-react";
import { Badge } from "../ui/badge";

// Review Item Component
export default function ReviewItem({
  initial,
  name,
  rating,
  date,
  verified,
  comment,
}: {
  initial: string;
  name: string;
  rating: number;
  date: string;
  verified?: boolean;
  comment: string;
}) {
  return (
    <div className="border-b pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-muted-foreground">
            {initial}
          </span>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{name}</h4>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rating
                        ? "fill-warning text-warning"
                        : "text-muted"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
            </div>
            {verified && (
              <Badge variant="outline" className="text-xs bg-success/10">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-foreground text-sm leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
}