"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!userName.trim()) {
      setErrorMessage("Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      const success = await login({
        userName: userName.trim(),
        password,
      });

      if (success) {
        // Kiểm tra nếu là admin thì hướng đến /admin nếu không có redirect chỉ định
        const savedToken = localStorage.getItem("token");
        if (redirectUrl && redirectUrl !== "/") {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage(
        err?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (type: "admin" | "user") => {
    if (type === "admin") {
      setUserName("admin");
      setPassword("admin123");
    } else {
      setUserName("customer1");
      setPassword("123456");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-rose-100/50 border border-rose-100 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-100 rounded-full blur-2xl pointer-events-none opacity-60" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-100 rounded-full blur-2xl pointer-events-none opacity-60" />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mb-3.5 shadow-sm border border-rose-100">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Đăng nhập tài khoản <span className="font-bold text-rose-600">LuxeBeauty</span> để tích điểm &amp; ưu đãi VIP
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nhập tên đăng nhập của bạn"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Tính năng quên mật khẩu qua Email đang được tích hợp. Vui lòng liên hệ Admin!");
                  }}
                  className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline font-medium"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập ngay
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo helper */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <div className="text-[11px] text-gray-400 mb-2">Tài khoản thử nghiệm nhanh:</div>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="text-[11px] font-bold px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                Quản trị viên (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("user")}
                className="text-[11px] font-bold px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                Khách hàng VIP
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-gray-500">
            Chưa có tài khoản LuxeBeauty?{" "}
            <Link
              href="/register"
              className="font-bold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1"
            >
              Đăng ký thành viên mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
