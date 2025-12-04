import { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationModel({isOpen,onClose}: {isOpen: boolean, onClose: () => void}) {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Your order has been shipped." },
        { id: 2, message: "New comment on your post." },
        { id: 3, message: "Your password was changed successfully." },
        { id: 4, message: "Your password was changed successfully." },
        { id: 5, message: "Your password was changed successfully." },
        { id: 6, message: "System update completed." },
        { id: 7, message: "System update completed." },
        { id: 8, message: "Welcome to our platform!" },
    ]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
                document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";

        };
    }, [isOpen]);


    const cleanAllNotification = () => {
        setNotifications([]);
    };

    return (
        isOpen ? (
        <>
            <div className="fixed inset-0 z-40 " onClick={onClose} />
            <div className="fixed right-16 top-16 w-[320px] shadow-2xl border border-gray-200 bg-white z-50 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b font-semibold text-sm bg-gray-50/50">
                    Notifications ({notifications.length})
                </div>
                <div  className="max-h-80 overflow-y-auto overscroll-contain no-scrollbar">
                    <div className="flex flex-col">
                        {
                            notifications.map((noti) => (
                                <NotificationItem key={noti.id} message={noti.message} />
                            ) )
                        }
                    </div>
                </div>
                <div className="flex justify-between items-center p-3 border-t bg-gray-50 text-xs font-medium text-muted-foreground">
                    <span className="hover:underline hover:text-primary cursor-pointer transition-colors">Mark all as read</span>
                    <span onClick={() => cleanAllNotification()   } className="hover:underline hover:text-destructive cursor-pointer transition-colors">Clear all</span>
                </div>
            </div>
        </>
        ): null
    )
}