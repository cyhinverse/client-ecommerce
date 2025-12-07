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
       
      if (interval > 1) {
          return Math.floor(interval) + " năm trước";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
          return Math.floor(interval) + " tháng trước";
      }
      interval = seconds / 86400;
      if (interval > 1) {
          return Math.floor(interval) + " ngày trước";
      }
      interval = seconds / 3600;
      if (interval > 1) {
          return Math.floor(interval) + " giờ trước";
      }
      interval = seconds / 60;
      if (interval > 1) {
          return Math.floor(interval) + " phút trước";
      }
      return "Vừa xong";
  }

  const getIcon = () => {
    switch (notification.type) {
      case "order": 
        return <ShoppingBag className="h-4 w-4 text-blue-600" />;
      case "promotion": 
        return <Tag className="h-4 w-4 text-green-600" />;
      case "system": 
        return <Info className="h-4 w-4 text-orange-600" />;
      case "order_status": 
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      default: 
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const Content = (
    <div className={cn(
        "relative flex gap-4 p-4 transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-0",
        !notification.isRead ? "bg-blue-50/40" : "bg-white"
    )}>
      {/* Icon Wrapper */}
      <div className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
          !notification.isRead ? "bg-white ring-1 ring-blue-100" : "bg-gray-100"
      )}>
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
             <p className={cn(
                 "text-sm leading-none",
                 !notification.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
             )}>
               {notification.title}
             </p>
             {!notification.isRead && (
                 <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 ring-2 ring-blue-50" />
             )}
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {notification.message}
          </p>
          
          <p className="text-[10px] font-medium text-gray-400 pt-0.5">
              {timeAgo(notification.createdAt)}
          </p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
        <Link href={notification.link} onClick={onClick} className="block w-full focus:outline-none focus:bg-gray-50">
            {Content}
        </Link>
    );
  }

  return (
    <div onClick={onClick} className="w-full cursor-pointer focus:outline-none focus:bg-gray-50">
        {Content}
    </div>
  );
}