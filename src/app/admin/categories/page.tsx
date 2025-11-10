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
  Folder,
  Layers,
  Package,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for categories
const mockCategories = [
  {
    id: "1",
    name: "Điện thoại",
    slug: "dien-thoai",
    description: "Các dòng điện thoại smartphone",
    parent: null,
    productCount: 156,
    status: "active",
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Laptop",
    slug: "laptop",
    description: "Máy tính xách tay các hãng",
    parent: null,
    productCount: 89,
    status: "active",
    featured: true,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "iPhone",
    slug: "iphone",
    description: "Các dòng iPhone chính hãng",
    parent: "1",
    productCount: 45,
    status: "active",
    featured: true,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Samsung",
    slug: "samsung",
    description: "Điện thoại Samsung Galaxy",
    parent: "1",
    productCount: 38,
    status: "active",
    featured: false,
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Phụ kiện",
    slug: "phu-kien",
    description: "Các phụ kiện điện tử",
    parent: null,
    productCount: 234,
    status: "inactive",
    featured: false,
    createdAt: "2024-01-11",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Đang hoạt động</Badge>;
    case "inactive":
      return <Badge variant="secondary">Không hoạt động</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const getFeaturedBadge = (featured: boolean) => {
  return featured ? (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
      Nổi bật
    </Badge>
  ) : null;
};

const getParentName = (parentId: string | null) => {
  if (!parentId) return "-";
  const parent = mockCategories.find((cat) => cat.id === parentId);
  return parent ? parent.name : "Không xác định";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

export default function CategoriesAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý danh mục
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý danh mục sản phẩm và phân loại
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng danh mục</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Danh mục hiển thị</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Danh mục con</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Danh mục cấp 2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm trong danh mục
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Thêm danh mục mới</CardTitle>
            <CardDescription>Tạo danh mục sản phẩm mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input id="name" placeholder="Nhập tên danh mục" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="ten-danh-muc" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Danh mục cha</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Chọn danh mục cha (nếu có)</option>
                <option value="1">Điện thoại</option>
                <option value="2">Laptop</option>
                <option value="5">Phụ kiện</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả cho danh mục"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="status" defaultChecked />
                <Label htmlFor="status">Kích hoạt</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Nổi bật</Label>
              </div>
            </div>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục
            </Button>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Danh sách danh mục</CardTitle>
                <CardDescription>
                  Quản lý tất cả danh mục sản phẩm
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Tìm kiếm danh mục..."
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
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Danh mục cha</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{category.name}</p>
                          {getFeaturedBadge(category.featured)}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {getParentName(category.parent)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {category.productCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
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
                            Xóa danh mục
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
                Hiển thị 1 đến 5 của 24 danh mục
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

      {/* Category Tree View */}
      <Card>
        <CardHeader>
          <CardTitle>Cây danh mục</CardTitle>
          <CardDescription>
            Xem cấu trúc phân cấp của các danh mục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Categories */}
            <div className="space-y-2">
              {mockCategories
                .filter((cat) => !cat.parent)
                .map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Folder className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {category.productCount} sản phẩm
                        </Badge>
                        {getStatusBadge(category.status)}
                      </div>
                    </div>

                    {/* Sub Categories */}
                    {mockCategories.filter(
                      (subCat) => subCat.parent === category.id
                    ).length > 0 && (
                      <div className="mt-3 ml-8 space-y-2 border-l-2 border-gray-200 pl-4">
                        {mockCategories
                          .filter((subCat) => subCat.parent === category.id)
                          .map((subCategory) => (
                            <div
                              key={subCategory.id}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center gap-3">
                                <Layers className="h-4 w-4 text-green-500" />
                                <div>
                                  <h5 className="font-medium">
                                    {subCategory.name}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {subCategory.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant="outline">
                                  {subCategory.productCount} sản phẩm
                                </Badge>
                                {getStatusBadge(subCategory.status)}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
