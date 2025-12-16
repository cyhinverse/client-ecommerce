import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
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
import { Address } from "@/types/address";
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
import SpinnerLoading from "@/components/common/SpinnerLoading";

interface UsersTableProps {
  users: User[];
  searchTerm: string;
  pageSize: number;
  isLoading?: boolean;
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
      Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-muted-foreground text-muted-foreground"
    >
      <XCircle className="h-3 w-3 mr-1" />
      Unverified
    </Badge>
  );
};

export const getRoleBadge = (roles: string) => {
  const colors: { [key: string]: string } = {
    admin: "bg-primary text-primary-foreground border-primary",
    user: "bg-muted text-foreground border-border",
  };

  const roleNames: { [key: string]: string } = {
    admin: "Admin",
    user: "User",
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
  return new Date(date).toLocaleDateString("en-US");
};

export function UsersTable({
  users,
  searchTerm,
  pageSize,
  isLoading = false,
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
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
       onSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleRoleFilter = (role: string) => {
    onRoleFilterChange?.(role);
  };

  const handleVerifiedFilter = (isVerified: boolean | null) => {
    onVerifiedFilterChange?.(isVerified);
  };

  const getPrimaryAddress = (addresses: Address[]) => {
    if (!addresses || addresses.length === 0) return "No address";
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
              placeholder="Search users..."
              value={localSearch}
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
                  ? "Admin"
                  : selectedRole === "user"
                  ? "User"
                  : "All Roles"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none border-border bg-background text-foreground shadow-lg">
              <DropdownMenuLabel className="text-foreground font-semibold uppercase text-xs tracking-wider">
                Filter by Role
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                action={handleRoleFilter}
                className={`text-muted-foreground hover:bg-muted ${
                  !selectedRole ? "bg-muted font-medium" : ""
                }`}
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilter("admin")}
                className={`text-muted-foreground hover:bg-muted ${
                  selectedRole === "admin" ? "bg-muted font-medium" : ""
                }`}
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleFilter("user")}
                className={`text-muted-foreground hover:bg-muted ${
                  selectedRole === "user" ? "bg-muted font-medium" : ""
                }`}
              >
                User
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
                  ? "Verified"
                  : selectedVerified === false
                  ? "Unverified"
                  : "Email Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none border-border bg-background text-foreground shadow-lg">
              <DropdownMenuLabel className="text-foreground font-semibold uppercase text-xs tracking-wider">
                Filter by Email Verification
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(null)}
                className={`text-muted-foreground hover:bg-muted ${
                  selectedVerified === null ? "bg-muted font-medium" : ""
                }`}
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(true)}
                className={`text-muted-foreground hover:bg-muted ${
                  selectedVerified === true ? "bg-muted font-medium" : ""
                }`}
              >
                Verified
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleVerifiedFilter(false)}
                className={`text-muted-foreground hover:bg-muted ${
                  selectedVerified === false ? "bg-muted font-medium" : ""
                }`}
              >
                Unverified
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-none border-border"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-muted-foreground">
            Show:
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
      <div className="rounded-md border border-border bg-background shadow-sm overflow-x-auto no-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50 bg-muted/50">
              <TableHead className="text-foreground font-semibold">
                User
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Role
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Address
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Email Verified
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Created At
              </TableHead>
              <TableHead className="text-foreground font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <SpinnerLoading />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserIcon className="h-12 w-12 mb-2 opacity-50" />
                    <div className="text-muted-foreground">
                      No users found
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className={`border-border hover:bg-muted/50 ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
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
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          onClick={() => onView(user)}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => onDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-muted-foreground" />
                          Delete User
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
