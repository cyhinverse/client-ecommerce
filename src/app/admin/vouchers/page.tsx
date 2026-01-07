"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Search, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/api/api";
import { toast } from "sonner";
import { format } from "date-fns";

interface Voucher {
  _id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minOrderValue: number;
  maxValue?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  scope: "platform" | "shop";
  shop?: { _id: string; name: string };
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "percentage" as "percentage" | "fixed_amount",
    value: 0,
    minOrderValue: 0,
    maxValue: 0,
    usageLimit: 100,
    startDate: "",
    endDate: "",
  });

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/vouchers");
      const data = response.data.data;
      // Handle paginated response
      setVouchers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
      toast.error("Failed to load vouchers");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = async () => {
    if (!formData.code || !formData.name || !formData.value || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsCreating(true);
    try {
      await instance.post("/vouchers", {
        ...formData,
        scope: "platform",
      });
      toast.success("Voucher created successfully");
      setCreateModalOpen(false);
      setFormData({
        code: "",
        name: "",
        type: "percentage",
        value: 0,
        minOrderValue: 0,
        maxValue: 0,
        usageLimit: 100,
        startDate: "",
        endDate: "",
      });
      fetchVouchers();
    } catch (error) {
      console.error("Failed to create voucher:", error);
      toast.error("Failed to create voucher");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voucher?")) return;
    try {
      await instance.delete(`/vouchers/${id}`);
      toast.success("Voucher deleted");
      fetchVouchers();
    } catch (error) {
      console.error("Failed to delete voucher:", error);
      toast.error("Failed to delete voucher");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isUpcoming = (startDate: string) => new Date(startDate) > new Date();

  const getStatusBadge = (voucher: Voucher) => {
    if (!voucher.isActive) {
      return <Badge className="bg-gray-500/10 text-gray-600 border-0">Inactive</Badge>;
    }
    if (isExpired(voucher.endDate)) {
      return <Badge className="bg-red-500/10 text-red-600 border-0">Expired</Badge>;
    }
    if (isUpcoming(voucher.startDate)) {
      return <Badge className="bg-blue-500/10 text-blue-600 border-0">Upcoming</Badge>;
    }
    return <Badge className="bg-green-500/10 text-green-600 border-0">Active</Badge>;
  };

  const filteredVouchers = vouchers.filter((v) =>
    v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const activeVouchers = vouchers.filter(
    (v) => v.isActive && !isExpired(v.endDate) && !isUpcoming(v.startDate)
  ).length;
  const totalUsed = vouchers.reduce((sum, v) => sum + v.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vouchers</h1>
          <p className="text-sm text-muted-foreground">Manage discount vouchers</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-xl gap-2"
        >
          <Plus className="h-4 w-4" /> Create Voucher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Vouchers", value: vouchers.length, color: "text-foreground" },
          { label: "Active Now", value: activeVouchers, color: "text-green-600" },
          { label: "Total Used", value: totalUsed, color: "text-purple-600" },
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
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl border-0 bg-white dark:bg-black/20"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredVouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No vouchers found
                </TableCell>
              </TableRow>
            ) : (
              filteredVouchers.map((voucher) => (
                <TableRow key={voucher._id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {voucher.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyCode(voucher.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#E53935]">
                      {voucher.type === "percentage"
                        ? `${voucher.value}%`
                        : `${voucher.value.toLocaleString()}đ`}
                    </span>
                    {voucher.maxValue && voucher.type === "percentage" && (
                      <span className="text-xs text-muted-foreground block">
                        Max: {voucher.maxValue.toLocaleString()}đ
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {voucher.usedCount} / {voucher.usageLimit}
                    </span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-[#E53935] rounded-full"
                        style={{
                          width: `${Math.min(100, (voucher.usedCount / voucher.usageLimit) * 100)}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {format(new Date(voucher.startDate), "dd/MM/yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      to {format(new Date(voucher.endDate), "dd/MM/yyyy")}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(voucher)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(voucher._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
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

      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Voucher Code</Label>
              <Input
                placeholder="e.g. SALE20"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Voucher Name</Label>
              <Input
                placeholder="e.g. Summer Sale 20%"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as "percentage" | "fixed_amount" })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount (đ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Order Value</Label>
                <Input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-xl"
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
