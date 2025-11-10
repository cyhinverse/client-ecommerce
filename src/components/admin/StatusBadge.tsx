import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Truck, 
  Clock, 
  XCircle, 
  Shield, 
  UserCheck, 
  UserX 
} from "lucide-react";
import React from "react";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "product" | "user" | "role";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "order", className }) => {
  switch (type) {
    case "order":
      switch (status) {
        case "delivered":
          return (
            <Badge className={`bg-green-100 text-green-800 hover:bg-green-100 ${className || ""}`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Đã giao
            </Badge>
          );
        case "shipped":
          return (
            <Badge className={`bg-blue-100 text-blue-800 hover:bg-blue-100 ${className || ""}`}>
              <Truck className="h-3 w-3 mr-1" />
              Đang giao
            </Badge>
          );
        case "processing":
          return (
            <Badge className={`bg-orange-100 text-orange-800 hover:bg-orange-100 ${className || ""}`}>
              <Clock className="h-3 w-3 mr-1" />
              Đang xử lý
            </Badge>
          );
        case "pending":
          return (
            <Badge variant="outline" className={`border-gray-300 ${className || ""}`}>
              <Clock className="h-3 w-3 mr-1" />
              Chờ xác nhận
            </Badge>
          );
        case "cancelled":
          return (
            <Badge
              variant="outline"
              className={`bg-red-50 text-red-700 border-red-200 ${className || ""}`}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Đã hủy
            </Badge>
          );
        default:
          return <Badge variant="outline" className={className}>Không xác định</Badge>;
      }
    
    case "product":
      switch (status) {
        case "active":
          return <Badge className={`bg-green-500 ${className || ""}`}>Đang bán</Badge>;
        case "out_of_stock":
          return <Badge variant="outline" className={className}>Hết hàng</Badge>;
        case "inactive":
          return <Badge variant="secondary" className={className}>Ngừng bán</Badge>;
        default:
          return <Badge variant="outline" className={className}>Không xác định</Badge>;
      }
    
    case "user":
      switch (status) {
        case "active":
          return <Badge className={`bg-green-500 ${className || ""}`}>Đang hoạt động</Badge>;
        case "inactive":
          return <Badge variant="secondary" className={className}>Không hoạt động</Badge>;
        case "banned":
          return <Badge variant="destructive" className={className}>Đã khóa</Badge>;
        default:
          return <Badge variant="outline" className={className}>Không xác định</Badge>;
      }
    
    case "role":
      switch (status) {
        case "admin":
          return (
            <Badge className={`bg-purple-100 text-purple-800 hover:bg-purple-100 ${className || ""}`}>
              <Shield className="h-3 w-3 mr-1" />
              Quản trị viên
            </Badge>
          );
        case "customer":
          return <Badge variant="outline" className={className}>Khách hàng</Badge>;
        case "vendor":
          return (
            <Badge className={`bg-blue-100 text-blue-800 hover:bg-blue-100 ${className || ""}`}>
              Nhà bán hàng
            </Badge>
          );
        default:
          return <Badge variant="outline" className={className}>Không xác định</Badge>;
      }
      
    default:
      return <Badge variant="outline" className={className}>Không xác định</Badge>;
  }
};

export default StatusBadge;