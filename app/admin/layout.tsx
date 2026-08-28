"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  Package,
  Layers,
  Award,
  Users,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Tổng quan & Thống kê",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "Quản lý Đơn hàng",
    icon: ShoppingCart,
  },
  {
    href: "/admin/pos",
    label: "Tạo đơn POS (Tại quầy)",
    icon: PlusCircle,
  },
  {
    href: "/admin/products",
    label: "Quản lý Sản phẩm",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Quản lý Danh mục",
    icon: Layers,
  },
  {
    href: "/admin/brands",
    label: "Quản lý Thương hiệu",
    icon: Award,
  },
  {
    href: "/admin/users",
    label: "Quản lý Tài khoản",
    icon: Users,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      // Cho phép test giao diện nếu localStorage có token hoặc redirect
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Nếu không phải admin và không có quyền
  if (!isAdmin && !isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-rose-100">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 inline-flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Yêu cầu quyền Quản trị viên</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Khu vực này chỉ dành cho tài khoản có quyền <strong>ROLE_ADMIN</strong>. Vui lòng đăng nhập bằng tài khoản quản trị để tiếp tục.
          </p>
          <div className="space-y-2">
            <Link
              href="/login?redirect=/admin"
              className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all block"
            >
              Đăng nhập tài khoản Admin
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-full border border-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider hover:bg-stone-50 transition-all block"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-400" />
          <span className="font-serif font-black tracking-wider text-sm">LUXEBEAUTY ADMIN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-stone-800 text-stone-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-stone-950 text-white flex flex-col justify-between transition-transform duration-300 shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-black text-sm tracking-widest text-white">
                  LUXEBEAUTY
                </div>
                <div className="text-[10px] text-rose-400 font-bold tracking-wider uppercase">
                  Quản trị hệ thống
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                      : "text-stone-400 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & exit */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/50 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              Xem Website khách
            </span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 font-bold">
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              {user?.username || "Admin"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="font-bold text-rose-600 capitalize">
              {pathname.replace("/admin", "").replace("/", "") || "Tổng quan"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-stone-800">{user?.fullName || "Administrator"}</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Đang trực tuyến
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center border border-rose-200">
              {user?.fullName?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Page Inner Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
