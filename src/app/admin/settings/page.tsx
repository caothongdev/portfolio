"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Save } from "lucide-react";
import Link from "next/link";
import { changePassword, getSessionInfo } from "@/lib/auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sessionInfo = getSessionInfo();

  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (pwd.length === 0) {
      return { label: "", color: "", width: "0%" };
    }

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) {
      return { label: "Yếu", color: "bg-red-500", width: "33%" };
    } else if (strength <= 4) {
      return { label: "Trung bình", color: "bg-yellow-500", width: "66%" };
    } else {
      return { label: "Mạnh", color: "bg-green-500", width: "100%" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        toast.success("Đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý bảo mật và cài đặt tài khoản admin
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Session Info */}
      {sessionInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Thông tin phiên đăng nhập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thời gian hết hạn:</span>
              <span className="font-medium">{sessionInfo.expiresAt}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Còn lại:</span>
              <span className="font-medium">{sessionInfo.expiresIn} phút</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription>
            Thay đổi mật khẩu admin để bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu hiện tại</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Độ mạnh:</span>
                    <span className={`font-medium ${
                      strength.label === "Yếu" ? "text-red-500" :
                      strength.label === "Trung bình" ? "text-yellow-500" :
                      "text-green-500"
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-2">Yêu cầu mật khẩu:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Ít nhất 8 ký tự
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Có chữ hoa (A-Z)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Có chữ thường (a-z)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Có chữ số (0-9)
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Tính năng bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
              <span><strong>Mã hóa SHA-256:</strong> Mật khẩu được hash trước khi lưu trữ</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
              <span><strong>Session timeout:</strong> Phiên đăng nhập tự động hết hạn sau 24 giờ</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
              <span><strong>Brute-force protection:</strong> Khóa tài khoản 15 phút sau 5 lần nhập sai</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
              <span><strong>Password requirements:</strong> Yêu cầu mật khẩu mạnh với chữ hoa, chữ thường, số</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
