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
    <Badge className="bg-green-500">
      <CheckCircle className="h-3 w-3 mr-1" />
      Đã xác thực
    </Badge>
  ) : (
    <Badge variant="secondary">
      <XCircle className="h-3 w-3 mr-1" />
      Chưa xác thực
    </Badge>
  );
};

export const getRoleBadge = (roles: string) => {
  // ← Đổi thành roles
  const colors: { [key: string]: string } = {
    admin: "bg-red-100 text-red-800 border-red-200",
    user: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const roleNames: { [key: string]: string } = {
    admin: "Quản trị viên",
    user: "Người dùng",
  };

  return (
    <Badge
      variant="outline"
      className={colors[roles] || "bg-gray-100 text-gray-800 border-gray-200"}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              className="pl-9 w-[300px] bg-white border-gray-300 text-gray-900"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Role Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100"
              >
                <Shield className="h-4 w-4 mr-2 text-gray-600" />
                {selectedRole === "admin"
                  ? "Quản trị viên"
                  : selectedRole === "user"
                  ? "Người dùng"
                  : "Tất cả vai trò"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
              <DropdownMenuLabel>Lọc theo vai trò</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRoleFilter("")}
                className={!selectedRole ? "bg-gray-100" : ""}
              >
                Tất cả vai trò
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilter("admin")}
                className={selectedRole === "admin" ? "bg-gray-100" : ""}
              >
                Quản trị viên
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilter("user")}
                className={selectedRole === "user" ? "bg-gray-100" : ""}
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
                className="border-gray-300 hover:bg-gray-100"
              >
                <Mail className="h-4 w-4 mr-2 text-gray-600" />
                {selectedVerified === true
                  ? "Đã xác thực"
                  : selectedVerified === false
                  ? "Chưa xác thực"
                  : "Trạng thái email"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
              <DropdownMenuLabel>Lọc theo xác thực email</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(null)}
                className={selectedVerified === null ? "bg-gray-100" : ""}
              >
                Tất cả trạng thái
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(true)}
                className={selectedVerified === true ? "bg-gray-100" : ""}
              >
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Đã xác thực
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(false)}
                className={selectedVerified === false ? "bg-gray-100" : ""}
              >
                <XCircle className="h-4 w-4 mr-2 text-gray-600" />
                Chưa xác thực
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 hover:bg-gray-100"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-gray-700">
            Hiển thị:
          </Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-medium">
                Người dùng
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Vai trò
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Địa chỉ
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Xác thực Email
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Ngày tạo
              </TableHead>
              <TableHead className="text-gray-600 font-medium text-right">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UserIcon className="h-12 w-12 mb-2 opacity-50" />
                    <div>Không có người dùng nào</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.username}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.roles || "user")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
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
                    <div className="flex items-center gap-1 text-gray-700">
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
                          className="hover:bg-gray-200"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-gray-200 text-gray-900"
                      >
                        <DropdownMenuLabel className="text-gray-900">
                          Thao tác
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onView(user)}
                          className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4 mr-2 text-gray-600" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4 mr-2 text-gray-600" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => onDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
