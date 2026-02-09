import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Clock, XCircle, Shield, Store } from "lucide-react";
import React from "react";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "product" | "user" | "role";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "order",
  className,
}) => {
  switch (type) {
    case "order":
      switch (status) {
        case "delivered":
          return (
            <Badge
              className={`bg-green-100 text-green-700 hover:bg-green-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${
                className || ""
              }`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Đã giao
            </Badge>
          );
        case "shipped":
          return (
            <Badge
              className={`bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${
                className || ""
              }`}
            >
              <Truck className="h-3 w-3 mr-1" />
              Đang giao
            </Badge>
          );
        case "processing":
          return (
            <Badge
              className={`bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${
                className || ""
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              Đang xử lý
            </Badge>
          );
        case "pending":
          return (
            <Badge
              variant="outline"
              className={`border-gray-200 text-gray-600 rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}
            >
              <Clock className="h-3 w-3 mr-1" />
              Chờ xử lý
            </Badge>
          );
        case "cancelled":
          return (
            <Badge
              variant="outline"
              className={`bg-red-50 text-red-600 border-red-100 rounded-lg px-2.5 py-0.5 shadow-none ${
                className || ""
              }`}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Đã hủy
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 shadow-none ${className}`}>
              Không xác định
            </Badge>
          );
      }

    case "product":
      switch (status) {
        case "active":
          return (
            <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>Đang bán</Badge>
          );
        case "out_of_stock":
          return (
            <Badge variant="outline" className={`bg-red-50 text-red-600 border-red-100 rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Hết hàng
            </Badge>
          );
        case "inactive":
          return (
            <Badge variant="secondary" className={`bg-gray-100 text-gray-600 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Ngừng bán
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 shadow-none ${className}`}>
              Không xác định
            </Badge>
          );
      }

    case "user":
      switch (status) {
        case "active":
          return (
            <Badge className={`bg-green-100 text-green-700 hover:bg-green-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Đang hoạt động
            </Badge>
          );
        case "inactive":
          return (
            <Badge variant="secondary" className={`bg-gray-100 text-gray-600 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Ngừng hoạt động
            </Badge>
          );
        case "banned":
          return (
            <Badge variant="destructive" className={`rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Bị khóa
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Không xác định
            </Badge>
          );
      }

    case "role":
      switch (status) {
        case "admin":
          return (
            <Badge
              className={`bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 rounded-lg px-2.5 py-0.5 shadow-none ${
                className || ""
              }`}
            >
              <Shield className="h-3 w-3 mr-1" />
              Quản trị viên
            </Badge>
          );
        case "customer":
          return (
            <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 shadow-none bg-gray-50 border-gray-200 text-gray-600 ${className || ""}`}>
              Khách hàng
            </Badge>
          );
        case "vendor":
          return (
            <Badge
              className={`bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 rounded-lg px-2.5 py-0.5 shadow-none ${
                className || ""
              }`}
            >
              <Store className="h-3 w-3 mr-1" />
              Người bán
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
              Không xác định
            </Badge>
          );
      }

    default:
      return (
        <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 shadow-none ${className || ""}`}>
          Không xác định
        </Badge>
      );
  }
};

export default StatusBadge;
