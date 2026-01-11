"use client";
import { useUploadAvatar } from "@/hooks/queries/useProfile";
import { useState } from "react";
import Image from "next/image";
import { Plus, User, Mail, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Address, ProfileTabProps } from "@/types/address";

export default function ProfileTab({ user }: ProfileTabProps) {
  const uploadAvatarMutation = useUploadAvatar();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleUploadAvatar = () => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.onchange = async () => {
      const selectedFile = file.files?.item(0);
      if (!selectedFile) return;

      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      try {
        await uploadAvatarMutation.mutateAsync(formData);
        toast.success("Profile picture updated successfully");
      } catch {
        toast.error("Failed to update profile picture");
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    file.click();
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full ring-2 ring-border overflow-hidden transition-transform duration-200 group-hover:scale-105 relative">
            <Image
              src={user.avatar || "/placeholder-avatar.jpg"}
              alt={user.username}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <Button
            size="icon"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-sm bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
            onClick={handleUploadAvatar}
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {user.username}
          </h2>
          <p className="text-muted-foreground text-sm">
            Member since {new Date(user.createdAt).getFullYear()}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">
        <InfoRow
          icon={User}
          label="Username"
          value={user.username}
          sublabel="Your display name visible to other users"
        />

        <InfoRow
          icon={Mail}
          label="Email Address"
          value={user.email}
          sublabel="Used for sign in and notifications"
          action={
            user.isVerifiedEmail ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 px-2 py-0.5 h-5 text-[10px]"
              >
                <Check className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] h-5 px-2">
                Unverified
              </Badge>
            )
          }
        />

        <InfoRow
          icon={MapPin}
          label="Default Address"
          value={
            user.addresses && user.addresses.length > 0
              ? `${
                  user.addresses.find((addr: Address) => addr.isDefault)
                    ?.district || user.addresses[0]?.district
                }, ${
                  user.addresses.find((addr: Address) => addr.isDefault)
                    ?.city || user.addresses[0]?.city
                }`
              : "No address set"
          }
          sublabel={
            user.addresses && user.addresses.length > 0
              ? "Primary delivery location"
              : "Add an address to speed up checkout"
          }
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
  action?: React.ReactNode;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
  sublabel,
  action,
}: InfoRowProps) => (
  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md transition-colors duration-200 hover:bg-muted">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{value}</p>
          {action}
        </div>
        {sublabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  </div>
);
