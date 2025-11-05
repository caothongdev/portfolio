"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity-logger";
import { login, isCredentialsSet, isAccountLocked, getRemainingAttempts } from "@/lib/auth";
import { PasswordSetup } from "@/components/ui/password-setup";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{ locked: boolean; remainingTime?: number }>({ locked: false });
  const router = useRouter();

  useEffect(() => {
    // Check if credentials are set
    if (!isCredentialsSet()) {
      setNeedsSetup(true);
    }

    // Check lockout status
    const status = isAccountLocked();
    setLockoutInfo(status);
  }, []);

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    toast.success("Tài khoản đã được thiết lập! Bạn có thể đăng nhập ngay.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check lockout
    const status = isAccountLocked();
    if (status.locked) {
      toast.error(`Tài khoản bị khóa. Vui lòng thử lại sau ${status.remainingTime} phút.`);
      setLockoutInfo(status);
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        logActivity.adminLogin();
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.error || "Đăng nhập thất bại!");
        setPassword("");
        
        // Update lockout status
        const newStatus = isAccountLocked();
        setLockoutInfo(newStatus);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Show setup screen if password not set
  if (needsSetup) {
    return <PasswordSetup onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">
            Nhập email và mật khẩu để truy cập admin panel
          </p>
        </div>

        {/* Lockout Warning */}
        {lockoutInfo.locked && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Tài khoản bị khóa</p>
              <p className="mt-1">
                Do nhập sai thông tin quá nhiều lần. Vui lòng thử lại sau {lockoutInfo.remainingTime} phút.
              </p>
            </div>
          </div>
        )}

        {/* Failed Attempts Warning */}
        {!lockoutInfo.locked && getRemainingAttempts() < 5 && getRemainingAttempts() > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Cảnh báo</p>
              <p className="mt-1">
                Còn {getRemainingAttempts()} lần thử. Tài khoản sẽ bị khóa 15 phút nếu nhập sai thêm.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@example.com"
                required
                disabled={lockoutInfo.locked}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nhập mật khẩu admin"
                required
                disabled={lockoutInfo.locked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={lockoutInfo.locked}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || lockoutInfo.locked}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Đăng nhập
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">🔒 Bảo mật</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Xác thực 2 yếu tố: Email + Mật khẩu</li>
            <li>• Mật khẩu được mã hóa SHA-256</li>
            <li>• Phiên đăng nhập tự động hết hạn sau 24 giờ</li>
            <li>• Khóa tài khoản 15 phút sau 5 lần nhập sai</li>
            <li>• Mật khẩu phải có ít nhất 8 ký tự, chữ hoa, chữ thường và số</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}