"use client";
import { useState } from "react";
import { changePassword, verifyEmail, enableTwoFactor, verifyTwoFactor } from "@/features/user/userAction";
import { useAppDispatch } from "@/hooks/hooks";
import { Shield, MailCheck, Key, Lock, Eye, EyeOff, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SettingsTabProps {
  user: any;
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
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.isTwoFactorEnabled || false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await dispatch(changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();

      toast.success("Đổi mật khẩu thành công");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      await dispatch(verifyEmail()).unwrap();
      toast.success("Đã gửi email xác minh. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error) {
      toast.error("Gửi email xác minh thất bại");
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const result = await dispatch(enableTwoFactor()).unwrap();
        if (result.success) {
          setShowVerificationInput(true);
          toast.success("Quét mã QR bằng ứng dụng xác thực của bạn");
        }
      } catch (error) {
        toast.error("Kích hoạt xác thực 2 lớp thất bại");
      }
    } else {
      setTwoFactorEnabled(false);
      toast.success("Đã tắt xác thực 2 lớp");
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Mã xác minh phải có 6 chữ số");
      return;
    }

    try {
      const result = await dispatch(verifyTwoFactor(verificationCode)).unwrap();
      if (result.success) {
        setTwoFactorEnabled(true);
        setShowVerificationInput(false);
        setVerificationCode("");
        toast.success("Kích hoạt xác thực 2 lớp thành công");
      }
    } catch (error) {
      toast.error("Mã xác minh không hợp lệ");
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Security Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật tài khoản
          </CardTitle>
          <CardDescription>
            Quản lý mật khẩu và các cài đặt bảo mật
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">Thay đổi mật khẩu</Label>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật mật khẩu mới cho tài khoản
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Password form fields */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value
                      })}
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Similar fields for new password and confirm password */}
              </div>

              <Button type="submit" className="w-full" disabled={isChangingPassword}>
                <Lock className="h-4 w-4 mr-2" />
                {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </form>
          </div>

          <Separator />

          {/* Email Verification Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MailCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="font-medium">Xác minh email</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.isVerifiedEmail
                    ? "Email của bạn đã được xác minh"
                    : "Xác minh email để bảo vệ tài khoản"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.isVerifiedEmail ? (
                <Badge className="bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Đã xác minh
                </Badge>
              ) : (
                <Button
                  onClick={handleEmailVerification}
                  variant="outline"
                  size="sm"
                >
                  Gửi email xác minh
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
                  <Label className="font-medium">Xác thực 2 lớp (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Thêm lớp bảo mật bổ sung cho tài khoản
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
                <Label htmlFor="verificationCode">Nhập mã xác minh 6 số</Label>
                <div className="flex gap-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleVerifyTwoFactor}
                    disabled={verificationCode.length !== 6}
                  >
                    Xác minh
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Nhập mã từ ứng dụng xác thực của bạn
                </p>
              </div>
            )}

            {twoFactorEnabled && (
              <Badge className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                Đã bật xác thực 2 lớp
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Xác minh email</span>
              {user?.isVerifiedEmail ? (
                <Badge className="bg-green-500">Đã xác minh</Badge>
              ) : (
                <Badge variant="outline">Chưa xác minh</Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Xác thực 2 lớp</span>
              {twoFactorEnabled ? (
                <Badge className="bg-green-500">Đã bật</Badge>
              ) : (
                <Badge variant="outline">Chưa bật</Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tài khoản</span>
              <Badge className="bg-blue-500">Đang hoạt động</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}