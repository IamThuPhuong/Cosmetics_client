"use client";

import { CategoryResponse } from "@/types/product";

interface CategoryTabsProps {
  categories: CategoryResponse[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
      <button
        onClick={() => onSelectCategory(undefined)}
        className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
          !selectedCategoryId
            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200"
            : "bg-white text-gray-700 border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50"
        }`}
      >
        ✨ Tất Cả Danh Mục
      </button>

      {categories.map((cat) => {
        const isSelected = String(cat.id) === String(selectedCategoryId);
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(String(cat.id))}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-2 border ${
              isSelected
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-md shadow-rose-200"
                : "bg-white text-gray-700 border-rose-100 hover:border-rose-300 hover:bg-rose-50/50"
            }`}
          >
            {cat.imageUrl && (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-4 h-4 object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
