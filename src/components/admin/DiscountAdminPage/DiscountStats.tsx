import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, AlertCircle, BarChart3 } from "lucide-react";

interface DiscountsStatsProps {
  totalDiscounts: number;
  activeDiscounts: number;
  expiredDiscounts: number;
  highUsageDiscounts: number;
}

export function DiscountsStats({
  totalDiscounts,
  activeDiscounts,
  expiredDiscounts,
  highUsageDiscounts,
}: DiscountsStatsProps) {
  const stats = [
    {
      title: "Tổng số mã",
      value: totalDiscounts.toString(),
      icon: Ticket,
      description: "Tất cả mã giảm giá",
    },
    {
      title: "Đang hoạt động",
      value: activeDiscounts.toString(),
      icon: BarChart3,
      description: "Mã đang kích hoạt",
    },
    {
      title: "Đã hết hạn",
      value: expiredDiscounts.toString(),
      icon: Clock,
      description: "Mã hết hạn",
    },
    {
      title: "Sắp hết lượt",
      value: highUsageDiscounts.toString(),
      icon: AlertCircle,
      description: "Sử dụng >80% lượt",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}