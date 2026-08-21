"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Heart,
  Package,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace("/login?redirect=/profile");
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Hồ sơ thành viên
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Thông tin tài khoản và hồ sơ tư vấn chăm sóc da chuyên sâu của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Card (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 border-4 border-white shadow-md mx-auto mb-4 flex items-center justify-center font-black text-2xl">
              {user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="text-base font-black text-gray-900">{user.fullName || user.username}</h2>
            <p className="text-xs text-rose-600 font-medium mt-0.5">@{user.username}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-rose-500" />
              Thành viên LuxeBeauty VIP
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-left text-xs">
              <Link
                href="/orders"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-gray-700 font-bold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-rose-500" />
                  Đơn hàng của tôi
                </div>
                <span className="text-gray-400">&rarr;</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất tài khoản
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-rose-500" />
              Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-gray-400 block mb-1">Họ và tên:</span>
                <span className="font-bold text-gray-900 text-sm">{user.fullName || "Chưa cập nhật"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-gray-400 block mb-1">Địa chỉ Email:</span>
                <span className="font-bold text-gray-900 text-sm">{user.email || "Chưa cập nhật"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-gray-400 block mb-1">Số điện thoại:</span>
                <span className="font-bold text-gray-900 text-sm">{user.phone || "Chưa cập nhật"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-gray-400 block mb-1">Địa chỉ giao hàng mặc định:</span>
                <span className="font-bold text-gray-900 text-sm">{user.address || "Chưa cập nhật"}</span>
              </div>
            </div>

            {/* Cosmetic Profile */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Hồ sơ da &amp; Chăm sóc cá nhân hóa
              </h4>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-950 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  Loại da ghi nhận: <span className="text-rose-600 underline">{user.skinType || "Da hỗn hợp"}</span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed mt-1">
                  Dựa trên hồ sơ loại da này, hệ thống LuxeBeauty sẽ tự động ưu tiên gợi ý các sản phẩm dưỡng ẩm kiềm dầu, toner cân bằng độ pH và kem chống nắng phù hợp nhất cho làn da của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
