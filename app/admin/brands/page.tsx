"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { adminService } from "@/services/admin.service";
import { BrandResponse } from "@/types/product";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Globe,
} from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", origin: "Pháp", logoUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAdminBrands(keyword.trim() || undefined, currentPage, 15);
      setBrands(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy thương hiệu:", err);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, currentPage]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormData({ name: "", origin: "Pháp", logoUrl: "" });
    setMessage(null);
    setShowModal(true);
  };

  const handleOpenEdit = (brand: BrandResponse) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      origin: brand.origin || "Pháp",
      logoUrl: brand.logoUrl || "",
    });
    setMessage(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa thương hiệu "${name}" không?`)) return;
    try {
      await adminService.deleteBrand(id);
      alert(`Đã xóa thương hiệu "${name}" thành công!`);
      fetchBrands();
    } catch (err: any) {
      alert(err?.message || "Không thể xóa thương hiệu này vì vẫn còn sản phẩm liên kết.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);

      if (editingBrand) {
        await adminService.updateBrand(editingBrand.id, formData);
        setMessage({ type: "success", text: "Cập nhật thương hiệu thành công!" });
      } else {
        await adminService.createBrand(formData);
        setMessage({ type: "success", text: "Thêm mới thương hiệu thành công!" });
      }

      fetchBrands();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Đã xảy ra lỗi khi lưu thương hiệu." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Quản lý Thương hiệu mỹ phẩm
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Các hãng mỹ phẩm cao cấp quốc tế (MAC, Dior, YSL, Chanel, 3CE, Romand...)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-rose-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm thương hiệu
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Tìm theo tên thương hiệu..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            <span className="text-xs">Đang tải thương hiệu...</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Không tìm thấy thương hiệu nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Logo</th>
                  <th className="py-3.5 px-4">Tên thương hiệu</th>
                  <th className="py-3.5 px-4">Xuất xứ / Quốc gia</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                        <Image
                          src={brand.logoUrl || "/images/NoImage.jpg"}
                          alt={brand.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                      {brand.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-medium">
                        <Globe className="w-3 h-3 text-stone-400" />
                        {brand.origin || "Chưa rõ"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id, brand.name)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-black text-stone-900">
                {editingBrand ? "Cập nhật thương hiệu" : "Thêm mới thương hiệu"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  Tên thương hiệu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: MAC, Dior, Chanel..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  Quốc gia xuất xứ
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Pháp, Mỹ, Hàn Quốc, Nhật Bản..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  URL Logo thương hiệu
                </label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 font-bold text-stone-600 hover:bg-stone-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thương hiệu"
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
