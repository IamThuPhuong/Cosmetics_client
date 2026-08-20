"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Không hiển thị Footer ở trang admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-rose-50/40 via-white to-rose-100/30 border-t border-rose-100 mt-20">
      {/* 4 Feature Badges */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-rose-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-xs border border-rose-100/60">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">100% Hàng Authentic</h4>
              <p className="text-xs text-gray-500 mt-0.5">Cam kết chính hãng mọi sản phẩm</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-xs border border-rose-100/60">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Miễn Phí Vận Chuyển</h4>
              <p className="text-xs text-gray-500 mt-0.5">Cho đơn hàng từ 500.000đ</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-xs border border-rose-100/60">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Đổi Trả Dễ Dàng</h4>
              <p className="text-xs text-gray-500 mt-0.5">Hỗ trợ đổi trả trong 7 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-xs border border-rose-100/60">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Tư Vấn Chuyên Sâu</h4>
              <p className="text-xs text-gray-500 mt-0.5">Hỗ trợ chọn màu son 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                <span className="text-lg">🌸</span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                LUXEBEAUTY
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Thiên đường mỹ phẩm và son môi chính hãng cao cấp. Nơi bạn tìm thấy những màu son thời thượng nhất từ MAC, Dior, YSL, 3CE, Romand cùng các sản phẩm chăm sóc da thuần chay an lành.
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Showroom: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Email: support@luxebeauty.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 tracking-wider uppercase">
              Danh Mục Nổi Bật
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/products?categoryId=1" className="hover:text-rose-600 transition-colors">
                  Son Thỏi Cao Cấp
                </Link>
              </li>
              <li>
                <Link href="/products?categoryId=2" className="hover:text-rose-600 transition-colors">
                  Son Kem Lì Velvet
                </Link>
              </li>
              <li>
                <Link href="/products?categoryId=3" className="hover:text-rose-600 transition-colors">
                  Son Dưỡng Có Màu
                </Link>
              </li>
              <li>
                <Link href="/products?categoryId=4" className="hover:text-rose-600 transition-colors">
                  Phấn Nước Cushion
                </Link>
              </li>
              <li>
                <Link href="/products?categoryId=5" className="hover:text-rose-600 transition-colors">
                  Serum Dưỡng Trắng
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 tracking-wider uppercase">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/contact" className="hover:text-rose-600 transition-colors">
                  Chính Sách Giao Hàng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-600 transition-colors">
                  Chính Sách Đổi Trả 7 Ngày
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-600 transition-colors">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-rose-600 transition-colors">
                  Điều Khoản Dịch Vụ
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-rose-600 transition-colors">
                  Tra Cứu Đơn Hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 tracking-wider uppercase">
              Phương Thức Thanh Toán
            </h4>
            <p className="text-xs text-gray-500">Hỗ trợ đa dạng phương thức an toàn:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-lg text-gray-800 shadow-xs">
                💵 COD
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white border border-red-200 rounded-lg text-red-600 shadow-xs">
                🔴 VNPAY-QR
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white border border-blue-200 rounded-lg text-blue-700 shadow-xs">
                🏦 Chuyển Khoản
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-white border border-indigo-200 rounded-lg text-indigo-700 shadow-xs flex items-center gap-1">
                🅿️ PayPal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-rose-100 py-6 bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 LuxeBeauty Cosmetics. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Được xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> và công nghệ Spring Boot + Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
