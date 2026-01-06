import { Notification } from "@/types/notification";
import { Bell, ShoppingBag, Tag, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const timeAgo = (dateRequest: string) => {
      const date = new Date(dateRequest);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      let interval = seconds / 31536000;
       
      if (interval > 1) return Math.floor(interval) + " năm trước";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " tháng trước";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " ngày trước";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " giờ trước";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " phút trước";
      return "Vừa xong";
  }

  const getIcon = () => {
    switch (notification.type) {
      case "order": 
        return <ShoppingBag className="h-4 w-4 text-white" />;
      case "promotion": 
        return <Tag className="h-4 w-4 text-white" />;
      case "system": 
        return <Info className="h-4 w-4 text-white" />;
      case "order_status": 
        return <CheckCircle className="h-4 w-4 text-white" />;
      default: 
        return <Bell className="h-4 w-4 text-white" />;
    }
  };

  const getIconBg = () => {
    switch (notification.type) {
      case "order": return "bg-blue-500";
      case "promotion": return "bg-green-500";
      case "system": return "bg-orange-500";
      case "order_status": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const Content = (
    <div className={cn(
        "relative flex gap-3 p-4 transition-all duration-200 hover:bg-black/5",
        !notification.isRead && "bg-blue-50/50"
    )}>
      {/* Icon Wrapper */}
      <div className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full mt-1",
          getIconBg()
      )}>
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
             <p className="text-sm font-semibold text-foreground/90 line-clamp-1">
               {notification.title}
             </p>
             {!notification.isRead && (
                 <span className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white shrink-0" />
             )}
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-1.5">
              {notification.message}
          </p>
          
          <p className="text-[10px] font-medium text-muted-foreground/70">
              {timeAgo(notification.createdAt)}
          </p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
        <Link href={notification.link} onClick={onClick} className="block w-full focus:outline-none">
            {Content}
        </Link>
    );
  }

  return (
    <div onClick={onClick} className="w-full cursor-pointer focus:outline-none">
        {Content}
    </div>
  );
}