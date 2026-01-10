"use client";

import { useState, useEffect } from "react";
import { Shield, Users, History, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RESOURCES, PERMISSIONS } from "@/constants/permissions";
import {
  getAllPermissions,
  getRolePermissions,
  getAuditLogs,
  type AuditLogEntry,
} from "@/api/permission";

export default function AdminPermissionsPage() {
  const [loading, setLoading] = useState(true);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [permsData, rolesData, logs] = await Promise.all([
        getAllPermissions(),
        getRolePermissions(),
        getAuditLogs({ limit: 50 }),
      ]);
      // Extract permissions array from response
      setAllPermissions(permsData?.permissions || []);
      setRolePermissions(rolesData?.rolePermissions || {});
      setAuditLogs(logs?.logs || []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu permissions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure allPermissions is always an array before filtering
  const filteredPermissions = Array.isArray(allPermissions) 
    ? allPermissions.filter((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const groupedPermissions = Object.values(RESOURCES).reduce((acc, resource) => {
    acc[resource] = filteredPermissions.filter((p) => p.startsWith(`${resource}:`));
    return acc;
  }, {} as Record<string, string[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Permission Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý quyền hạn và xem lịch sử thay đổi
          </p>
        </div>
      </div>

      <Tabs defaultValue="permissions" className="w-full">
        <TabsList>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            All Permissions
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role Defaults
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* All Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm permission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Badge variant="outline">
              {filteredPermissions.length} permissions
            </Badge>
          </div>

          <div className="grid gap-4">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              perms.length > 0 && (
                <div key={resource} className="border rounded-lg p-4">
                  <h3 className="font-semibold capitalize mb-3 flex items-center gap-2">
                    {resource}
                    <Badge variant="secondary">{perms.length}</Badge>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((perm) => (
                      <Badge key={perm} variant="outline" className="font-mono text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </TabsContent>

        {/* Role Defaults Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(rolePermissions).map(([role, perms]) => (
              <div key={role} className="border rounded-lg p-4">
                <h3 className="font-semibold capitalize mb-3 flex items-center gap-2">
                  <Badge
                    className={
                      role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : role === "seller"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {role}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {perms.length} permissions
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {perms.map((perm) => (
                    <Badge key={perm} variant="outline" className="font-mono text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Permission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Chưa có lịch sử thay đổi permission
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="text-sm">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={log.action === "grant" ? "default" : "destructive"}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {typeof log.adminId === "object"
                          ? log.adminId.username
                          : log.adminId}
                      </TableCell>
                      <TableCell className="text-sm">
                        {typeof log.targetUserId === "object"
                          ? log.targetUserId.username
                          : log.targetUserId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.permission}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
