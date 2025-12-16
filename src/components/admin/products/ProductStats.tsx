import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tag, DollarSign, BarChart3 } from "lucide-react";

interface ProductsStatsProps {
  totalProducts: number;
  activeProducts: number;
  productsOnSale: number;
  totalCategories: number;
}

export function ProductsStats({
  totalProducts,
  activeProducts,
  productsOnSale,
  totalCategories,
}: ProductsStatsProps) {
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: totalProducts,
      icon: Package,
      description: "Tất cả sản phẩm",
    },
    {
      title: "Đang hoạt động",
      value: activeProducts,
      icon: BarChart3,
      description: "Sản phẩm đang bán",
    },
    {
      title: "Đang giảm giá",
      value: productsOnSale,
      icon: DollarSign,
      description: "Sản phẩm khuyến mãi",
    },
    {
      title: "Danh mục",
      value: totalCategories,
      icon: Tag,
      description: "Tổng danh mục",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
