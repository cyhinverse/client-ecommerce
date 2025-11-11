import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Package,
} from "lucide-react";
import { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";

interface CategoriesTableProps {
  categories: Category[];
  searchTerm: string;
  pageSize: number;
  onSearch: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (category: Category) => void; // ← THÊM NÀY
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
  getParentName: (category: Category) => string;
  getProductCount: (category: Category) => number;
}

export const getStatusBadge = (status: boolean) => {
  switch (status) {
    case true:
      return <Badge className="bg-green-500">Đang hoạt động</Badge>;
    case false:
      return <Badge variant="secondary">Không hoạt động</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

export function CategoriesTable({
  categories,
  searchTerm,
  pageSize,
  onSearch,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  getParentName,
  getProductCount,
}: CategoriesTableProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize">Hiển thị:</Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="text-gray-500">Không có danh mục nào</div>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{category.name}</p>
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
                  <span className="text-sm">{getParentName(category)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {getProductCount(category)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(category.isActive)}</TableCell>
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
                      <DropdownMenuItem onClick={() => onView(category)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(category)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa danh mục
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
