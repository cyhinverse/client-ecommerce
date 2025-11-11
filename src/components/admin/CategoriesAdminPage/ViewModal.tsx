// components/ViewCategoryModal.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  X,
  Folder,
  Calendar,
  Package,
  Link,
  CheckCircle,
  XCircle,
  Edit,
  Layers,
} from "lucide-react";
import { Category } from "@/types/category";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

interface ViewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category: Category) => void;
  category: Category | null;
}

export function ViewCategoryModal({
  isOpen,
  onClose,
  onEdit,
  category,
}: ViewCategoryModalProps) {
  if (!category) return null;

  const handleEdit = () => {
    onEdit(category);
    onClose();
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        Đang hoạt động
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Không hoạt động
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Chi tiết danh mục
            <Badge variant="outline" className="text-sm">
              ID: {category._id.slice(-8)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về danh mục sản phẩm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Folder className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Link className="h-3 w-3" />
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(category.isActive)}
              </div>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tên danh mục
                  </label>
                  <p className="text-sm font-medium mt-1">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Slug
                  </label>
                  <p className="text-sm font-medium mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {category.slug}
                    </code>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mô tả
                </label>
                <p className="text-sm text-gray-700 mt-1">
                  {category.description || "Không có mô tả"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(category.isActive)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Số sản phẩm
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {category.productCount || 0} sản phẩm
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Category Information */}
          {category.parentCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Danh mục cha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Folder className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {category.parentCategory.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Slug: <code>{category.parentCategory.slug}</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Thông tin hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ngày tạo
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">
                      {formatDate(category.createdAt)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Cập nhật cuối
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">
                      {formatDate(category.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URL Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="h-4 w-4" />
                Đường dẫn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    URL truy cập
                  </label>
                  <p className="text-sm text-blue-600 mt-1">
                    /categories/{category.slug}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    URL đầy đủ
                  </label>
                  <p className="text-sm text-gray-600 mt-1 break-all">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/categories/${category.slug}`
                      : `/categories/${category.slug}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
          <Button type="button" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
