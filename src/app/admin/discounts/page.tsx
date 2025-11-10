import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
  Download,
  Tag,
  Calendar,
  Percent,
  Users,
  ShoppingCart,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for discounts
const mockDiscounts = [
  {
    id: "1",
    name: "Giảm giá mùa hè",
    code: "SUMMER2024",
    type: "percentage",
    value: 20,
    minOrder: 500000,
    maxDiscount: 1000000,
    usageLimit: 1000,
    usedCount: 245,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "active",
    applicableTo: "all_products",
  },
  {
    id: "2",
    name: "Freeship toàn quốc",
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    minOrder: 300000,
    maxDiscount: null,
    usageLimit: null,
    usedCount: 892,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    applicableTo: "all_orders",
  },
  {
    id: "3",
    name: "Giảm giá điện tử",
    code: "ELECTRONIC15",
    type: "percentage",
    value: 15,
    minOrder: 1000000,
    maxDiscount: 500000,
    usageLimit: 500,
    usedCount: 500,
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    status: "expired",
    applicableTo: "category",
  },
  {
    id: "4",
    name: "Khách hàng mới",
    code: "WELCOME10",
    type: "fixed",
    value: 100000,
    minOrder: 0,
    maxDiscount: 100000,
    usageLimit: 1,
    usedCount: 156,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    applicableTo: "new_customers",
  },
  {
    id: "5",
    name: "Flash Sale",
    code: "FLASH50",
    type: "percentage",
    value: 50,
    minOrder: 0,
    maxDiscount: 200000,
    usageLimit: 100,
    usedCount: 100,
    startDate: "2024-01-20",
    endDate: "2024-01-20",
    status: "inactive",
    applicableTo: "specific_products",
  },
];

const getTypeBadge = (type: string) => {
  switch (type) {
    case "percentage":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Percent className="h-3 w-3 mr-1" />
          Phần trăm
        </Badge>
      );
    case "fixed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Tag className="h-3 w-3 mr-1" />
          Giá cố định
        </Badge>
      );
    case "shipping":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <ShoppingCart className="h-3 w-3 mr-1" />
          Miễn phí ship
        </Badge>
      );
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Đang hoạt động</Badge>;
    case "inactive":
      return <Badge variant="secondary">Không hoạt động</Badge>;
    case "expired":
      return <Badge variant="outline">Hết hạn</Badge>;
    case "scheduled":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          Đã lên lịch
        </Badge>
      );
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getApplicableToLabel = (applicableTo: string) => {
  switch (applicableTo) {
    case "all_products":
      return "Tất cả sản phẩm";
    case "all_orders":
      return "Tất cả đơn hàng";
    case "specific_products":
      return "Sản phẩm cụ thể";
    case "category":
      return "Theo danh mục";
    case "new_customers":
      return "Khách hàng mới";
    default:
      return "Không xác định";
  }
};

const formatPrice = (price: number | null) => {
  if (price === null) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

const formatDiscountValue = (discount: any) => {
  switch (discount.type) {
    case "percentage":
      return `${discount.value}%`;
    case "fixed":
      return formatPrice(discount.value);
    case "shipping":
      return "Miễn phí ship";
    default:
      return "-";
  }
};

export default function DiscountAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý mã giảm giá
          </h1>
          <p className="text-gray-600 mt-2">
            Tạo và quản lý mã giảm giá, khuyến mãi
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo mã giảm giá
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng mã giảm giá
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5 so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Mã đang có hiệu lực</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,893</div>
            <p className="text-xs text-muted-foreground">Lượt sử dụng mã</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiết kiệm</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2M</div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị khuyến mãi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Discount Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tạo mã giảm giá</CardTitle>
            <CardDescription>
              Tạo mã giảm giá mới cho khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên mã giảm giá</Label>
              <Input id="name" placeholder="Nhập tên mã giảm giá" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Mã giảm giá</Label>
              <Input id="code" placeholder="Nhập mã (ví dụ: SUMMER20)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại giảm giá</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Phần trăm</SelectItem>
                    <SelectItem value="fixed">Giá cố định</SelectItem>
                    <SelectItem value="shipping">Miễn phí ship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Giá trị</Label>
                <Input id="value" placeholder="0" type="number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrder">Đơn hàng tối thiểu</Label>
              <Input id="minOrder" placeholder="0" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Giảm tối đa</Label>
              <Input
                id="maxDiscount"
                placeholder="Không giới hạn"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
              <Input
                id="usageLimit"
                placeholder="Không giới hạn"
                type="number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input id="startDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicableTo">Áp dụng cho</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_products">Tất cả sản phẩm</SelectItem>
                  <SelectItem value="all_orders">Tất cả đơn hàng</SelectItem>
                  <SelectItem value="specific_products">
                    Sản phẩm cụ thể
                  </SelectItem>
                  <SelectItem value="category">Theo danh mục</SelectItem>
                  <SelectItem value="new_customers">Khách hàng mới</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" defaultChecked />
              <Label htmlFor="active">Kích hoạt ngay</Label>
            </div>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Tạo mã giảm giá
            </Button>
          </CardContent>
        </Card>

        {/* Discounts List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Danh sách mã giảm giá</CardTitle>
                <CardDescription>
                  Quản lý tất cả mã giảm giá trong hệ thống
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Tìm kiếm mã giảm giá..."
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên mã</TableHead>
                  <TableHead>Mã</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Đơn tối thiểu</TableHead>
                  <TableHead>Đã sử dụng</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{discount.name}</p>
                        <p className="text-sm text-gray-600">
                          {getApplicableToLabel(discount.applicableTo)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {discount.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(discount.type)}
                        <span className="font-semibold">
                          {formatDiscountValue(discount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(discount.minOrder)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">
                          {discount.usedCount}
                        </span>
                        {discount.usageLimit && (
                          <span className="text-gray-500">
                            /{discount.usageLimit}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(discount.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(discount.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa mã
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Hiển thị 1 đến 5 của 24 mã giảm giá
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm" className="bg-gray-100">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
