"use client";
import { useState } from "react";
import { useChangePassword } from "@/hooks/queries/useProfile";
import { Shield, Key, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface SettingsTabProps {
  user: User;
}

export default function SettingsTab({ user }: SettingsTabProps) {
  const changePasswordMutation = useChangePassword();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.isTwoFactorEnabled || false,
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      setIsChangingPassword(false);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailVerification = async () => {
    toast.info("Email verification service is temporarily unavailable.");
  };

  const handleTwoFactorToggle = async () => {
    toast.info("Two-Factor Authentication is not yet available.");
    setTwoFactorEnabled(false);
    // setTwoFactorEnabled(false);
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const SectionHeader = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div className="mb-4">
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Security */}
        <div>
          <SectionHeader
            title="Login & Security"
            description="Manage your password and security preferences"
          />

          <div className="space-y-4">
            <div className="bg-muted/20 p-5 rounded-md border border-border/30">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">Change Password</h4>
                    <p className="text-xs text-muted-foreground">
                      Ensure your account is using a long, random password.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="pr-10 rounded-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="pr-10 rounded-sm"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pr-10 rounded-sm"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="mt-2 text-white rounded-sm"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>

            <div className="bg-muted/20 p-5 rounded-md border border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200",
                      twoFactorEnabled
                        ? "bg-green-50 text-green-600"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={() => handleTwoFactorToggle()}
                />
              </div>
            </div>

            <div className="bg-muted/20 p-5 rounded-md border border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200",
                      user?.isVerifiedEmail
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600",
                    )}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-base">
                        Email Verification
                      </h4>
                      {user?.isVerifiedEmail ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 hover:bg-green-100 h-5 px-1.5 text-[10px]"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-200 bg-amber-50 h-5 px-1.5 text-[10px]"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user?.isVerifiedEmail
                        ? "Your email is verified and secure."
                        : "Please verify your email address."}
                    </p>
                  </div>
                </div>
                {!user?.isVerifiedEmail && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailVerification}
                    className="rounded-sm"
                  >
                    Verify Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
