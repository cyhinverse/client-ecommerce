import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, MailCheck, MapPin } from "lucide-react";

interface UsersStatsProps {
  totalUsers: number;
  verifiedUsers: number;
  usersWithAddress: number;
  recentUsers: number;
}

const stats = [
  {
    title: "Tổng người dùng",
    value: "totalUsers",
    icon: Users,
    bgColor: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  {
    title: "Đã xác thực email",
    value: "verifiedUsers",
    icon: MailCheck,
    bgColor: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  {
    title: "Có địa chỉ",
    value: "usersWithAddress",
    icon: MapPin,
    bgColor: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  {
    title: "Người dùng mới",
    value: "recentUsers",
    icon: UserCheck,
    bgColor: "bg-muted",
    iconColor: "text-muted-foreground",
  },
];

export function UsersStats({
  totalUsers,
  verifiedUsers,
  usersWithAddress,
  recentUsers,
}: UsersStatsProps) {
  const getValue = (valueKey: string) => {
    switch (valueKey) {
      case "totalUsers":
        return totalUsers || 0;
      case "verifiedUsers":
        return verifiedUsers || 0;
      case "usersWithAddress":
        return usersWithAddress || 0;
      case "recentUsers":
        return recentUsers || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="rounded-none border border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {getValue(stat.value)?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}