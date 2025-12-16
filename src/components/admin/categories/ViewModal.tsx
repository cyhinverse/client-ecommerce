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
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import { Category } from "@/types/category";
import { useState } from "react";
import Image from "next/image";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US");
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!category) return null;

  const handleEdit = () => {
    onEdit(category);
    onClose();
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-primary text-primary-foreground border-primary">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="border-muted-foreground text-muted-foreground"
      >
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const images = category.images || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Category Details
              <Badge variant="outline" className="text-sm">
                {/* ID: {category._id.slice(-8)} */}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Detailed information about product category
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder className="h-6 w-6 text-primary" />
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
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Images Section */}
            {images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Images ({images.length})
                  </CardTitle>
                  <CardDescription>
                    {images.length > 1
                      ? `List of category images`
                      : `Category image`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* All Images Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-24 group cursor-pointer rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
                          onClick={() => setSelectedImage(image)}
                        >
                          <Image
                            src={image}
                            alt={`${category.name} - Ảnh ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <div className="bg-background/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <ZoomIn className="h-3 w-3 text-foreground" />
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2 text-xs bg-background/90 border-0"
                          >
                            {index + 1}
                          </Badge>
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 bg-primary border-0 text-xs">
                              Main
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Images Message */}
            {images.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm mb-2 font-medium">
                      No images available
                    </p>
                    <p className="text-muted-foreground/70 text-xs">
                      Add images when editing category
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Category Name
                    </label>
                    <p className="text-sm font-medium mt-1">{category.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description || (
                      <span className="text-muted-foreground italic">
                        No description
                      </span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(category.isActive)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Product Count
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {category.productCount || 0} products
                      </span>
                    </div>
                  </div>
                </div>

                {/* Images Count */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Image Count
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {images.length} images
                    </span>
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
                    Parent Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        {category.parentCategory.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Slug:{" "}
                        <code className="bg-muted px-1 py-0.5 rounded">
                          {category.parentCategory.slug}
                        </code>
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
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(category.createdAt || "")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
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
                  URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Access URL
                    </label>
                    <p className="text-sm text-primary font-medium mt-1">
                      /categories/{category.slug}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full URL
                    </label>
                    <p className="text-sm text-muted-foreground mt-1 break-all bg-muted p-2 rounded border">
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
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
            <Button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal for Zoom */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/90 border-0">
            <DialogHeader className="sr-only">
              <DialogTitle>View Image</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="relative flex justify-center items-center min-h-[80vh] w-full p-8">
                <Image
                  src={selectedImage}
                  alt="View Image"
                  fill
                  className="object-contain rounded-lg shadow-2xl"
                  sizes="90vw"
                />
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant="secondary"
                  className="bg-background/90 text-foreground"
                >
                  <ZoomIn className="h-3 w-3 mr-1" />
                  Click outside to close
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
