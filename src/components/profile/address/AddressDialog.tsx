"use client";
import { useState, useEffect } from "react";
import { useCreateAddress, useUpdateAddress } from "@/hooks/queries/useProfile";
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
import { AddressDialogProps, AddressFormData } from "@/types/address";
import { MapPin, Navigation, Loader2, Home } from "lucide-react";

export default function AddressDialog({
  open,
  onClose,
  editingAddress,
  onSuccess,
  user,
}: AddressDialogProps) {
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();

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
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);

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
    const address = fullAddress
      .replace(/,\s*Việt Nam$/, "")
      .replace(/,\s*Vietnam$/i, "");

    // Mẫu regex để phân tích địa chỉ Việt Nam
    const patterns = [
      // Pattern cho địa chỉ dạng: Ấp X, Xã Y, Huyện Z, Thành phố/Tỉnh ABC
      /(.*?),\s*(Phường|Xã|Thị trấn)\s*(.*?),\s*(Quận|Huyện|Thị xã|Thành phố)\s*(.*?),\s*(Tỉnh|Thành phố)\s*(.*)/,
      // Pattern cho địa chỉ dạng: Số nhà, Đường, Phường, Quận, Thành phố
      /(.*?),\s*(Phường|Xã)\s*(.*?),\s*(Quận|Huyện)\s*(.*?),\s*(.*)/,
      // Pattern đơn giản hơn
      /(.*?),\s*(.*?),\s*(.*?),\s*(.*)/,
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
          const parts = address.split(",").map((part) => part.trim());
          if (parts.length >= 4) {
            detailedAddress = parts.slice(0, parts.length - 3).join(", ");
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
      const parts = address.split(",").map((part) => part.trim());

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
        detailedAddress = parts
          .slice(0, Math.max(0, parts.length - 3))
          .join(", ");
      }
    }

    // Chuẩn hóa tên thành phố
    if (
      city.includes("Hồ Chí Minh") ||
      city.includes("TP.HCM") ||
      city.includes("TP HCM")
    ) {
      city = "Thành phố Hồ Chí Minh";
    } else if (city.includes("Hà Nội")) {
      city = "Thành phố Hà Nội";
    } else if (city.includes("Đà Nẵng")) {
      city = "Thành phố Đà Nẵng";
    }

    return {
      detailedAddress: detailedAddress || address,
      city,
      district,
      ward,
    };
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support geolocation");
      return;
    }

    if (locationPermissionDenied) {
      toast.info("Please grant location permission in your browser settings");
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
            throw new Error("Unable to fetch address information");
          }

          const data = await response.json();

          if (data && data.display_name) {
            const fullAddress = data.display_name;
            const parsedAddress = parseAndFillAddress(fullAddress);

            setAddressForm((prev) => ({
              ...prev,
              address: parsedAddress.detailedAddress,
              city: parsedAddress.city,
              district: parsedAddress.district,
              ward: parsedAddress.ward,
            }));

            toast.success("Location updated");
          } else {
            toast.error("Address information not found for this location");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          toast.error("Unable to fetch address from current location");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationPermissionDenied(true);
            toast.error("You denied location access");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out");
            break;
          default:
            toast.error("Unable to get current location");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // CHỈ VALIDATE CÁC TRƯỜNG TỐI THIỂU
    if (!addressForm.address.trim()) {
      toast.error("Please enter address");
      setIsSubmitting(false);
      return;
    }

    try {
      const addressDataToSend = {
        fullName: addressForm.fullName.trim() || "Customer",
        phone: addressForm.phone.trim() || "Not updated",
        address: addressForm.address.trim(),
        city: addressForm.city.trim(),
        district: addressForm.district.trim(),
        ward: addressForm.ward.trim(),
        isDefault: addressForm.isDefault,
      };

      if (editingAddress) {
        await updateAddressMutation.mutateAsync({
          addressId: editingAddress._id,
          ...addressDataToSend,
        });
        toast.success("Address updated successfully");
      } else {
        await createAddressMutation.mutateAsync(addressDataToSend);
        toast.success("Address added successfully");
      }

      onClose();
      onSuccess();
    } catch (error: unknown) {
      console.error("Address operation error:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      toast.error(
        `${
          editingAddress ? "Failed to update address" : "Failed to add address"
        }: ${errorMessage}`
      );
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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 border-b bg-muted/20">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {editingAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            Fill in your delivery details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Contact Info
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="0123 456 789"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Address Details
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Navigation className="h-3.5 w-3.5 mr-1.5" />
                )}
                Use Current Location
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Street Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="House no., Street name"
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City/Province</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  placeholder="District"
                  value={addressForm.district}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, district: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  placeholder="Ward"
                  value={addressForm.ward}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, ward: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label
                  htmlFor="isDefault"
                  className="font-medium cursor-pointer"
                >
                  Set as Default Address
                </Label>
                <p className="text-xs text-muted-foreground">
                  This address will be selected by default
                </p>
              </div>
            </div>
            <Switch
              id="isDefault"
              checked={addressForm.isDefault}
              onCheckedChange={(checked) =>
                setAddressForm({ ...addressForm, isDefault: checked })
              }
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
