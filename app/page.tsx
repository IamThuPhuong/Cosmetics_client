"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import BrandBar from "@/components/home/BrandBar";
import CategoryTabs from "@/components/home/CategoryTabs";
import FeaturedSection from "@/components/home/FeaturedSection";
import ProductCard from "@/components/home/ProductCard";
// [Mock Phase 1: Pure UI Template]
const productService = {
  getAllBrands: async () => [],
  getAllCategories: async () => [],
  getFeaturedProducts: async (l: number) => [],
  getProducts: async (p: any) => ({ content: [], totalPages: 1 }),
};

import {
  BrandResponse,
  CategoryResponse,
  ProductSummaryResponse,
  ProductSortBy,
} from "@/types/product";
import { SlidersHorizontal, ArrowUpDown, Search, Loader2 } from "lucide-react";

// Dữ liệu mẫu mỹ phẩm cao cấp sẵn có (fallback an toàn khi backend chưa nạp dữ liệu)
const FALLBACK_BRANDS: BrandResponse[] = [
  { id: 1, name: "MAC", origin: "Mỹ", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/MAC_Cosmetics_logo.svg/320px-MAC_Cosmetics_logo.svg.png" },
  { id: 2, name: "Dior", origin: "Pháp", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dior_Logo.svg/320px-Dior_Logo.svg.png" },
  { id: 3, name: "YSL", origin: "Pháp", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Yves_Saint_Laurent_Logo.svg/320px-Yves_Saint_Laurent_Logo.svg.png" },
  { id: 4, name: "3CE", origin: "Hàn Quốc" },
  { id: 5, name: "Romand", origin: "Hàn Quốc" },
  { id: 6, name: "Chanel", origin: "Pháp" },
];

const FALLBACK_CATEGORIES: CategoryResponse[] = [
  { id: "1", name: "Son Thỏi Cao Cấp", slug: "son-thoi" },
  { id: "2", name: "Son Kem Lì Velvet", slug: "son-kem-li" },
  { id: "3", name: "Son Dưỡng Có Màu", slug: "son-duong" },
  { id: "4", name: "Phấn Nước Cushion", slug: "phan-nuoc-cushion" },
  { id: "5", name: "Serum & Dưỡng Da", slug: "skincare" },
];

const FALLBACK_PRODUCTS: ProductSummaryResponse[] = [
  {
    id: 1,
    name: "Son Thỏi Lì MAC Retro Matte Lipstick #RubyWoo",
    slug: "son-thoi-mac-ruby-woo",
    brandName: "MAC",
    categoryName: "Son Thỏi Cao Cấp",
    minPrice: 550000,
    maxPrice: 620000,
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Son Dior Rouge Velvet #999 Đỏ Huyền Thoại",
    slug: "son-dior-rouge-999",
    brandName: "Dior",
    categoryName: "Son Thỏi Cao Cấp",
    minPrice: 980000,
    maxPrice: 1050000,
    imageUrl: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Son Kem Lì 3CE Velvet Lip Tint #Taupe Đỏ Nâu",
    slug: "son-kem-3ce-taupe",
    brandName: "3CE",
    categoryName: "Son Kem Lì Velvet",
    minPrice: 320000,
    maxPrice: 350000,
    imageUrl: "https://images.unsplash.com/photo-1599732434444-e2be0216694a?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    isFeatured: true,
  },
  {
    id: 4,
    name: "Son Tint Bóng Romand Juicy Lasting Tint #Jujube",
    slug: "son-romand-juicy-lasting-tint",
    brandName: "Romand",
    categoryName: "Son Dưỡng Có Màu",
    minPrice: 195000,
    maxPrice: 220000,
    imageUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Phấn Nước YSL Le Cushion Encre De Peau",
    slug: "cushion-ysl-le-cushion",
    brandName: "YSL",
    categoryName: "Phấn Nước Cushion",
    minPrice: 1450000,
    maxPrice: 1550000,
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    isFeatured: false,
  },
  {
    id: 6,
    name: "Serum Phục Hồi & Căng Bóng Da B5 Peptides",
    slug: "serum-phuc-hoi-da-b5",
    brandName: "LuxeBeauty",
    categoryName: "Serum & Dưỡng Da",
    minPrice: 420000,
    maxPrice: 420000,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    isFeatured: false,
  },
];

export default function HomePage() {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductSummaryResponse[]>([]);
  const [products, setProducts] = useState<ProductSummaryResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  // Filters state
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<ProductSortBy>("NEWEST");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Tải danh mục, thương hiệu, sản phẩm nổi bật
  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Tải danh sách sản phẩm khi thay đổi bộ lọc
  useEffect(() => {
    loadProducts();
  }, [selectedBrandId, selectedCategoryId, sortBy, currentPage, searchKeyword]);

  const loadInitialData = async () => {
    try {
      const [brandData, categoryData, featuredData] = await Promise.allSettled([
        productService.getAllBrands(),
        productService.getAllCategories(),
        productService.getFeaturedProducts(4),
      ]);

      setBrands(
        brandData.status === "fulfilled" && brandData.value?.length > 0
          ? brandData.value
          : FALLBACK_BRANDS
      );

      setCategories(
        categoryData.status === "fulfilled" && categoryData.value?.length > 0
          ? categoryData.value
          : FALLBACK_CATEGORIES
      );

      setFeaturedProducts(
        featuredData.status === "fulfilled" && featuredData.value?.length > 0
          ? featuredData.value
          : FALLBACK_PRODUCTS.filter((p) => p.isFeatured)
      );
    } catch {
      setBrands(FALLBACK_BRANDS);
      setCategories(FALLBACK_CATEGORIES);
      setFeaturedProducts(FALLBACK_PRODUCTS.filter((p) => p.isFeatured));
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getProducts({
        brandId: selectedBrandId,
        categoryId: selectedCategoryId,
        sortBy,
        keyword: searchKeyword || undefined,
        page: currentPage,
        size: 8,
      });

      if (res && res.content) {
        setProducts(res.content);
        setTotalPages(res.totalPages || 1);
      } else {
        applyClientFilter();
      }
    } catch {
      applyClientFilter();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback client filter khi backend chưa có dữ liệu
  const applyClientFilter = () => {
    let list = [...FALLBACK_PRODUCTS];
    if (selectedBrandId) {
      const brandObj = brands.find((b) => String(b.id) === String(selectedBrandId));
      if (brandObj) list = list.filter((p) => p.brandName === brandObj.name);
    }
    if (selectedCategoryId) {
      const catObj = categories.find((c) => String(c.id) === String(selectedCategoryId));
      if (catObj) list = list.filter((p) => p.categoryName === catObj.name);
    }
    if (searchKeyword) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    if (sortBy === "PRICE_ASC") list.sort((a, b) => a.minPrice - b.minPrice);
    if (sortBy === "PRICE_DESC") list.sort((a, b) => b.minPrice - a.minPrice);
    if (sortBy === "NAME_ASC") list.sort((a, b) => a.name.localeCompare(b.name));

    setProducts(list);
    setTotalPages(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Brand-Centric Bar (Module 1 - permitAll) */}
      <BrandBar
        brands={brands}
        selectedBrandId={selectedBrandId}
        onSelectBrand={(id) => {
          setSelectedBrandId(id);
          setCurrentPage(0);
        }}
      />

      {/* 3. Featured Products Showcase */}
      <FeaturedSection products={featuredProducts} />

      {/* 4. Main Catalog Section (Module 2 - permitAll) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="space-y-6">
          {/* Header & Category Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Bộ Sưu Tập Mỹ Phẩm & Son Môi
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Lọc theo loại sản phẩm và sắp xếp theo nhu cầu của bạn
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
                  className="appearance-none bg-white border border-rose-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-xs"
                >
                  <option value="NEWEST">Mới Nhất</option>
                  <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
                  <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
                  <option value="NAME_ASC">Tên: A đến Z</option>
                </select>
                <ArrowUpDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Tabs Carousel */}
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              setCurrentPage(0);
            }}
          />

          {/* Product Grid / Loading / Empty */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <p className="text-sm font-medium text-gray-500">Đang tải sản phẩm...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-rose-50/30 rounded-3xl border border-rose-100 p-8 space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-gray-800">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Hãy thử thay đổi bộ lọc thương hiệu, danh mục hoặc từ khóa tìm kiếm của bạn.
              </p>
              <button
                onClick={() => {
                  setSelectedBrandId(undefined);
                  setSelectedCategoryId(undefined);
                  setSearchKeyword("");
                }}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs"
              >
                Xóa Tất Cả Bộ Lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
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
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-semibold disabled:opacity-40 hover:bg-rose-50 transition-colors"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
