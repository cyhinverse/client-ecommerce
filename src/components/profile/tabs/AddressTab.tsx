import {
  MapPin,
  Plus,
  Star,
  Edit,
  Phone,
  Navigation,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddressDialog from "../address/AddressDialog";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { deleteAddress, getProfile } from "@/features/user/userAction";
import { toast } from "sonner";
import { Address, AddressTabProps } from "@/types/address";
import SpinnerLoading from "@/components/common/SpinnerLoading";

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
    <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
      <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-base font-semibold text-foreground mb-1">
        No addresses yet
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
        Add your first delivery address
      </p>
      <Button
        onClick={openAddDialog}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add New Address
      </Button>
    </div>
  );

  const renderAddressCard = (address: Address) => (
    <Card
      key={address._id}
      className={`relative transition-all duration-200 hover:shadow-sm ${
        address.isDefault
          ? "border-primary border-2 bg-muted/50"
          : "border-border"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground text-base">
                {address.fullName}
              </h4>
              {address.isDefault && (
                <Badge className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 text-xs">
                  <Star className="h-2.5 w-2.5 mr-1 fill-primary-foreground" />
                  Default
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Phone className="h-3.5 w-3.5" />
              <span>{address.phone}</span>
            </div>

            <div className="flex items-start gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">{address.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(address)}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs h-8 px-2"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>

            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteAddress(address._id)}
                disabled={isDeleting === address._id || isLoading}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs h-8 px-2"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting === address._id ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 relative min-h-[200px]">
      {isLoading && <SpinnerLoading className="absolute inset-0 m-auto" />}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        {addresses.length === 0 && (
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-muted rounded-full">
                <MapPin className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-foreground">Address Book</h1>
            <p className="text-sm text-muted-foreground">
              Manage your delivery addresses
            </p>
          </div>
        )}

        {addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Your Addresses ({addresses.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Manage and edit delivery addresses
                </p>
              </div>
              <Button
                onClick={openAddDialog}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Address
              </Button>
            </div>

            <div className="grid gap-3">{addresses.map(renderAddressCard)}</div>
          </>
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
