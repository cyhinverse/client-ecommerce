"use client";

import { useEffect, useState } from "react";
import { Store, Search, MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import instance from "@/api/api";
import { toast } from "sonner";

interface Shop {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  owner: { _id: string; username: string; email: string };
  status: "pending" | "active" | "suspended";
  rating: number;
  totalProducts: number;
  totalOrders: number;
  createdAt: string;
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/shops/admin/all");
      const data = response.data.data;
      // Handle paginated response
      setShops(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      toast.error("Failed to load shops");
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleStatusChange = async (shopId: string, newStatus: string) => {
    try {
      await instance.put(`/shops/admin/${shopId}/status`, { status: newStatus });
      toast.success(`Shop status updated to ${newStatus}`);
      fetchShops();
    } catch (error) {
      console.error("Failed to update shop status:", error);
      toast.error("Failed to update shop status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-0">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-0">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-500/10 text-red-600 border-0">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalShops = shops.length;
  const activeShops = shops.filter((s) => s.status === "active").length;
  const pendingShops = shops.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shops Management</h1>
          <p className="text-sm text-muted-foreground">Manage all registered shops</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Shops", value: totalShops, color: "text-foreground" },
          { label: "Active", value: activeShops, color: "text-green-600" },
          { label: "Pending Approval", value: pendingShops, color: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#f7f7f7] dark:bg-[#1C1C1E] overflow-hidden">
        <div className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl border-0 bg-white dark:bg-black/20"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Shop</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredShops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No shops found
                </TableCell>
              </TableRow>
            ) : (
              filteredShops.map((shop) => (
                <TableRow key={shop._id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                        {shop.logo ? (
                          <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Store className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{shop.name}</p>
                        <p className="text-xs text-muted-foreground">{shop.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{shop.owner?.username || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{shop.owner?.email}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(shop.status)}</TableCell>
                  <TableCell className="text-center">{shop.totalProducts || 0}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-amber-500">★</span> {shop.rating?.toFixed(1) || "0.0"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        {shop.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(shop._id, "active")}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                          </DropdownMenuItem>
                        )}
                        {shop.status === "active" && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(shop._id, "suspended")}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" /> Suspend
                          </DropdownMenuItem>
                        )}
                        {shop.status === "suspended" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(shop._id, "active")}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Reactivate
                          </DropdownMenuItem>
                        )}
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
