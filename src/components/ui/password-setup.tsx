"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { initializeAdminCredentials } from "@/lib/auth";

interface PasswordSetupProps {
  onComplete: () => void;
}

export function PasswordSetup({ onComplete }: PasswordSetupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email không được để trống";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không hợp lệ";
    }

    return null;
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!/[A-Z]/.test(pwd)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
    }

    if (!/[a-z]/.test(pwd)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ thường";
    }

    if (!/[0-9]/.test(pwd)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ số";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate password
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      await initializeAdminCredentials(email, password);
      alert("✅ Tài khoản admin đã được thiết lập thành công!");
      onComplete();
    } catch (err) {
      setError("Có lỗi xảy ra khi thiết lập tài khoản!");
    } finally {
      setIsLoading(false);
    }
  };

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

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Thiết lập tài khoản Admin</CardTitle>
          <CardDescription>
            Tạo email và mật khẩu để bảo vệ admin panel của bạn
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Admin</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
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

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập lại mật khẩu"
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

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Requirements */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-2">Yêu cầu mật khẩu:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Ít nhất 8 ký tự
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Có chữ hoa (A-Z)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Có chữ thường (a-z)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
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
                  Đang thiết lập...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Thiết lập tài khoản
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
