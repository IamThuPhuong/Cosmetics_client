"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductSummaryResponse } from "@/types/product";
import { formatVND } from "@/lib/utils";
import { Heart, Eye, Sparkles, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: ProductSummaryResponse;
}

export default function ProductCard({ product }: { product: ProductSummaryResponse }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80";

  return (
    <div className="group relative bg-white rounded-3xl border border-rose-100/80 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-rose-50/30 overflow-hidden">
        {/* Featured / Sale Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm shadow-rose-300">
              <Sparkles className="w-3 h-3" /> Nổi Bật
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-800 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-xs">
              Tạm Hết Hàng
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isLiked
              ? "bg-rose-50 text-rose-600 shadow-sm"
              : "bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white"
          }`}
          title="Yêu thích"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Image Link */}
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imgError || !product.imageUrl ? fallbackImage : product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />

          {/* Quick View Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-gray-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5 text-rose-600" />
              Xem Chi Tiết & Màu Son
            </span>
          </div>
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {/* Brand Name & Category */}
          <div className="flex items-center justify-between text-xs text-rose-500 font-semibold uppercase tracking-wider">
            <span>{product.brandName || "LuxeBeauty"}</span>
            {product.categoryName && (
              <span className="text-gray-400 font-normal lowercase">
                • {product.categoryName}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 hover:text-rose-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-rose-50 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-400 block">Giá niêm yết</span>
            <span className="text-base sm:text-lg font-extrabold text-rose-600 tracking-tight">
              {product.minPrice === product.maxPrice || !product.maxPrice
                ? formatVND(product.minPrice)
                : `${formatVND(product.minPrice)} - ${formatVND(product.maxPrice)}`}
            </span>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors group/btn"
            title="Xem bảng màu & chọn mua"
          >
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
