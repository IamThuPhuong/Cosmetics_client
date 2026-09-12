"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { adminService } from "@/services/admin.service";
import { CategoryResponse } from "@/types/product";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAdminCategories(keyword.trim() || undefined, currentPage, 15);
      setCategories(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setFormData({ name: "", description: "", imageUrl: "" });
    setMessage(null);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: CategoryResponse) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
    });
    setMessage(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}" không?`)) return;
    try {
      await adminService.deleteCategory(id);
      alert(`Đã xóa danh mục "${name}" thành công!`);
      fetchCategories();
    } catch (err: any) {
      alert(err?.message || "Không thể xóa danh mục này vì có sản phẩm đang thuộc danh mục.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);

      if (editingCat) {
        await adminService.updateCategory(editingCat.id, formData);
        setMessage({ type: "success", text: "Cập nhật danh mục thành công!" });
      } else {
        await adminService.createCategory(formData);
        setMessage({ type: "success", text: "Thêm mới danh mục thành công!" });
      }

      fetchCategories();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Đã xảy ra lỗi khi lưu danh mục." });
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
            Quản lý Danh mục mỹ phẩm
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Phân loại dòng sản phẩm (Son môi, Dưỡng da, Kem chống nắng, Trang điểm...)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-rose-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
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
            placeholder="Tìm theo tên danh mục..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            <span className="text-xs">Đang tải danh mục...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Không tìm thấy danh mục nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Hình ảnh</th>
                  <th className="py-3.5 px-4">Tên danh mục</th>
                  <th className="py-3.5 px-4">Mô tả</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                        <Image
                          src={cat.imageUrl || "/images/NoImage.jpg"}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {cat.name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 max-w-sm truncate">
                      {cat.description || "---"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
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
                {editingCat ? "Cập nhật danh mục" : "Thêm mới danh mục"}
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
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Son Môi, Kem Chống Nắng..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả danh mục..."
                  className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase">
                  URL Hình ảnh đại diện
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
                    "Lưu danh mục"
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
