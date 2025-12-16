"use client";
import { useState } from "react";
import {
  changePassword,
  verifyEmail,
  enableTwoFactor,
  verifyTwoFactor,
} from "@/features/user/userAction";
import { useAppDispatch } from "@/hooks/hooks";
import { Shield, MailCheck, Key, Lock, Eye, EyeOff, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User } from "@/types/user";

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

    // Validation
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
    try {
      await dispatch(verifyEmail()).unwrap();
      toast.success(
        "Verification email sent. Please check your inbox."
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const result = await dispatch(enableTwoFactor()).unwrap();
        if (result.success) {
          setShowVerificationInput(true);
          toast.success("Scan the QR code with your authenticator app");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMessage =
          err.response?.data?.message || "Failed to enable 2-Factor Authentication";
        toast.error(errorMessage);
      }
    } else {
      setTwoFactorEnabled(false);
      toast.success("2-Factor Authentication disabled");
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    try {
      const result = await dispatch(verifyTwoFactor(verificationCode)).unwrap();
      if (result.success) {
        setTwoFactorEnabled(true);
        setShowVerificationInput(false);
        setVerificationCode("");
        toast.success("2-Factor Authentication enabled successfully");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || "Invalid verification code";
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Security Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">Change Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid gap-4">
                {/* Current Password */}
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
                      placeholder="Enter current password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
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
                      placeholder="Enter new password (at least 6 characters)"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                      placeholder="Re-enter new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isChangingPassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isChangingPassword ? "Processing..." : "Change Password"}
              </Button>
            </form>
          </div>

          <Separator />

          {/* Email Verification Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MailCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="font-medium">Verify Email</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.isVerifiedEmail
                    ? "Your email has been verified"
                    : "Verify email to secure your account"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.isVerifiedEmail ? (
                <Badge className="bg-success text-success-foreground hover:bg-success/90">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Button
                  onClick={handleEmailVerification}
                  variant="outline"
                  size="sm"
                >
                  Send verification email
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Two-Factor Authentication Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
              />
            </div>

            {showVerificationInput && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <Label htmlFor="verificationCode">Enter 6-digit verification code</Label>
                <div className="flex gap-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className="flex-1"
                  />
                  <Button
                    onClick={handleVerifyTwoFactor}
                    disabled={verificationCode.length !== 6}
                  >
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter code from your authenticator app
                </p>
              </div>
            )}

            {twoFactorEnabled && (
              <Badge className="bg-success text-success-foreground hover:bg-success/90">
                <Check className="h-3 w-3 mr-1" />
                2FA Enabled
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Email Verification</span>
              {user?.isVerifiedEmail ? (
                <Badge className="bg-success text-success-foreground hover:bg-success/90">
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">Unverified</Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Two-Factor Authentication</span>
              {twoFactorEnabled ? (
                <Badge className="bg-success text-success-foreground hover:bg-success/90">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline">Disabled</Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Account</span>
              <Badge className="bg-info text-info-foreground hover:bg-info/90">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
