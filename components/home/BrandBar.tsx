"use client";

import { BrandResponse } from "@/types/product";
import { Sparkles } from "lucide-react";

interface BrandBarProps {
  brands: BrandResponse[];
  selectedBrandId?: string;
  onSelectBrand: (brandId?: string) => void;
}

export default function BrandBar({
  brands,
  selectedBrandId,
  onSelectBrand,
}: BrandBarProps) {
  return (
    <div id="brands" className="py-6 border-b border-rose-100 bg-white/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-rose-500">✨</span>
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-800">
              Lọc Nhanh Theo Thương Hiệu Chính Hãng
            </h3>
          </div>
          {selectedBrandId && (
            <button
              onClick={() => onSelectBrand(undefined)}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              Xóa lọc hãng (Xem tất cả)
            </button>
          )}
        </div>

        {/* Brand Pills Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          <button
            onClick={() => onSelectBrand(undefined)}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
              !selectedBrandId
                ? "bg-rose-600 text-white shadow-sm shadow-rose-200"
                : "bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600"
            }`}
          >
            Tất Cả Thương Hiệu
          </button>

          {brands.map((brand) => {
            const isSelected = String(brand.id) === String(selectedBrandId);
            return (
              <button
                key={brand.id}
                onClick={() => onSelectBrand(String(brand.id))}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-200"
                    : "bg-white hover:bg-rose-50/70 text-gray-800 border-rose-100 hover:border-rose-300"
                }`}
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-4 h-4 object-contain rounded-full inline-block"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                )}
                <span>{brand.name}</span>
                {brand.origin && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-rose-700 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {brand.origin}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
