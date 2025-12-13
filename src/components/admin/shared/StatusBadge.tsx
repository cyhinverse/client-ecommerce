import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Clock, XCircle, Shield } from "lucide-react";
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
              className={`bg-success/10 text-success hover:bg-success/20 ${
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
              className={`bg-info/10 text-info hover:bg-info/20 ${
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
              className={`bg-warning/10 text-warning hover:bg-warning/20 ${
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
              className={`border-border ${className || ""}`}
            >
              <Clock className="h-3 w-3 mr-1" />
              Chờ xác nhận
            </Badge>
          );
        case "cancelled":
          return (
            <Badge
              variant="outline"
              className={`bg-destructive/10 text-destructive border-destructive/20 ${
                className || ""
              }`}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Đã hủy
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={className}>
              Không xác định
            </Badge>
          );
      }

    case "product":
      switch (status) {
        case "active":
          return (
            <Badge className={`bg-success ${className || ""}`}>Đang bán</Badge>
          );
        case "out_of_stock":
          return (
            <Badge variant="outline" className={className}>
              Hết hàng
            </Badge>
          );
        case "inactive":
          return (
            <Badge variant="secondary" className={className}>
              Ngừng bán
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={className}>
              Không xác định
            </Badge>
          );
      }

    case "user":
      switch (status) {
        case "active":
          return (
            <Badge className={`bg-success ${className || ""}`}>
              Đang hoạt động
            </Badge>
          );
        case "inactive":
          return (
            <Badge variant="secondary" className={className}>
              Không hoạt động
            </Badge>
          );
        case "banned":
          return (
            <Badge variant="destructive" className={className}>
              Đã khóa
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={className}>
              Không xác định
            </Badge>
          );
      }

    case "role":
      switch (status) {
        case "admin":
          return (
            <Badge
              className={`bg-primary/10 text-primary hover:bg-primary/20 ${
                className || ""
              }`}
            >
              <Shield className="h-3 w-3 mr-1" />
              Quản trị viên
            </Badge>
          );
        case "customer":
          return (
            <Badge variant="outline" className={className}>
              Khách hàng
            </Badge>
          );
        case "vendor":
          return (
            <Badge
              className={`bg-info/10 text-info hover:bg-info/20 ${
                className || ""
              }`}
            >
              Nhà bán hàng
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className={className}>
              Không xác định
            </Badge>
          );
      }

    default:
      return (
        <Badge variant="outline" className={className}>
          Không xác định
        </Badge>
      );
  }
};

export default StatusBadge;
