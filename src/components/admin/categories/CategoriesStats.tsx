import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Layers, Package } from "lucide-react";

interface CategoriesStatsProps {
  totalCategories: number;
  activeCategories: number;
  childCategories: number;
  totalProducts: number;
}

export function CategoriesStats({
  totalCategories,
  activeCategories,
  childCategories,
  totalProducts,
}: CategoriesStatsProps) {
  const stats = [
    {
      title: "Tổng danh mục",
      value: totalCategories,
      description: "Tất cả danh mục trong hệ thống",
      icon: Folder,
    },
    {
      title: "Đang hoạt động",
      value: activeCategories,
      description: "Danh mục hiển thị",
      icon: Folder,
    },
    {
      title: "Danh mục con",
      value: childCategories,
      description: "Danh mục cấp 2, 3",
      icon: Layers,
    },
    {
      title: "Tổng sản phẩm",
      value: totalProducts,
      description: "Sản phẩm trong danh mục",
      icon: Package,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="rounded-none border border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
