import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import Image from "next/image";

interface UsersTableProps {
  users: User[];
  searchTerm: string;
  pageSize: number;
  onSearch: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  onRoleFilterChange?: (role: string) => void;
  onVerifiedFilterChange?: (isVerified: boolean | null) => void;
  selectedRole?: string;
  selectedVerified?: boolean | null;
}

export const getVerifiedBadge = (isVerified: boolean) => {
  return isVerified ? (
    <Badge className="bg-primary text-primary-foreground border-primary">
      <CheckCircle className="h-3 w-3 mr-1" />
      Đã xác thực
    </Badge>
  ) : (
    <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
      <XCircle className="h-3 w-3 mr-1" />
      Chưa xác thực
    </Badge>
  );
};

export const getRoleBadge = (roles: string) => {
  const colors: { [key: string]: string } = {
    admin: "bg-primary text-primary-foreground border-primary",
    user: "bg-muted text-foreground border-border",
  };

  const roleNames: { [key: string]: string } = {
    admin: "Quản trị viên",
    user: "Người dùng",
  };

  return (
    <Badge
      variant="outline"
      className={colors[roles] || "bg-muted text-foreground border-border"}
    >
      {roleNames[roles] || roles}
    </Badge>
  );
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN");
};

export function UsersTable({
  users,
  searchTerm,
  pageSize,
  onSearch,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  onRoleFilterChange,
  onVerifiedFilterChange,
  selectedRole = "",
  selectedVerified = null,
}: UsersTableProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleRoleFilter = (role: string) => {
    onRoleFilterChange?.(role);
  };

  const handleVerifiedFilter = (isVerified: boolean | null) => {
    onVerifiedFilterChange?.(isVerified);
  };

  const getPrimaryAddress = (addresses: any[]) => {
    if (!addresses || addresses.length === 0) return "Chưa có địa chỉ";
    return addresses[0].address;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>

          {/* Role Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-none border-border hover:bg-muted text-foreground hover:text-foreground"
              >
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                {selectedRole === "admin"
                  ? "Quản trị viên"
                  : selectedRole === "user"
                    ? "Người dùng"
                    : "Tất cả vai trò"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none border-border bg-background text-foreground shadow-lg">
              <DropdownMenuLabel className="text-foreground font-semibold uppercase text-xs tracking-wider">Lọc theo vai trò</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => handleRoleFilter("")}
                className={`text-muted-foreground hover:bg-muted ${!selectedRole ? "bg-muted font-medium" : ""}`}
              >
                Tất cả vai trò
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilter("admin")}
                className={`text-muted-foreground hover:bg-muted ${selectedRole === "admin" ? "bg-muted font-medium" : ""}`}
              >
                Quản trị viên
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilter("user")}
                className={`text-muted-foreground hover:bg-muted ${selectedRole === "user" ? "bg-muted font-medium" : ""}`}
              >
                Người dùng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Verified Email Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-none border-border hover:bg-muted text-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                {selectedVerified === true
                  ? "Đã xác thực"
                  : selectedVerified === false
                    ? "Chưa xác thực"
                    : "Trạng thái email"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none border-border bg-background text-foreground shadow-lg">
              <DropdownMenuLabel className="text-foreground font-semibold uppercase text-xs tracking-wider">Lọc theo xác thực email</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(null)}
                className={`text-muted-foreground hover:bg-muted ${selectedVerified === null ? "bg-muted font-medium" : ""}`}
              >
                Tất cả trạng thái
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(true)}
                className={`text-muted-foreground hover:bg-muted ${selectedVerified === true ? "bg-muted font-medium" : ""}`}
              >
                Đã xác thực
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(false)}
                className={`text-muted-foreground hover:bg-muted ${selectedVerified === false ? "bg-muted font-medium" : ""}`}
              >
                Chưa xác thực
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-none border-border">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-muted-foreground">
            Hiển thị:
          </Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground focus:border-primary focus:ring-primary"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50 bg-muted/50">
              <TableHead className="text-foreground font-semibold">
                Người dùng
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Vai trò
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Địa chỉ
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Xác thực Email
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Ngày tạo
              </TableHead>
              <TableHead className="text-foreground font-semibold text-right">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserIcon className="h-12 w-12 mb-2 opacity-50" />
                    <div className="text-muted-foreground">Không có người dùng nào</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              alt={user?.username as string}
                              src={user?.avatar as string}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {user.username}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.roles || "user")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">
                        {getPrimaryAddress(user.addresses)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getVerifiedBadge(user.isVerifiedEmail)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-background border-border text-foreground shadow-lg"
                      >
                        <DropdownMenuLabel className="text-foreground font-semibold">
                          Thao tác
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          onClick={() => onView(user)}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => onDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-muted-foreground" />
                          Xóa người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}