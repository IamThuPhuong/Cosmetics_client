"use client";

import { ProductSummaryResponse } from "@/types/product";
import ProductCard from "./ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedSectionProps {
  products: ProductSummaryResponse[];
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 border-b border-rose-100 bg-gradient-to-b from-rose-50/20 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-2 border border-rose-200/50">
              <Sparkles className="w-3.5 h-3.5" /> Best Sellers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Sản Phẩm Mỹ Phẩm Nổi Bật Nhất
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Top các thỏi son lì và sản phẩm chăm sóc da được yêu thích nhất tháng này
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 group shrink-0"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
