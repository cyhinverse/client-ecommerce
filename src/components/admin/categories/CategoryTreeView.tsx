import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, Layers } from "lucide-react";
import { Category } from "@/types/category";

export const getStatusBadge = (status: boolean) => {
  switch (status) {
    case true:
      return (
        <Badge className="bg-success text-success-foreground hover:bg-success/90">
          Active
        </Badge>
      );
    case false:
      return <Badge variant="secondary">Inactive</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

interface CategoryTreeViewProps {
  categories: Category[];
  getChildCategories: (parentId: string) => Category[];
  getProductCount: (category: Category) => number;
}

export function CategoryTreeView({
  categories,
  getChildCategories,
  getProductCount,
}: CategoryTreeViewProps) {
  const rootCategories = categories.filter(
    (category) => !category.parentCategory
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Tree</CardTitle>
        <CardDescription>
          View hierarchical structure of categories ({rootCategories.length} root
          categories)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {rootCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No categories found
              </div>
            ) : (
              rootCategories.map((category) => (
                <div key={category._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-info" />
                      <div>
                        <h4 className="font-semibold">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {getProductCount(category)} products
                      </Badge>
                      {getStatusBadge(category.isActive)}
                    </div>
                  </div>

                  {getChildCategories(category._id as string).length > 0 && (
                    <div className="mt-3 ml-8 space-y-2 border-l-2 border-border pl-4">
                      {getChildCategories(category._id as string).map(
                        (subCategory) => (
                          <div
                            key={subCategory._id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3">
                              <Layers className="h-4 w-4 text-success" />
                              <div>
                                <h5 className="font-medium">
                                  {subCategory.name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {subCategory.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">
                                {getProductCount(subCategory)} products
                              </Badge>
                              {getStatusBadge(subCategory.isActive)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
