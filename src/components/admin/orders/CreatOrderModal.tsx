"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange("customerEmail", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress">Shipping Address</Label>
            <Textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => handleChange("shippingAddress", e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="banking">
                    Bank Transfer
                  </SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add notes for the order"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
