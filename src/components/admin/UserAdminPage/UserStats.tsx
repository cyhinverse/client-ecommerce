import { Card, CardContent } from "@/components/ui/card";
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
    color: "text-blue-600",
  },
  {
    title: "Đã xác thực email",
    value: "verifiedUsers",
    icon: MailCheck,
    color: "text-green-600",
  },
  {
    title: "Có địa chỉ",
    value: "usersWithAddress",
    icon: MapPin,
    color: "text-purple-600",
  },
  {
    title: "Người dùng mới",
    value: "recentUsers",
    icon: UserCheck,
    color: "text-orange-600",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {getValue(stat.value)?.toLocaleString() || "0"}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
