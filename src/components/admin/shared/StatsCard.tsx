import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  description?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  className,
}) => {
  return (
    <div className={`rounded-[2rem] border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md ${className || ""}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">{title}</p>
        <div className="rounded-full bg-gray-100/80 p-2 text-foreground dark:bg-white/10">
             <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
        {change && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                changeType === "positive"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              vs last month
            </span>
          </div>
        )}
        {description && !change && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
