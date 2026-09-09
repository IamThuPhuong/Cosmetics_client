import { api } from "./api";
import {
  BrandResponse,
  CategoryResponse,
  PageResponse,
  ProductFilterParams,
  ProductResponse,
  ProductSummaryResponse,
} from "@/types/product";

export const productService = {
  /**
   * Lấy danh sách sản phẩm với bộ lọc & phân trang (GET /api/v1/products)
   */
  getProducts: async (params?: ProductFilterParams) => {
    const res = await api.get<PageResponse<ProductSummaryResponse>>(
      "/products",
      params
    );
    return res.data;
  },

  /**
   * Lấy danh sách sản phẩm nổi bật (GET /api/v1/products/featured)
   */
  getFeaturedProducts: async (limit: number = 8) => {
    const res = await api.get<ProductSummaryResponse[]>("/products/featured", {
      limit,
    });
    return res.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo ID (GET /api/v1/products/{id})
   */
  getProductById: async (id: number | string) => {
    const res = await api.get<ProductResponse>(`/products/${id}`);
    return res.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo Slug (GET /api/v1/products/slug/{slug})
   */
  getProductBySlug: async (slug: string) => {
    const res = await api.get<ProductResponse>(`/products/slug/${slug}`);
    return res.data;
  },

  /**
   * Lấy danh sách toàn bộ thương hiệu mỹ phẩm (GET /api/v1/brands)
   */
  getAllBrands: async () => {
    const res = await api.get<BrandResponse[]>("/brands");
    return res.data;
  },

  /**
   * Lấy chi tiết một thương hiệu theo ID (GET /api/v1/brands/{id})
   */
  getBrandById: async (id: number | string) => {
    const res = await api.get<BrandResponse>(`/brands/${id}`);
    return res.data;
  },

  /**
   * Lấy danh sách toàn bộ danh mục mỹ phẩm (GET /api/v1/categories)
   */
  getAllCategories: async () => {
    const res = await api.get<CategoryResponse[]>("/categories");
    return res.data;
  },

  /**
   * Lấy chi tiết danh mục theo ID (GET /api/v1/categories/{id})
   */
  getCategoryById: async (id: string | number) => {
    const res = await api.get<CategoryResponse>(`/categories/${id}`);
    return res.data;
  },

  /**
   * Lấy chi tiết danh mục theo Slug (GET /api/v1/categories/slug/{slug})
   */
  getCategoryBySlug: async (slug: string) => {
    const res = await api.get<CategoryResponse>(`/categories/slug/${slug}`);
    return res.data;
  },
};
