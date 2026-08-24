"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/home/ProductCard";
// [Mock Phase 1: Pure UI Template]
const productService = {
  getAllBrands: async () => [],
  getAllCategories: async () => [],
  getProducts: async (p: any) => ({ content: [], totalPages: 1, totalElements: 0 }),
};

import {
  BrandResponse,
  CategoryResponse,
  ProductSummaryResponse,
  ProductSortBy,
} from "@/types/product";
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  RotateCcw,
  Loader2,
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialBrandId = searchParams.get("brandId") || undefined;
  const initialCategoryId = searchParams.get("categoryId") || undefined;

  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [products, setProducts] = useState<ProductSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategoryId);
  const [priceRange, setPriceRange] = useState<string>("ALL");
  const [suitableSkinType, setSuitableSkinType] = useState<string>("");
  const [sortBy, setSortBy] = useState<ProductSortBy>("NEWEST");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedBrandId, selectedCategoryId, priceRange, suitableSkinType, sortBy, currentPage]);

  const loadFilterOptions = async () => {
    try {
      const [brandData, categoryData] = await Promise.all([
        productService.getAllBrands(),
        productService.getAllCategories(),
      ]);
      setBrands(brandData || []);
      setCategories(categoryData || []);
    } catch (e) {
      console.warn("Lỗi tải danh mục/thương hiệu:", e);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (priceRange === "UNDER_300") {
        maxPrice = 300000;
      } else if (priceRange === "300_700") {
        minPrice = 300000;
        maxPrice = 700000;
      } else if (priceRange === "OVER_700") {
        minPrice = 700000;
      }

      const res = await productService.getProducts({
        keyword: keyword.trim() || undefined,
        brandId: selectedBrandId,
        categoryId: selectedCategoryId,
        minPrice,
        maxPrice,
        suitableSkinType: suitableSkinType || undefined,
        sortBy,
        page: currentPage,
        size: 12,
      });

      if (res && res.content) {
        setProducts(res.content);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      }
    } catch (error) {
      console.warn("Lỗi tải sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedBrandId(undefined);
    setSelectedCategoryId(undefined);
    setPriceRange("ALL");
    setSuitableSkinType("");
    setSortBy("NEWEST");
    setCurrentPage(0);
  };

  const hasActiveFilters =
    !!keyword ||
    !!selectedBrandId ||
    !!selectedCategoryId ||
    priceRange !== "ALL" ||
    !!suitableSkinType;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Danh Mục Mỹ Phẩm & Son Môi Chính Hãng
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Tìm kiếm và chọn lọc theo thương hiệu, mức giá và loại da phù hợp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 bg-white rounded-3xl border border-rose-100/80 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-rose-600" /> Bộ Lọc Tìm Kiếm
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tên son hoặc mã màu..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Thương Hiệu
              </label>
              <select
                value={selectedBrandId || ""}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value || undefined);
                  setCurrentPage(0);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.origin ? `(${b.origin})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Danh Mục Sản Phẩm
              </label>
              <select
                value={selectedCategoryId || ""}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value || undefined);
                  setCurrentPage(0);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Khoảng Giá
              </label>
              <div className="space-y-1.5 text-xs text-gray-700">
                {[
                  { id: "ALL", label: "Tất cả mức giá" },
                  { id: "UNDER_300", label: "Dưới 300.000 ₫" },
                  { id: "300_700", label: "300.000 ₫ - 700.000 ₫" },
                  { id: "OVER_700", label: "Trên 700.000 ₫" },
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-rose-50/50">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === p.id}
                      onChange={() => {
                        setPriceRange(p.id);
                        setCurrentPage(0);
                      }}
                      className="accent-rose-600"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skin Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Loại Da Phù Hợp
              </label>
              <select
                value={suitableSkinType}
                onChange={(e) => {
                  setSuitableSkinType(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="">Mọi loại da</option>
                <option value="OILY">Da dầu / Hỗn hợp thiên dầu</option>
                <option value="DRY">Da khô / Thiếu ẩm</option>
                <option value="SENSITIVE">Da nhạy cảm</option>
                <option value="NORMAL">Da thường</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Action Bar */}
          <div className="p-4 bg-white rounded-2xl border border-rose-100/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              Hiển thị <strong className="text-rose-600">{products.length}</strong> sản phẩm
              {totalElements > 0 && ` (trên tổng số ${totalElements})`}
            </span>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 shrink-0">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="NEWEST">Mới nhất</option>
                <option value="PRICE_ASC">Giá tăng dần</option>
                <option value="PRICE_DESC">Giá giảm dần</option>
                <option value="NAME_ASC">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Đang tải sản phẩm...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-rose-100 p-8 space-y-3">
              <span className="text-4xl">💄</span>
              <h3 className="text-lg font-bold text-gray-800">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Không có sản phẩm nào phù hợp với bộ lọc đã chọn. Hãy thử nới lỏng điều kiện tìm kiếm.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-semibold disabled:opacity-40 hover:bg-rose-50 transition-colors"
              >
                Trang trước
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === idx
                      ? "bg-rose-600 text-white shadow-sm shadow-rose-200"
                      : "bg-white border border-rose-100 text-gray-700 hover:bg-rose-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-semibold disabled:opacity-40 hover:bg-rose-50 transition-colors"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
