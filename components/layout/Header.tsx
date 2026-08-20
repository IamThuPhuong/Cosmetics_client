"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Package,
  ShieldCheck,
  Sparkles,
  Heart,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/products", label: "Sản Phẩm" },
    { href: "/products?categoryId=1", label: "Son Môi" },
    { href: "/products?categoryId=2", label: "Chăm Sóc Da" },
    { href: "/contact", label: "Liên Hệ" },
  ];

  // Không hiển thị Header mặc định trên các trang admin (admin dùng layout riêng)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>
          MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ 500.000Đ | CAM KẾT 100% HÀNG AUTHENTIC
        </span>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-rose-100"
            : "bg-white/90 backdrop-blur-sm border-b border-rose-100/60"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
                  <span className="text-xl">🌸</span>
                </div>
                <div className="flex flex-col">
                  <span className="leading-none text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent tracking-wider">
                    LUXE<span className="text-gray-800 font-light">BEAUTY</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                    Cosmetics & Lipsticks
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 ml-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? "bg-rose-50 text-rose-600 font-semibold shadow-xs"
                          : "text-gray-700 hover:text-rose-600 hover:bg-rose-50/50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm son môi, serum, phấn nước cushion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-rose-200/80 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white focus:border-transparent transition-all placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Actions: Cart, User Profile, Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Drawer Trigger */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-full hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-all group"
                title="Giỏ hàng"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-sm shadow-rose-300 animate-in zoom-in">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* User Account / Auth Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border border-rose-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-sm font-medium text-gray-700"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                      {user?.fullName ? user.fullName[0] : "U"}
                    </div>
                    <span className="max-w-[100px] truncate hidden sm:inline">
                      {user?.fullName || user?.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Đăng nhập với tư cách</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.fullName}
                        </p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1">
                            <ShieldCheck className="w-3 h-3" /> Quản trị viên
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-500" />
                          Trang Quản Trị (Admin)
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        Đơn Mua Của Tôi
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng Xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-full px-4"
                    >
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-4 shadow-sm shadow-rose-200"
                    >
                      Đăng Ký
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-rose-50 text-gray-700"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search & Menu Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-rose-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {!isAuthenticated && (
              <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full rounded-full border-rose-200">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                    Đăng Ký Tài Khoản
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
