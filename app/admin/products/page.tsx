"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { adminService } from "@/services/admin.service";
import { productService } from "@/services/product.service";
import {
  ProductSummaryResponse,
  ProductResponse,
  BrandResponse,
  CategoryResponse,
  ProductFilterParams,
} from "@/types/product";
import { formatVND } from "@/lib/utils";
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Layers,
  Award,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSummaryResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Stock Edit Modal
  const [editingStockProduct, setEditingStockProduct] = useState<ProductResponse | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockUpdatingId, setStockUpdatingId] = useState<number | null>(null);

  // Add/Edit Product Modal
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [formProduct, setFormProduct] = useState<any>({
    name: "",
    brandId: "",
    categoryId: "",
    description: "",
    skinType: "Mọi loại da",
    usageInstructions: "",
    ingredients: "",
    paoMonths: 12,
    isFeatured: false,
    status: true,
    variants: [
      {
        shadeName: "Tiêu chuẩn",
        colorHex: "#FFB6C1",
        volumeMl: 30,
        regularPrice: 350000,
        salePrice: 299000,
        stockQuantity: 50,
      },
    ],
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const fetchFiltersData = async () => {
    try {
      const [brandsRes, catsRes] = await Promise.all([
        productService.getAllBrands(),
        productService.getAllCategories(),
      ]);
      setBrands(brandsRes || []);
      setCategories(catsRes || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu danh mục/hãng:", err);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: ProductFilterParams = {
        page: currentPage,
        size: 10,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedBrand) params.brandId = Number(selectedBrand);
      if (selectedCategory) params.categoryId = Number(selectedCategory);

      const res = await adminService.getAdminProducts(params);
      setProducts(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm admin:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, keyword, selectedBrand, selectedCategory]);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await adminService.toggleProductStatus(id, !currentStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: !currentStatus, isActive: !currentStatus } : p))
      );
    } catch (err) {
      alert("Không thể đổi trạng thái hiển thị của sản phẩm.");
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      await adminService.toggleFeaturedStatus(id, !currentFeatured);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: !currentFeatured } : p))
      );
    } catch (err) {
      alert("Không thể đổi trạng thái nổi bật của sản phẩm.");
    }
  };

  const handleOpenStockModal = async (productId: number) => {
    try {
      setIsLoading(true);
      const fullProd = await adminService.getAdminProductById(productId);
      setEditingStockProduct(fullProd);
      setIsStockModalOpen(true);
    } catch (err) {
      alert("Không thể tải thông tin biến thể.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVariantStock = async (variantId: number, newStock: number) => {
    if (newStock < 0) return;
    try {
      setStockUpdatingId(variantId);
      await adminService.updateVariantStock(variantId, newStock);
      if (editingStockProduct) {
        const currentVariants = (editingStockProduct.productVariantResponses || editingStockProduct.variants || []) as any[];
        setEditingStockProduct({
          ...editingStockProduct,
          productVariantResponses: currentVariants.map((v: any) =>
            v.id === variantId ? { ...v, stockQuantity: newStock } : v
          ),
          variants: currentVariants.map((v: any) =>
            v.id === variantId ? { ...v, stockQuantity: newStock } : v
          ),
        });
      }
      fetchProducts();
    } catch (err) {
      alert("Lỗi cập nhật tồn kho biến thể.");
    } finally {
      setStockUpdatingId(null);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduct.name.trim() || !formProduct.brandId || !formProduct.categoryId) {
      alert("Vui lòng nhập tên sản phẩm, chọn thương hiệu và danh mục!");
      return;
    }

    try {
      setIsSavingProduct(true);
      await adminService.createProduct(formProduct);
      alert("Đã thêm mỹ phẩm mới thành công!");
      setIsAddEditModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(err?.message || "Không thể tạo sản phẩm mới.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Quản lý Mỹ phẩm &amp; Tồn kho
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý danh mục sản phẩm, biến thể màu son, dung tích và số lượng tồn trong kho
          </p>
        </div>

        <button
          onClick={() => {
            if (brands.length > 0 && categories.length > 0) {
              setFormProduct((prev: any) => ({
                ...prev,
                brandId: brands[0].id,
                categoryId: categories[0].id,
              }));
            }
            setIsAddEditModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-rose-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm mỹ phẩm mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Tìm theo tên mỹ phẩm..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setCurrentPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="">Tất cả Thương hiệu</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="">Tất cả Danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            <span className="text-xs">Đang tải danh sách mỹ phẩm...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Không tìm thấy mỹ phẩm nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Sản phẩm</th>
                  <th className="py-3.5 px-4">Thương hiệu / Danh mục</th>
                  <th className="py-3.5 px-4">Giá từ</th>
                  <th className="py-3.5 px-4 text-center">Nổi bật</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Tồn kho &amp; Xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 shrink-0">
                          <Image
                            src={prod.imageUrl || prod.thumbnailUrl || "/images/NoImage.jpg"}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block max-w-xs truncate">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-stone-400">ID: #{prod.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-800">{prod.brandName}</div>
                      <div className="text-[11px] text-stone-400">{prod.categoryName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-rose-600">
                      {formatVND(prod.minPrice)}
                    </td>

                    {/* Star Featured */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod.id, prod.isFeatured)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          prod.isFeatured
                            ? "text-amber-500 hover:bg-amber-50"
                            : "text-stone-300 hover:text-amber-500 hover:bg-stone-50"
                        }`}
                        title={prod.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Active toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(prod.id, Boolean(prod.isActive ?? prod.status ?? true))}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          (prod.isActive ?? prod.status ?? true)
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                        }`}
                      >
                        {(prod.isActive ?? prod.status ?? true) ? "Đang bán" : "Tạm ẩn"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenStockModal(prod.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-700 font-bold transition-colors cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5 text-rose-500" />
                        Chỉnh tồn kho
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-stone-200 font-bold disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 font-bold disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Management Modal */}
      {isStockModalOpen && editingStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Cập nhật tồn kho theo biến thể
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-sm">
                  {editingStockProduct.name}
                </p>
              </div>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {((editingStockProduct.productVariantResponses || editingStockProduct.variants || []) as any[]).length > 0 ? (
                ((editingStockProduct.productVariantResponses || editingStockProduct.variants || []) as any[]).map((v: any) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {v.variantName || v.shadeColor || v.shadeName || "Phân loại tiêu chuẩn"}
                        {v.capacity ? ` (${v.capacity})` : v.volumeMl ? ` (${v.volumeMl}ml)` : ""}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Giá bán: {formatVND(v.salePrice || v.regularPrice || v.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-medium">Tồn kho:</span>
                      <input
                        type="number"
                        min="0"
                        defaultValue={v.stockQuantity}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val !== v.stockQuantity) {
                            handleUpdateVariantStock(v.id, val);
                          }
                        }}
                        disabled={stockUpdatingId === v.id}
                        className="w-20 px-2 py-1.5 rounded-lg border border-stone-300 font-mono font-bold text-center text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                      />
                      {stockUpdatingId === v.id && (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stone-400">
                  Sản phẩm chưa có cấu hình biến thể.
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-lg font-black text-stone-900">
                Thêm sản phẩm mỹ phẩm mới
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  Tên mỹ phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={formProduct.name}
                  onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                  placeholder="VD: Son Kem Lì MAC Powder Kiss Liquid Lipcolour"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase">
                    Thương hiệu *
                  </label>
                  <select
                    value={formProduct.brandId}
                    onChange={(e) => setFormProduct({ ...formProduct, brandId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase">
                    Danh mục *
                  </label>
                  <select
                    value={formProduct.categoryId}
                    onChange={(e) => setFormProduct({ ...formProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase">
                    Loại da phù hợp
                  </label>
                  <input
                    type="text"
                    value={formProduct.skinType}
                    onChange={(e) => setFormProduct({ ...formProduct, skinType: e.target.value })}
                    placeholder="Mọi loại da / Da dầu / Da nhạy cảm"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase">
                    Hạn sau mở nắp (PAO tháng)
                  </label>
                  <input
                    type="number"
                    value={formProduct.paoMonths}
                    onChange={(e) =>
                      setFormProduct({ ...formProduct, paoMonths: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={formProduct.description}
                  onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                  placeholder="Mô tả công dụng, tính năng nổi bật..."
                  className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 font-bold text-stone-600 hover:bg-stone-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu sản phẩm"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
