import { useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cleanNotification, getListNotification, markAllAsReadNotification } from "@/features/notification/notificationAction";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function NotificationModel({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    const dispatch = useAppDispatch();
    const { notifications, unreadCount, loading } = useAppSelector(state => state.notification);
    const { token } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (isOpen && token && notifications.length === 0) {
            document.body.style.overflow = "hidden";
            dispatch(getListNotification({ page: 1, limit: 10 }));
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, dispatch, token, notifications.length]);


    const cleanAllNotification = () => {
        dispatch(cleanNotification());
    };

    const handleMarkAllRead = () => {
        dispatch(markAllAsReadNotification());
    }

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 z-[60] bg-black/10 backdrop-blur-[2px]" 
                onClick={onClose} 
            />
            <div className="fixed right-4 top-16 w-[360px] max-h-[80vh] flex flex-col shadow-2xl border border-white/20 bg-white/90 dark:bg-black/90 backdrop-blur-xl z-[70] rounded-2xl overflow-hidden animate-in slide-in-from-top-5 duration-300">
                
                {/* Header */}
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-black/50">
                    <h3 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                    </h3>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {loading && notifications.length === 0 ? (
                        <div className="flex justify-center items-center py-12">
                            <SpinnerLoading />
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y divide-border/40">
                            {notifications.map((noti, index) => (
                                <NotificationItem key={`${noti._id}-${index}`} notification={noti} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 px-6 text-center text-sm text-muted-foreground">
                            <p>No notifications yet.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-black/5 dark:border-white/5 bg-gray-50/80 dark:bg-zinc-900/80 flex justify-between">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 text-muted-foreground hover:text-primary"
                        onClick={handleMarkAllRead}
                    >
                        Mark all as read
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={cleanAllNotification}
                    >
                        Clear all
                    </Button>
                </div>
            </div>
        </>
    );
}