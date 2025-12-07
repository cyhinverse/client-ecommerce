import React from "react";

interface IconBadgeProps {
  count: number;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
  className?: string;
}

export default function IconBadge({
  count,
  icon,
  onClick,
  variant = "default",
  className = "",
}: IconBadgeProps) {
  const badgeColor =
    variant === "destructive"
      ? "bg-red-500 text-white"
      : "bg-primary text-primary-foreground";

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${className}`}
    >
      {icon}
      {count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 ${badgeColor} text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}
