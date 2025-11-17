"use client";
import { MapPin, Plus, Star, Edit, Phone, Navigation, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddressDialog from "./AddressDialog";
import { useState } from "react";
import { address } from "@/types/user";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { deleteAddress } from "@/features/user/userAction"
import { toast } from "sonner";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

interface AddressTabProps {
  user: any;
}

export default function AddressTab({ user }: AddressTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

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

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      return;
    }

    setIsDeleting(addressId);
    
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      
      toast.success("Đã xóa địa chỉ thành công")
    } catch (error: any) {
      console.error("Error deleting address:", error);
      
      let errorMessage = "Không thể xóa địa chỉ. Vui lòng thử lại.";
      toast.error(errorMessage)
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 && (
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <MapPin className="h-5 w-5 text-gray-900" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sổ địa chỉ</h1>
          <p className="text-sm text-gray-600">Quản lý địa chỉ giao hàng của bạn</p>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Chưa có địa chỉ
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            Thêm địa chỉ giao hàng đầu tiên của bạn
          </p>
          <Button 
            onClick={openAddDialog} 
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm địa chỉ mới
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Địa chỉ của bạn ({addresses.length})
              </h2>
              <p className="text-xs text-gray-500">Quản lý và chỉnh sửa địa chỉ giao hàng</p>
            </div>
            <Button 
              onClick={openAddDialog} 
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
            >
              <Plus className="h-3 w-3 mr-1" />
              Thêm địa chỉ
            </Button>
          </div>

          <div className="grid gap-3">
            {addresses.map((address: Address) => (
              <Card
                key={address._id}
                className={`relative transition-all duration-200 hover:shadow-sm ${
                  address.isDefault 
                    ? 'border-gray-900 border-2 bg-gray-50' 
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {address.fullName}
                        </h4>
                        {address.isDefault && (
                          <Badge className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800 text-xs">
                            <Star className="h-2.5 w-2.5 mr-1 fill-white" />
                            Mặc định
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{address.phone}</span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Navigation className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {address.address}
                          </p>
                          <p className="text-gray-600">
                            {address.ward}, {address.district}, {address.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(address)}
                        className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs h-8 px-2"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                      
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAddress(address._id)}
                          disabled={isDeleting === address._id || isLoading}
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-xs h-8 px-2"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {isDeleting === address._id ? "Đang xóa..." : "Xóa"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <AddressDialog
        open={isDialogOpen}
        onClose={closeDialog}
        editingAddress={editingAddress}
        onSuccess={() => {}}
        user={user}
      />
    </div>
  );
}