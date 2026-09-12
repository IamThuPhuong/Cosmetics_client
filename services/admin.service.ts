import { api } from "./api";
import {
  CategoryRevenueResponse,
  DashboardSummaryResponse,
  OrderStatusCountResponse,
  RevenueChartResponse,
  RevenueStatisticsResponse,
  TopSellingProductResponse,
} from "@/types/admin";
import {
  AdminOrderCreateRequest,
  OrderFilterParams,
  OrderStatusUpdateRequest,
  OrderSummaryResponse,
} from "@/types/order";
import {
  BrandResponse,
  CategoryResponse,
  PageResponse,
  ProductFilterParams,
  ProductResponse,
  ProductSummaryResponse,
} from "@/types/product";
import { UserFilterParams, UserResponse } from "@/types/auth";

export const adminService = {
  // ===================== 1. DASHBOARD & BÁO CÁO =====================
  getDashboardSummary: async () => {
    const res = await api.get<DashboardSummaryResponse>(
      "/admin/orders/statistics/dashboard"
    );
    return res.data;
  },

  getRevenueStatistics: async () => {
    const res = await api.get<RevenueStatisticsResponse>(
      "/admin/orders/statistics/revenue"
    );
    return res.data;
  },

  getRevenueChart: async (period: string = "week", fromDate?: string, toDate?: string) => {
    const res = await api.get<RevenueChartResponse>(
      "/admin/orders/statistics/revenue-chart",
      { period, fromDate, toDate }
    );
    return res.data;
  },

  getCategoryRevenue: async () => {
    const res = await api.get<CategoryRevenueResponse[]>(
      "/admin/orders/statistics/category-revenue"
    );
    return res.data;
  },

  getTopSellingProducts: async (limit: number = 5) => {
    const res = await api.get<TopSellingProductResponse[]>(
      "/admin/orders/statistics/top-selling",
      { limit }
    );
    return res.data;
  },

  getOrderStatusCounts: async () => {
    const res = await api.get<OrderStatusCountResponse>(
      "/admin/orders/statistics/status-count"
    );
    return res.data;
  },

  // ===================== 2. QUẢN LÝ ĐƠN HÀNG & POS =====================
  getAllOrders: async (params?: OrderFilterParams) => {
    const res = await api.get<PageResponse<OrderSummaryResponse>>(
      "/admin/orders",
      params
    );
    return res.data;
  },

  getAdminOrderDetail: async (id: number | string) => {
    const res = await api.get<any>(`/admin/orders/${id}`);
    return res.data;
  },

  updateOrderStatus: async (id: number | string, request: OrderStatusUpdateRequest) => {
    const res = await api.patch<any>(`/admin/orders/${id}/status`, request);
    return res.data;
  },

  updateInternalNote: async (id: number | string, internalNote: string) => {
    const res = await api.patch<any>(`/admin/orders/${id}/internal-note`, {
      internalNote,
    });
    return res.data;
  },

  createAdminOrder: async (request: AdminOrderCreateRequest) => {
    const res = await api.post<any>("/admin/orders", request);
    return res.data;
  },

  // ===================== 3. QUẢN LÝ SẢN PHẨM =====================
  getAdminProducts: async (params?: ProductFilterParams) => {
    const res = await api.get<PageResponse<ProductSummaryResponse>>(
      "/admin/products",
      params
    );
    return res.data;
  },

  getAdminProductById: async (id: number | string) => {
    const res = await api.get<ProductResponse>(`/admin/products/${id}`);
    return res.data;
  },

  createProduct: async (data: any) => {
    const res = await api.post<ProductResponse>("/admin/products", data);
    return res.data;
  },

  updateProduct: async (id: number | string, data: any) => {
    const res = await api.put<ProductResponse>(`/admin/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: number | string) => {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  toggleProductStatus: async (id: number | string, status: boolean) => {
    const res = await api.patch<boolean>(
      `/admin/products/${id}/status`,
      null,
      { status }
    );
    return res.data;
  },

  toggleFeaturedStatus: async (id: number | string, featured: boolean) => {
    const res = await api.patch<boolean>(
      `/admin/products/${id}/featured`,
      null,
      { featured }
    );
    return res.data;
  },

  updateVariantStock: async (variantId: number | string, stockQuantity: number) => {
    const res = await api.patch(
      `/admin/products/variants/${variantId}/stock`,
      null,
      { stockQuantity }
    );
    return res.data;
  },

  // ===================== 4. QUẢN LÝ DANH MỤC & HÃNG =====================
  getAdminCategories: async (keyword?: string, page: number = 0, size: number = 20) => {
    const res = await api.get<PageResponse<CategoryResponse>>(
      "/admin/categories",
      { keyword, page, size }
    );
    return res.data;
  },

  createCategory: async (data: { name: string; description?: string; imageUrl?: string }) => {
    const res = await api.post<CategoryResponse>("/admin/categories", data);
    return res.data;
  },

  updateCategory: async (id: string | number, data: { name: string; description?: string; imageUrl?: string }) => {
    const res = await api.put<CategoryResponse>(`/admin/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: string | number) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  getAdminBrands: async (keyword?: string, page: number = 0, size: number = 20) => {
    const res = await api.get<PageResponse<BrandResponse>>("/admin/brands", {
      keyword,
      page,
      size,
    });
    return res.data;
  },

  createBrand: async (data: { name: string; origin?: string; logoUrl?: string }) => {
    const res = await api.post<BrandResponse>("/admin/brands", data);
    return res.data;
  },

  updateBrand: async (id: number | string, data: { name: string; origin?: string; logoUrl?: string }) => {
    const res = await api.put<BrandResponse>(`/admin/brands/${id}`, data);
    return res.data;
  },

  deleteBrand: async (id: number | string) => {
    const res = await api.delete(`/admin/brands/${id}`);
    return res.data;
  },

  // ===================== 5. QUẢN LÝ NGƯỜI DÙNG =====================
  getAdminUsers: async (params?: UserFilterParams) => {
    const res = await api.get<PageResponse<UserResponse>>("/admin/users", params);
    return res.data;
  },

  updateUserStatus: async (id: number | string, status: "ACTIVE" | "LOCKED") => {
    const res = await api.patch<UserResponse>(
      `/admin/users/${id}/status`,
      null,
      { status }
    );
    return res.data;
  },

  createUser: async (data: any) => {
    const res = await api.post<UserResponse>("/admin/users", data);
    return res.data;
  },
};
