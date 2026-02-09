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
      title: "Tổng Danh mục",
      value: totalCategories,
      description: "Tất cả danh mục trong hệ thống",
      icon: Folder,
    },
    {
      title: "Danh mục Hoạt động",
      value: activeCategories,
      description: "Danh mục đang hiển thị",
      icon: Folder,
    },
    {
      title: "Danh mục Con",
      value: childCategories,
      description: "Danh mục cấp 2, 3",
      icon: Layers,
    },
    {
      title: "Tổng Sản phẩm",
      value: totalProducts,
      description: "Sản phẩm trong các danh mục",
      icon: Package,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-2xl bg-[#f7f7f7] p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</h3>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
