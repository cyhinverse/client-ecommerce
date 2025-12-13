import { useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { cleanNotification, getListNotification, markAllAsReadNotification } from "@/features/notification/notificationAction";
import SpinnerLoading from "@/components/common/SpinnerLoading";

export default function NotificationModel({isOpen,onClose}: {isOpen: boolean, onClose: () => void}) {
    const dispatch = useAppDispatch();
    const { notifications, unreadCount, loading } = useAppSelector(state => state.notification);
    const { token } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (isOpen && token && notifications.length === 0) {
            document.body.style.overflow = "unset";
            dispatch(getListNotification({ page: 1, limit: 10 }));
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

    return (
        isOpen ? (
        <>
            <div className="fixed inset-0 z-40 " onClick={onClose} />
            <div className="fixed right-16 top-16 w-[320px] shadow-2xl border border-gray-200 bg-white z-50 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b font-semibold text-sm bg-gray-50/50 flex justify-between items-center">
                    <span>Notifications ({unreadCount})</span>
                </div>
                <div  className="max-h-80 overflow-y-auto overscroll-contain no-scrollbar">
                    <div className="flex flex-col">
                        {loading && notifications.length === 0 ? (
                            <div className="flex justify-center p-4">
                                <SpinnerLoading />
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((noti) => (
                                <NotificationItem key={noti._id} notification={noti} />
                            ) )
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 border-t bg-gray-50 text-xs font-medium text-muted-foreground">
                    <span onClick={handleMarkAllRead} className="hover:underline hover:text-primary cursor-pointer transition-colors">Mark all as read</span>
                    <span onClick={() => cleanAllNotification()   } className="hover:underline hover:text-destructive cursor-pointer transition-colors">Clear all</span>
                </div>
            </div>
        </>
        ): null
    )
}