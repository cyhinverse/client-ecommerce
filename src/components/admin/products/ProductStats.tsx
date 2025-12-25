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
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      description: "All products",
    },
    {
      title: "Active",
      value: activeProducts,
      icon: BarChart3,
      description: "Active products",
    },
    {
      title: "On Sale",
      value: productsOnSale,
      icon: DollarSign,
      description: "Discounted products",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Tag,
      description: "Total categories",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-4xl border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </h3>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
