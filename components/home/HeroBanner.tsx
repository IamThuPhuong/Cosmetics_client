"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award } from "lucide-react";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-pink-50/40 to-background pt-8 pb-16 lg:py-20 border-b border-rose-100/50">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold border border-rose-200/60 shadow-xs animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Bộ Sưu Tập Son Môi & Mỹ Phẩm Authentic 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Nâng Niu Làn Da,{" "}
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                Tỏa Sáng Rạng Rỡ
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Trải nghiệm thiên đường mỹ phẩm chính hãng với các bảng màu son thời thượng từ MAC, Dior, YSL, 3CE, Romand. Chiết xuất dưỡng môi thảo mộc lành tính, bền màu suốt ngày dài.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-300/40 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Khám Phá Sản Phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?categoryId=1"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-rose-50/60 text-gray-800 font-semibold text-sm border border-rose-200 shadow-xs hover:border-rose-300 transition-all"
              >
                Bảng Màu Son Mới Nhất 💄
              </Link>
            </div>

            {/* Badges / Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-rose-200/60 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-black text-rose-600">100%</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Chính hãng Authentic</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-rose-200/60 px-4">
                <span className="text-2xl font-black text-gray-900">50K+</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Khách hàng tin chọn</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-black text-rose-600">4.9 ★</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Đánh giá xuất sắc</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
                alt="LuxeBeauty Cosmetics"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Product Highlight Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    🔥 Best-Seller Son Môi
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1">
                    Son Kem Lì Velvet Lip Tint
                  </h4>
                  <p className="text-xs text-rose-600 font-bold mt-0.5">
                    Chỉ từ 280.000 ₫
                  </p>
                </div>
                <Link
                  href="/products?categoryId=2"
                  className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200 hover:bg-rose-600 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
