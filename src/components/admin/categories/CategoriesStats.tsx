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
      title: "Total Categories",
      value: totalCategories,
      description: "All categories in the system",
      icon: Folder,
    },
    {
      title: "Active Categories",
      value: activeCategories,
      description: "Displayed categories",
      icon: Folder,
    },
    {
      title: "Subcategories",
      value: childCategories,
      description: "Level 2, 3 categories",
      icon: Layers,
    },
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products in categories",
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
