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
import { toast } from "sonner";
import { AddressDialogProps, AddressFormData, Address } from "@/types/address";



export default function AddressDialog({
  open,
  onClose,
  editingAddress,
  onSuccess,
  user
}: AddressDialogProps) {
  const dispatch = useAppDispatch();

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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

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

  // Hàm phân tích địa chỉ và điền vào các trường phù hợp
  const parseAndFillAddress = (fullAddress: string) => {
    const address = fullAddress.replace(/,\s*Việt Nam$/, "").replace(/,\s*Vietnam$/i, "");

    // Mẫu regex để phân tích địa chỉ Việt Nam
    const patterns = [
      // Pattern cho địa chỉ dạng: Ấp X, Xã Y, Huyện Z, Thành phố/Tỉnh ABC
      /(.*?),\s*(Phường|Xã|Thị trấn)\s*(.*?),\s*(Quận|Huyện|Thị xã|Thành phố)\s*(.*?),\s*(Tỉnh|Thành phố)\s*(.*)/,
      // Pattern cho địa chỉ dạng: Số nhà, Đường, Phường, Quận, Thành phố
      /(.*?),\s*(Phường|Xã)\s*(.*?),\s*(Quận|Huyện)\s*(.*?),\s*(.*)/,
      // Pattern đơn giản hơn
      /(.*?),\s*(.*?),\s*(.*?),\s*(.*)/
    ];

    let city = "";
    let district = "";
    let ward = "";
    let detailedAddress = address;

    for (const pattern of patterns) {
      const match = address.match(pattern);
      if (match) {
        if (pattern === patterns[0]) {
          // Pattern chi tiết
          detailedAddress = match[1].trim();
          ward = `${match[2]} ${match[3]}`.trim();
          district = `${match[4]} ${match[5]}`.trim();
          city = `${match[6]} ${match[7]}`.trim();
        } else if (pattern === patterns[1]) {
          // Pattern trung bình
          detailedAddress = match[1].trim();
          ward = `${match[2]} ${match[3]}`.trim();
          district = `${match[4]} ${match[5]}`.trim();
          city = match[6].trim();
        } else {
          // Pattern đơn giản - chia thành 4 phần
          const parts = address.split(',').map(part => part.trim());
          if (parts.length >= 4) {
            detailedAddress = parts.slice(0, parts.length - 3).join(', ');
            ward = parts[parts.length - 3];
            district = parts[parts.length - 2];
            city = parts[parts.length - 1];
          }
        }
        break;
      }
    }

    // Nếu không phân tích được bằng regex, thử phân tích thủ công
    if (!city) {
      const parts = address.split(',').map(part => part.trim());

      if (parts.length > 0) {
        // Phần cuối cùng thường là thành phố/tỉnh
        city = parts[parts.length - 1];

        if (parts.length > 1) {
          // Phần trước đó thường là quận/huyện
          district = parts[parts.length - 2];
        }

        if (parts.length > 2) {
          // Phần trước nữa thường là phường/xã
          ward = parts[parts.length - 3];
        }

        // Phần còn lại là địa chỉ chi tiết
        detailedAddress = parts.slice(0, Math.max(0, parts.length - 3)).join(', ');
      }
    }

    // Chuẩn hóa tên thành phố
    if (city.includes('Hồ Chí Minh') || city.includes('TP.HCM') || city.includes('TP HCM')) {
      city = 'Thành phố Hồ Chí Minh';
    } else if (city.includes('Hà Nội')) {
      city = 'Thành phố Hà Nội';
    } else if (city.includes('Đà Nẵng')) {
      city = 'Thành phố Đà Nẵng';
    }

    return {
      detailedAddress: detailedAddress || address,
      city,
      district,
      ward
    };
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ lấy vị trí");
      return;
    }

    if (locationPermissionDenied) {
      toast.info("Vui lòng cấp quyền vị trí trong cài đặt trình duyệt của bạn");
      return;
    }

    setIsGettingLocation(true);
    setLocationPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=vi`
          );

          if (!response.ok) {
            throw new Error("Không thể lấy thông tin địa chỉ");
          }

          const data = await response.json();

          if (data && data.display_name) {
            const fullAddress = data.display_name;
            const parsedAddress = parseAndFillAddress(fullAddress);

            setAddressForm(prev => ({
              ...prev,
              address: parsedAddress.detailedAddress,
              city: parsedAddress.city,
              district: parsedAddress.district,
              ward: parsedAddress.ward
            }));

            toast.success("Đã lấy và tự động điền địa chỉ từ vị trí hiện tại");
          } else {
            toast.error("Không tìm thấy thông tin địa chỉ cho vị trí này");
          }
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
          toast.error("Không thể lấy địa chỉ từ vị trí hiện tại");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationPermissionDenied(true);
            toast.error("Bạn đã từ chối cấp quyền truy cập vị trí");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Thông tin vị trí không khả dụng");
            break;
          case error.TIMEOUT:
            toast.error("Yêu cầu lấy vị trí đã hết thời gian chờ");
            break;
          default:
            toast.error("Không thể lấy vị trí hiện tại");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // CHỈ VALIDATE CÁC TRƯỜNG TỐI THIỂU
    if (!addressForm.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      setIsSubmitting(false);
      return;
    }

    try {
      const addressDataToSend = {
        fullName: addressForm.fullName.trim() || "Khách hàng",
        phone: addressForm.phone.trim() || "Chưa cập nhật",
        address: addressForm.address.trim(),
        city: addressForm.city.trim(),
        district: addressForm.district.trim(),
        ward: addressForm.ward.trim(),
        isDefault: addressForm.isDefault,
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

      await dispatch(getProfile()).unwrap();

      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Address operation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      toast.error(`${editingAddress ? "Cập nhật địa chỉ thất bại" : "Thêm địa chỉ thất bại"}: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setLocationPermissionDenied(false);
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
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
          <div className="space-y-5 py-2">
            {/* Địa chỉ cụ thể với nút lấy vị trí hiện tại - TRƯỜNG DUY NHẤT BẮT BUỘC */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Địa chỉ cụ thể <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="h-8 text-xs"
                >
                  {isGettingLocation ? "📍 Đang lấy vị trí..." : "📍 Lấy vị trí hiện tại"}
                </Button>
              </div>
              <Input
                type="text"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                placeholder="Số nhà, tên đường, địa chỉ chi tiết"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Địa chỉ là thông tin bắt buộc để có thể giao hàng
              </p>
            </div>

            {/* Họ tên và Số điện thoại - KHÔNG BẮT BUỘC */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                <span>Họ và tên (tùy chọn)</span>
                <span>Số điện thoại (tùy chọn)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className="h-10"
                />
                <Input
                  type="text"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="VD: 0912345678"
                  className="h-10"
                />
              </div>
            </div>

            {/* Tỉnh/Thành phố, Quận/Huyện, Phường/Xã - TỰ ĐỘNG ĐIỀN KHI LẤY VỊ TRÍ */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Thông tin khu vực (tự động điền khi lấy vị trí)
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Tỉnh/Thành phố"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    placeholder="Quận/Huyện"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    value={addressForm.ward}
                    onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                    placeholder="Phường/Xã"
                    className="h-10"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Các trường này sẽ được tự động điền khi sử dụng tính năng lấy vị trí hiện tại
              </p>
            </div>

            {/* Đặt làm địa chỉ mặc định */}
            <div className="flex items-center space-x-3 pt-2">
              <Switch
                id="isDefault"
                checked={addressForm.isDefault}
                onCheckedChange={(checked) => setAddressForm({ ...addressForm, isDefault: checked })}
              />
              <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                Đặt làm địa chỉ mặc định
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 px-6"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6"
            >
              {isSubmitting ? "Đang xử lý..." : editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}