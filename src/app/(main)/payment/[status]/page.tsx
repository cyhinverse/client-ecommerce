"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShoppingBag,
  Home,
  RefreshCcw,
  ReceiptText,
  Truck,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = (params.status as string) || "error";
  const orderId = searchParams.get("orderId");
  const normalizedStatus =
    status === "success" || status === "failed" ? status : "error";

  const contentConfig = {
    success: {
      title: "Thanh toán thành công",
      description:
        "Đơn hàng của bạn đã được xác nhận. Hệ thống sẽ xử lý và cập nhật trạng thái giao hàng sớm nhất.",
      icon: CheckCircle2,
      iconWrapperClass: "bg-green-100",
      iconClass: "text-green-600",
      noteClass: "bg-green-50 border-green-200 text-green-700",
      note: "Bạn có thể theo dõi tiến độ ở mục Đơn hàng.",
      primaryActionLabel: "Xem đơn hàng của tôi",
      primaryActionIcon: ShoppingBag,
      primaryAction: () => router.push("/profile?tab=orders"),
      secondaryActionLabel: "Tiếp tục mua sắm",
      secondaryActionIcon: Home,
      secondaryAction: () => router.push("/"),
      quickItems: [
        {
          icon: ReceiptText,
          title: "Xác nhận đơn hàng",
          text: "Đơn hàng đã ghi nhận trong hệ thống.",
        },
        {
          icon: Truck,
          title: "Chuẩn bị giao hàng",
          text: "Shop sẽ đóng gói và bàn giao cho đơn vị vận chuyển.",
        },
      ],
    },
    failed: {
      title: "Thanh toán thất bại",
      description:
        "Giao dịch chưa hoàn tất. Vui lòng kiểm tra lại phương thức thanh toán và thử lại.",
      icon: XCircle,
      iconWrapperClass: "bg-red-100",
      iconClass: "text-red-600",
      noteClass: "bg-red-50 border-red-200 text-red-700",
      note: "Nếu đã bị trừ tiền, vui lòng liên hệ hỗ trợ để kiểm tra giao dịch.",
      primaryActionLabel: "Quay lại giỏ hàng",
      primaryActionIcon: RefreshCcw,
      primaryAction: () => router.push("/cart"),
      secondaryActionLabel: "Về trang chủ",
      secondaryActionIcon: Home,
      secondaryAction: () => router.push("/"),
      quickItems: [
        {
          icon: Shield,
          title: "Kiểm tra bảo mật",
          text: "Xác nhận thông tin thẻ hoặc ví điện tử trước khi thử lại.",
        },
        {
          icon: ReceiptText,
          title: "Kiểm tra lịch sử",
          text: "Xem lại trạng thái đơn trong tài khoản cá nhân.",
        },
      ],
    },
    error: {
      title: "Đã xảy ra lỗi",
      description:
        "Không thể xác minh trạng thái thanh toán vào lúc này. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      icon: AlertCircle,
      iconWrapperClass: "bg-amber-100",
      iconClass: "text-amber-600",
      noteClass: "bg-amber-50 border-amber-200 text-amber-700",
      note: "Chúng tôi đang xử lý sự cố để khôi phục dịch vụ sớm nhất.",
      primaryActionLabel: "Về trang chủ",
      primaryActionIcon: Home,
      primaryAction: () => router.push("/"),
      secondaryActionLabel: "Xem đơn hàng",
      secondaryActionIcon: ShoppingBag,
      secondaryAction: () => router.push("/profile?tab=orders"),
      quickItems: [
        {
          icon: AlertCircle,
          title: "Lỗi hệ thống tạm thời",
          text: "Vui lòng thử lại sau vài phút.",
        },
        {
          icon: ReceiptText,
          title: "Giữ lại thông tin giao dịch",
          text: "Bạn có thể dùng mã giao dịch để liên hệ hỗ trợ.",
        },
      ],
    },
  } as const;

  const config = contentConfig[normalizedStatus];
  const StatusIcon = config.icon;
  const PrimaryActionIcon = config.primaryActionIcon;
  const SecondaryActionIcon = config.secondaryActionIcon;

  return (
    <div className="w-full min-h-screen bg-background py-4 -mt-4 -mx-4 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-[#f7f7f7] rounded-sm mb-4 p-4">
          <h1 className="text-xl font-bold text-gray-800">Kết quả thanh toán</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#f7f7f7] rounded-sm p-6 md:p-8"
        >
          <div className="max-w-[700px] mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className={`w-20 h-20 ${config.iconWrapperClass} rounded-full flex items-center justify-center mx-auto`}
            >
              <StatusIcon className={`h-11 w-11 ${config.iconClass}`} />
            </motion.div>

            <h2 className="mt-5 text-2xl md:text-3xl font-bold text-gray-800">
              {config.title}
            </h2>
            <p className="mt-2 text-gray-500 text-sm md:text-base leading-relaxed">
              {config.description}
            </p>

            {orderId && (
              <div className="mt-5 bg-white rounded-sm border border-gray-200 p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Mã đơn hàng
                </p>
                <p className="text-lg font-bold text-gray-800">
                  #{orderId.slice(-8).toUpperCase()}
                </p>
              </div>
            )}

            <div
              className={`mt-4 rounded-sm border px-4 py-3 text-sm ${config.noteClass}`}
            >
              {config.note}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-left">
              {config.quickItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-sm border border-gray-200 p-4"
                >
                  <item.icon className="h-5 w-5 text-[#E53935] mb-2" />
                  <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={config.primaryAction}
                className="flex-1 h-11 bg-[#E53935] hover:bg-[#D32F2F] rounded text-sm font-medium"
              >
                <PrimaryActionIcon className="h-4 w-4 mr-2" />
                {config.primaryActionLabel}
              </Button>
              <Button
                onClick={config.secondaryAction}
                variant="outline"
                className="flex-1 h-11 rounded border-gray-300 text-gray-700"
              >
                <SecondaryActionIcon className="h-4 w-4 mr-2" />
                {config.secondaryActionLabel}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
