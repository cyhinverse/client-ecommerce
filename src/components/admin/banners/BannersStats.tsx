import { Image as ImageIcon, CheckCircle, Eye, MousePointer2 } from "lucide-react";

interface BannersStatsProps {
  totalBanners: number;
  activeBanners: number;
  clickThroughRate?: string;
  totalViews?: string;
}

export function BannersStats({
  totalBanners,
  activeBanners,
  clickThroughRate = "4.2%",
  totalViews = "12.5k",
}: BannersStatsProps) {
  const stats = [
    {
      title: "Tổng Banner",
      value: totalBanners,
      description: "Số lượng trong kho",
      icon: ImageIcon,
    },
    {
      title: "Đang hiển thị",
      value: activeBanners,
      description: "Banner đang hoạt động",
      icon: CheckCircle,
    },
    {
      title: "Tỷ lệ nhấp (CTR)",
      value: clickThroughRate,
      description: "Tỷ lệ người dùng nhấp",
      icon: MousePointer2,
    },
    {
      title: "Tổng lượt xem",
      value: totalViews,
      description: "Lượt hiển thị tích lũy",
      icon: Eye,
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
