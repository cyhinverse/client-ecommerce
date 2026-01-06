"use client";
import {
  MapPin,
  Plus,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddressDialog from "../address/AddressDialog";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { deleteAddress, getProfile } from "@/features/user/userAction";
import { toast } from "sonner";
import { Address, AddressTabProps } from "@/types/address";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { cn } from "@/lib/utils";

export default function AddressTab({ user }: AddressTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.user);

  const addresses = user?.addresses || [];

  const openAddDialog = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSuccess = async () => {
    try {
      await dispatch(getProfile()).unwrap();
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast.error("Unable to update data");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsDeleting(addressId);

    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      await dispatch(getProfile()).unwrap();
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message ||
        "Unable to delete address. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted rounded-3xl bg-muted/20">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <MapPin className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-2">
        No addresses found
      </h3>
      <p className="text-muted-foreground mb-6 max-w-xs text-sm">
        Add a delivery address to ensure faster checkout.
      </p>
      <Button
        onClick={openAddDialog}
        className="rounded-full px-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Address
      </Button>
    </div>
  );

  const renderAddressCard = (address: Address) => (
    <div
      key={address._id}
      className={cn(
        "group relative flex flex-col md:flex-row justify-between p-6 rounded-2xl border transition-all duration-200",
        address.isDefault
          ? "border-primary bg-primary/5"
          : "border-border hover:border-foreground/20 bg-[#f7f7f7]"
      )}
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-lg tracking-tight">
            {address.fullName}
          </h4>
          {address.isDefault && (
            <Badge className="rounded-full bg-primary text-primary-foreground border-0">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Default
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
          <p className="text-foreground/80 font-medium">{address.phone}</p>
          <p>{address.address}</p>
          <p>{address.district}, {address.city}</p>
        </div>
      </div>

      <div className="mt-4 md:mt-0 md:ml-6 flex items-start gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openEditDialog(address)}
          className="rounded-full h-8 px-3 text-xs md:opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>

        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteAddress(address._id)}
            disabled={isDeleting === address._id || isLoading}
            className="rounded-full h-8 px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 md:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isDeleting === address._id ? (
                <span className="animate-pulse">Deleting...</span>
            ) : (
                <>
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Address Book</h2>
                <p className="text-muted-foreground text-sm">Manage your shipping destinations</p>
            </div>
            {addresses.length > 0 && (
                <Button onClick={openAddDialog} className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                </Button>
            )}
        </div>

        {addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid gap-4 mt-6">
            {addresses.map(renderAddressCard)}
          </div>
        )}

        <AddressDialog
          open={isDialogOpen}
          onClose={closeDialog}
          editingAddress={editingAddress}
          onSuccess={handleSuccess}
          user={user}
        />
      </div>
    </div>
  );
}

// End of file
