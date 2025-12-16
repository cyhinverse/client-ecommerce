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
      title: "Total Discounts",
      value: totalDiscounts.toString(),
      icon: Ticket,
      description: "All discount codes",
    },
    {
      title: "Active",
      value: activeDiscounts.toString(),
      icon: BarChart3,
      description: "Active codes",
    },
    {
      title: "Expired",
      value: expiredDiscounts.toString(),
      icon: Clock,
      description: "Expired codes",
    },
    {
      title: "Running Out",
      value: highUsageDiscounts.toString(),
      icon: AlertCircle,
      description: "Used >80% limit",
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