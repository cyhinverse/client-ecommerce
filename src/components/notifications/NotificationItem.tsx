

export default function NotificationItem({message}: {message: string}) {
    return (
        <div className="p-4 border-b w-full bg-white  hover:bg-gray-100 cursor-pointer">
            <p className="text-[12px] text-gray-700">{message}</p>
        </div>
    )
}