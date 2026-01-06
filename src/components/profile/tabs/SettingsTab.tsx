"use client";
import { useState } from "react";
import {
  changePassword,
  //   verifyEmail,
  //   enableTwoFactor,
  //   verifyTwoFactor,
} from "@/features/user/userAction";
import { useAppDispatch } from "@/hooks/hooks";
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
  const dispatch = useAppDispatch();
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
    user?.isTwoFactorEnabled || false
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
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
      await dispatch(
        changePassword({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      ).unwrap();

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
    // try {
    //   await dispatch(verifyEmail()).unwrap();
    //   toast.success(
    //     "Verification email sent. Please check your inbox."
    //   );
    // } catch (error: unknown) {
    //   const err = error as { response?: { data?: { message?: string } } };
    //   const errorMessage =
    //     err.response?.data?.message || "Failed to send verification email";
    //   toast.error(errorMessage);
    // }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    toast.info("Two-Factor Authentication is not yet available.");
    setTwoFactorEnabled(false);
    // if (enabled) {
    //   try {
    //     const result = await dispatch(enableTwoFactor()).unwrap();
    //     if (result.success) {
    //       setShowVerificationInput(true);
    //       toast.success("Scan the QR code with your authenticator app");
    //     }
    //   } catch (error: unknown) {
    //     const err = error as { response?: { data?: { message?: string } } };
    //     const errorMessage =
    //       err.response?.data?.message || "Failed to enable 2-Factor Authentication";
    //     toast.error(errorMessage);
    //   }
    // } else {
    //   setTwoFactorEnabled(false);
    //   toast.success("2-Factor Authentication disabled");
    // }
  };

  const handleVerifyTwoFactor = async () => {
    toast.info("Two-Factor Authentication is not yet available.");
    // if (verificationCode.length !== 6) {
    //   toast.error("Verification code must be 6 digits");
    //   return;
    // }

    // try {
    //   const result = await dispatch(verifyTwoFactor(verificationCode)).unwrap();
    //   if (result.success) {
    //     setTwoFactorEnabled(true);
    //     setShowVerificationInput(false);
    //     setVerificationCode("");
    //     toast.success("2-Factor Authentication enabled successfully");
    //   }
    // } catch (error: unknown) {
    //   const err = error as { response?: { data?: { message?: string } } };
    //   const errorMessage =
    //     err.response?.data?.message || "Invalid verification code";
    //   toast.error(errorMessage);
    // }
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
    <div className="mb-6">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="space-y-12">
        {/* Account Security */}
        <div>
          <SectionHeader
            title="Login & Security"
            description="Manage your password and security preferences"
          />

          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-xs text-muted-foreground">
                      Ensure your account is using a long, random password.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
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
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
                      <Label htmlFor="newPassword">New Password</Label>
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
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
                  className="mt-2 text-white"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                      twoFactorEnabled
                        ? "bg-green-50 text-green-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                />
              </div>

              {showVerificationInput && (
                <div className="mt-6 p-4 bg-background rounded-xl border border-border animate-in slide-in-from-top-2">
                  <Label htmlFor="verificationCode" className="mb-2 block">
                    Enter the 6-digit code from your app
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="000 000"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      className="font-mono tracking-widest text-center text-lg max-w-[200px]"
                    />
                    <Button
                      onClick={handleVerifyTwoFactor}
                      disabled={verificationCode.length !== 6}
                    >
                      Verify Code
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                      user?.isVerifiedEmail
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600"
                    )}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Email Verification</h4>
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
