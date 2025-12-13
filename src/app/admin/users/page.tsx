"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersStats } from "@/components/admin/users/UserStats";
import { UsersTable } from "@/components/admin/users/UserTable";
import { UserPagination } from "@/components/admin/users/UserPaginationControl";
import { CreateModelUser } from "@/components/admin/users/CreateModelUser";
import { UpdateModelUser } from "@/components/admin/users/UpdateModelUser";
import { ViewModelUser } from "@/components/admin/users/ViewModelUser";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
} from "@/features/user/userAction";
import { User, UserFilters } from "@/types/user";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  // Use URL filters hook
  const { filters, updateFilter, updateFilters } = useUrlFilters<UserFilters>({
    defaultFilters: {
      page: 1,
      limit: 10,
      search: "",
      role: "",
      isVerifiedEmail: null,
    },
    basePath: "/admin/users",
  });

  // Extract filter values
  const currentPage = Number(filters.page);
  const pageSize = Number(filters.limit);
  const searchTerm = filters.search as string;
  const selectedRole = filters.role as string;
  const selectedVerified = filters.isVerifiedEmail as boolean | null;
  const users: User[] = userState.user || [];
  const pagination = userState.pagination;
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch users with current filters
  const fetchUsers = () => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm && searchTerm.trim() !== "") {
      params.search = searchTerm.trim();
    }
    if (selectedRole && selectedRole.trim() !== "") {
      params.role = selectedRole.trim();
    }
    if (selectedVerified !== null) {
      params.isVerifiedEmail = selectedVerified;
    }

    dispatch(getAllUsers(params));
  };

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm, selectedRole, selectedVerified]);

  // ============= Event Handlers =============

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    setIsCreating(true);
    try {
      await dispatch(
        createUser(
          userData as {
            name: string;
            email: string;
            phone: string;
            roles: string;
            isVerifiedEmail: boolean;
          }
        )
      ).unwrap();
      fetchUsers();
      setCreateModalOpen(false);
      toast.success("Tạo người dùng thành công");
    } catch (error) {
      const err = error as Error;
      console.error("Create user error:", err);
      toast.error(err?.message || "Lỗi khi tạo người dùng. Vui lòng thử lại.");
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

  const handleCloseEditModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
    setIsUpdating(false);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateUser({
          id: selectedUser._id,
          ...userData,
        } as {
          username: string;
          email: string;
          id: string;
          isVerifiedEmail: boolean;
          roles: string;
        })
      ).unwrap();
      fetchUsers();
      handleCloseEditModal();
      toast.success("Cập nhật người dùng thành công");
    } catch (error) {
      const err = error as Error;
      toast.error(
        err?.message || "Cập nhật người dùng thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter handlers
  const handlePageChange = (page: number) => {
    updateFilter("page", page);
  };

  const handlePageSizeChange = (size: number) => {
    updateFilters({ limit: size, page: 1 });
  };

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const handleRoleFilterChange = (role: string) => {
    updateFilters({ role: role, page: 1 });
  };

  const handleVerifiedFilterChange = (isVerified: boolean | null) => {
    updateFilters({ isVerifiedEmail: isVerified, page: 1 });
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await dispatch(deleteUser(user._id)).unwrap();
      fetchUsers();
      toast.success("Xóa người dùng thành công");
    } catch {
      toast.error("Xóa người dùng thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Calculate stats
  const totalUsers = pagination?.totalItems || users.length;
  const verifiedUsers = users.filter((user) => user.isVerifiedEmail).length;
  const usersWithAddress = users.filter(
    (user) => user.addresses && user.addresses.length > 0
  ).length;

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
        <div className="text-destructive">Lỗi: {userState.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 no-scrollbar">
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
            isLoading={userState.isLoading}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
            onRoleFilterChange={handleRoleFilterChange}
            onVerifiedFilterChange={handleVerifiedFilterChange}
            selectedRole={selectedRole}
            selectedVerified={selectedVerified}
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
