"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { UsersHeader } from "@/components/admin/UserAdminPage/UsersHeader";
import { UsersStats } from "@/components/admin/UserAdminPage/UserStats";
import { UsersTable } from "@/components/admin/UserAdminPage/UserTable";
import { UserPagination } from "@/components/admin/UserAdminPage/UserPaginationControl";
import { CreateModelUser } from "@/components/admin/UserAdminPage/CreateModelUser";
import { UpdateModelUser } from "@/components/admin/UserAdminPage/UpdateModelUser";
import { ViewModelUser } from "@/components/admin/UserAdminPage/ViewModelUser";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
} from "@/features/user/userAction";
import { User } from "@/types/user";

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  // Lấy params từ URL
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlLimit = parseInt(searchParams.get("limit") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlRole = searchParams.get("role") || "";
  const urlIsVerifiedEmail = searchParams.get("isVerifiedEmail");

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [pageSize, setPageSize] = useState(urlLimit);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedRole, setSelectedRole] = useState(urlRole);
  const [selectedVerified, setSelectedVerified] = useState<string | null>(
    urlIsVerifiedEmail
  );

  const users: User[] = userState.user || [];
  const pagination = userState.pagination;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hàm mở modal tạo mới
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  // Hàm xử lý tạo user mới
  const handleCreateUser = async (userData: any) => {
    setIsCreating(true);
    try {
      const result = await dispatch(createUser(userData)).unwrap();

      // Refresh danh sách
      fetchUsers();

      setCreateModalOpen(false);
      toast.success("Tạo người dùng thành công");
    } catch (error: any) {
      console.error("Create user error:", error);
      toast.error(
        error?.message || "Lỗi khi tạo người dùng. Vui lòng thử lại."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleEditFromView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(false);
    setUpdateModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseEditModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
    setIsUpdating(false);
  };

  // Hàm lưu thay đổi
  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateUser({
          id: selectedUser._id,
          ...userData,
        })
      ).unwrap();

      // Refresh danh sách sau khi update
      fetchUsers();

      handleCloseEditModal();
      toast.success("Cập nhật người dùng thành công");
    } catch (error: any) {
      toast.error(
        error?.message || "Cập nhật người dùng thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Hàm fetch users với params hợp lệ
  const fetchUsers = () => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    }
    if (selectedRole && selectedRole.trim() !== "") {
      params.role = selectedRole.trim();
    }
    // Chỉ thêm isVerifiedEmail nếu có giá trị boolean hợp lệ
    if (selectedVerified === "true" || selectedVerified === "false") {
      params.isVerifiedEmail = selectedVerified === "true";
    }

    dispatch(getAllUsers(params));
  };

  const updateURL = (
    page: number,
    limit: number,
    search: string,
    role: string,
    isVerifiedEmail: string | null
  ) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (search && search.trim() !== "") {
      params.set("search", search);
    }
    if (role && role.trim() !== "") {
      params.set("role", role);
    }
    // Chỉ thêm isVerifiedEmail nếu có giá trị boolean hợp lệ
    if (isVerifiedEmail === "true" || isVerifiedEmail === "false") {
      params.set("isVerifiedEmail", isVerifiedEmail);
    }

    const url = `/admin/users?${params.toString()}`;
    console.log("Updating URL to:", url); // Debug log
    router.push(url, { scroll: false });
  };

  // Fetch users khi URL params thay đổi
  useEffect(() => {
    fetchUsers();
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchTerm,
    selectedRole,
    selectedVerified,
  ]);

  // Đồng bộ state với URL params
  useEffect(() => {
    setCurrentPage(urlPage);
    setPageSize(urlLimit);
    setSearchTerm(urlSearch);
    setSelectedRole(urlRole);
    setSelectedVerified(urlIsVerifiedEmail);
  }, [urlPage, urlLimit, urlSearch, urlRole, urlIsVerifiedEmail]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, pageSize, searchTerm, selectedRole, selectedVerified);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(1, size, searchTerm, selectedRole, selectedVerified);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(1, pageSize, value, selectedRole, selectedVerified);
  };

  const handleRoleFilterChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, role, selectedVerified);
  };

  const handleVerifiedFilterChange = (isVerified: boolean | null) => {
    // Convert boolean | null thành string | null
    const verifiedString = isVerified === null ? null : isVerified.toString();
    setSelectedVerified(verifiedString);
    setCurrentPage(1);
    updateURL(1, pageSize, searchTerm, selectedRole, verifiedString);
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await dispatch(deleteUser(user._id)).unwrap();

      // Refresh danh sách
      fetchUsers();

      toast.success("Xóa người dùng thành công");
    } catch (error) {
      toast.error("Xóa người dùng thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Tính toán thống kê
  const totalUsers = pagination?.totalItems || users.length;
  const verifiedUsers = users.filter((user) => user.isVerifiedEmail).length;
  const usersWithAddress = users.filter(
    (user) => user.addresses && user.addresses.length > 0
  ).length;

  // Người dùng mới (trong 7 ngày gần đây)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentUsers = users.filter((user) => {
    try {
      return new Date(user.createdAt) > oneWeekAgo;
    } catch {
      return false;
    }
  }).length;

  if (userState.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Lỗi: {userState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersHeader onOpenCreate={handleOpenCreateModal} />

      <UsersStats
        totalUsers={totalUsers}
        verifiedUsers={verifiedUsers}
        usersWithAddress={usersWithAddress}
        recentUsers={recentUsers}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Quản lý tất cả người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            searchTerm={searchTerm}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
            onRoleFilterChange={handleRoleFilterChange}
            onVerifiedFilterChange={handleVerifiedFilterChange}
            selectedRole={selectedRole}
            selectedVerified={
              selectedVerified === "true"
                ? true
                : selectedVerified === "false"
                ? false
                : null
            }
          />

          <UserPagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />

          <CreateModelUser
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onCreate={handleCreateUser}
            isLoading={isCreating}
          />

          <ViewModelUser
            open={viewModalOpen}
            onOpenChange={handleCloseModals}
            user={selectedUser}
            onEdit={handleEditFromView}
          />

          <UpdateModelUser
            open={updateModalOpen}
            onOpenChange={handleCloseEditModal}
            user={selectedUser}
            onUpdate={handleUpdateUser}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
