import { OrderSummaryResponse } from "./order";

export interface OrderStatusCountResponse {
  pendingCount?: number;
  confirmedCount?: number;
  shippingCount?: number;
  completedCount?: number;
  cancelledCount?: number;
  pending?: number;
  confirmed?: number;
  shipping?: number;
  completed?: number;
  cancelled?: number;
}

export interface RevenueStatisticsResponse {
  totalRevenue?: number;
  todayRevenue?: number;
  weekRevenue?: number;
  monthRevenue?: number;
  thisMonthRevenue?: number;
}

export interface RevenueChartItem {
  label: string;
  revenue: number;
  date?: string;
}

export interface RevenueChartResponse {
  labels?: string[];
  data: any[];
  period?: string;
}

export interface CategoryRevenueResponse {
  categoryId: string | number;
  categoryName: string;
  revenue: number;
  percentage: number;
  totalOrders?: number;
}

export interface TopSellingProductResponse {
  productId: number;
  productName: string;
  imageUrl?: string;
  totalQuantitySold?: number;
  soldQuantity?: number;
  totalRevenue?: number;
  revenue?: number;
}

export interface DashboardSummaryResponse {
  statusCounts?: OrderStatusCountResponse;
  revenue?: RevenueStatisticsResponse;
  recentOrders?: OrderSummaryResponse[];
  todayRevenue?: number;
  monthlyRevenue?: number;
  pendingOrders?: number;
  totalOrders?: number;
  totalProducts?: number;
  totalUsers?: number;
}
