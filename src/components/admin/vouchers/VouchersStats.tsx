import { Ticket, Clock, AlertCircle, BarChart3 } from "lucide-react";

interface VouchersStatsProps {
  totalVouchers: number;
  activeVouchers: number;
  expiredVouchers: number;
  highUsageVouchers: number;
}

export function VouchersStats({
  totalVouchers,
  activeVouchers,
  expiredVouchers,
  highUsageVouchers,
}: VouchersStatsProps) {
  const stats = [
    {
      title: "Tổng Mã giảm giá",
      value: totalVouchers,
      icon: Ticket,
      description: "Tất cả mã giảm giá",
    },
    {
      title: "Đang hoạt động",
      value: activeVouchers,
      icon: BarChart3,
      description: "Mã đang hiệu lực",
    },
    {
      title: "Đã hết hạn",
      value: expiredVouchers,
      icon: Clock,
      description: "Mã đã quá hạn",
    },
    {
      title: "Sắp hết lượt",
      value: highUsageVouchers,
      icon: AlertCircle,
      description: "Đã dùng >80% giới hạn",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-[2rem] border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 p-6 shadow-sm backdrop-blur-xl">
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
