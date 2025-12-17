"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  notes: string;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (orderData: CreateOrderData) => void;
  isLoading: boolean;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: CreateOrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "cod",
    status: "pending",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader className="border-b border-border/50 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">Create New Order</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter order details manually
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Customer Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm font-medium">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                required
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-sm font-medium">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange("customerEmail", e.target.value)}
                required
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-sm font-medium">Phone Number</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
              required
              className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address</Label>
            <Textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => handleChange("shippingAddress", e.target.value)}
              required
              rows={3}
              className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-0 shadow-sm h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-lg">
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="banking">
                    Bank Transfer
                  </SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:ring-0 shadow-sm h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-lg">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add notes for the order"
              rows={3}
              className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all shadow-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-11 px-6 border-gray-200">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-11 px-8 bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] shadow-sm">
              {isLoading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
