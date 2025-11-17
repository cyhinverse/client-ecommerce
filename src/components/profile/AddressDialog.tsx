"use client";
import { useState, useEffect } from "react";
import { createAddress, updateAddress, getProfile } from "@/features/user/userAction";
import { useAppDispatch } from "@/hooks/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

interface AddressDialogProps {
  open: boolean;
  onClose: () => void;
  editingAddress: Address | null;
  onSuccess: () => void;
  user?: any;
}

// Mock data for cities, districts, wards
const cities = [
  { id: "hcm", name: "Hồ Chí Minh" },
  { id: "hn", name: "Hà Nội" },
  { id: "dn", name: "Đà Nẵng" },
];

const districts = [
  { id: "q1", name: "Quận 1", cityId: "hcm" },
  { id: "q3", name: "Quận 3", cityId: "hcm" },
  { id: "qbt", name: "Quận Bình Thạnh", cityId: "hcm" },
  { id: "ch", name: "Quận Cầu Giấy", cityId: "hn" },
  { id: "hd", name: "Quận Hải Châu", cityId: "dn" },
];

const wards = [
  { id: "p1", name: "Phường Bến Nghé", districtId: "q1" },
  { id: "p2", name: "Phường Bến Thành", districtId: "q1" },
  { id: "p3", name: "Phường Võ Thị Sáu", districtId: "q3" },
  { id: "p4", name: "Phường 14", districtId: "qbt" },
];

export default function AddressDialog({
  open,
  onClose,
  editingAddress,
  onSuccess,
  user
}: AddressDialogProps) {
  const dispatch = useAppDispatch();
  
  // KHỞI TẠO STATE VỚI GIÁ TRỊ MẶC ĐỊNH RÕ RÀNG
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    isDefault: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when dialog opens or editingAddress changes
  useEffect(() => {
    if (editingAddress) {
      setAddressForm({
        fullName: editingAddress.fullName || "",
        phone: editingAddress.phone || "",
        address: editingAddress.address || "",
        city: editingAddress.city || "",
        district: editingAddress.district || "",
        ward: editingAddress.ward || "",
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      setAddressForm({
        fullName: user?.username || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        district: "",
        ward: "",
        isDefault: (user?.addresses?.length || 0) === 0,
      });
    }
  }, [editingAddress, user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Tạo object chỉ chứa các trường mà validator yêu cầu
      const addressDataToSend = {
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        address: addressForm.address,
        city: addressForm.city,
        district: addressForm.district,
        ward: addressForm.ward,
        // KHÔNG gửi isDefault vì validator không có
      };

      if (editingAddress) {
        await dispatch(updateAddress({
          addressId: editingAddress._id,
          addressData: addressDataToSend
        })).unwrap();
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await dispatch(createAddress(addressDataToSend)).unwrap();
        toast.success("Thêm địa chỉ thành công");
      }

      // QUAN TRỌNG: Gọi lại getProfile để cập nhật dữ liệu mới nhất
      await dispatch(getProfile()).unwrap();
      
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Address operation error:', error);
      // Hiển thị lỗi chi tiết từ server nếu có
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      toast.error(`${editingAddress ? "Cập nhật địa chỉ thất bại" : "Thêm địa chỉ thất bại"}: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setTimeout(() => {
      setAddressForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        isDefault: false,
      });
    }, 300);
  };

  const filteredDistricts = districts.filter(district =>
    district.cityId === addressForm.city
  );

  const filteredWards = wards.filter(ward =>
    ward.districtId === addressForm.district
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
          <DialogDescription>
            {editingAddress
              ? "Cập nhật thông tin địa chỉ của bạn"
              : "Thêm địa chỉ giao hàng mới"
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="text"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ cụ thể</Label>
              <Input
                id="address"
                type="text"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                placeholder="Số nhà, tên đường"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                <Select
                  value={addressForm.city}
                  onValueChange={(value) => setAddressForm({ ...addressForm, city: value, district: "", ward: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh/thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Select
                  value={addressForm.district}
                  onValueChange={(value) => setAddressForm({ ...addressForm, district: value, ward: "" })}
                  disabled={!addressForm.city}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Select
                  value={addressForm.ward}
                  onValueChange={(value) => setAddressForm({ ...addressForm, ward: value })}
                  disabled={!addressForm.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredWards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={addressForm.isDefault}
                onCheckedChange={(checked) => setAddressForm({ ...addressForm, isDefault: checked })}
              />
              <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}