import { Users, UserCheck, MailCheck, MapPin } from "lucide-react";

interface UsersStatsProps {
  totalUsers: number;
  verifiedUsers: number;
  usersWithAddress: number;
  recentUsers: number;
}

export function UsersStats({
  totalUsers,
  verifiedUsers,
  usersWithAddress,
  recentUsers,
}: UsersStatsProps) {
  const stats = [
    {
      title: "Tổng người dùng",
      value: totalUsers,
      icon: Users,
      description: "Quản trị & Người dùng",
      percentage: "+12.5%",
      trend: "up",
    },
    {
      title: "Đã xác minh",
      value: verifiedUsers,
      icon: MailCheck,
      description: "Đã xác minh email",
      percentage: "+4.2%",
      trend: "up",
    },
    {
      title: "Địa chỉ hoạt động",
      value: usersWithAddress,
      icon: MapPin,
      description: "Người dùng có địa chỉ",
      percentage: "+2.1%",
      trend: "up",
    },
    {
      title: "Người dùng mới",
      value: recentUsers,
      icon: UserCheck,
      description: "Đăng ký tuần này",
      percentage: "+10.3%",
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl bg-[#f7f7f7] p-6"
        >
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </p>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">
              {stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium inline-flex items-center gap-1">
                 {stat.percentage}
              </span>{" "}
              so với tháng trước
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}