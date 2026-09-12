"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminService } from "@/services/admin.service";
import {
  DashboardSummaryResponse,
  RevenueStatisticsResponse,
  RevenueChartResponse,
  CategoryRevenueResponse,
  TopSellingProductResponse,
  OrderStatusCountResponse,
} from "@/types/admin";
import { formatVND } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  Clock,
  Users,
  Package,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [stats, setStats] = useState<RevenueStatisticsResponse | null>(null);
  const [chartData, setChartData] = useState<RevenueChartResponse | null>(null);
  const [categoryRevenues, setCategoryRevenues] = useState<CategoryRevenueResponse[]>([]);
  const [topSelling, setTopSelling] = useState<TopSellingProductResponse[]>([]);
  const [statusCounts, setStatusCounts] = useState<OrderStatusCountResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [sumRes, statsRes, chartRes, catRes, topRes, countRes] =
        await Promise.allSettled([
          adminService.getDashboardSummary(),
          adminService.getRevenueStatistics(),
          adminService.getRevenueChart("week"),
          adminService.getCategoryRevenue(),
          adminService.getTopSellingProducts(5),
          adminService.getOrderStatusCounts(),
        ]);

      if (sumRes.status === "fulfilled") setSummary(sumRes.value);
      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (chartRes.status === "fulfilled") setChartData(chartRes.value);
      if (catRes.status === "fulfilled") setCategoryRevenues(catRes.value || []);
      if (topRes.status === "fulfilled") setTopSelling(topRes.value || []);
      if (countRes.status === "fulfilled") setStatusCounts(countRes.value);
    } catch (err: any) {
      console.error("Lỗi tải dashboard:", err);
      setError("Không thể đồng bộ toàn bộ dữ liệu thống kê từ máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-400">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        <span className="text-xs">Đang tải dữ liệu báo cáo kinh doanh...</span>
      </div>
    );
  }

  // Fallback calculations if endpoints have partial nulls
  const todayRevenue = summary?.revenue?.todayRevenue ?? stats?.todayRevenue ?? summary?.todayRevenue ?? 0;
  const monthlyRevenue = summary?.revenue?.monthRevenue ?? stats?.monthRevenue ?? stats?.thisMonthRevenue ?? 0;
  const pendingOrders = statusCounts?.pendingCount ?? statusCounts?.pending ?? summary?.statusCounts?.pendingCount ?? 0;

  // Chart items normalized
  const chartItems = (chartData?.data || []).map((val: any, idx: number) => {
    const revenue = typeof val === "number" ? val : (val?.revenue || 0);
    const label = chartData?.labels?.[idx] || (typeof val === "object" ? val?.label : `Ngày ${idx + 1}`) || `T${idx + 2}`;
    return { revenue, label };
  });

  // Max value for visual bar chart calculation
  const maxRevenueInChart =
    chartItems.length > 0
      ? Math.max(...chartItems.map((d: any) => d.revenue), 1)
      : 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Tổng quan kinh doanh
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Báo cáo doanh số bán hàng, đơn hàng chờ xử lý và lượng mỹ phẩm bán chạy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-rose-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tạo đơn POS nhanh
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards (4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu hôm nay */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Doanh thu hôm nay
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tracking-tight">
            {formatVND(todayRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Cập nhật theo thời gian thực
          </div>
        </div>

        {/* Doanh thu tháng này */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Doanh thu tháng này
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tracking-tight">
            {formatVND(monthlyRevenue)}
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
          </div>
        </div>

        {/* Đơn chờ duyệt */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Đơn hàng chờ duyệt
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">
            {pendingOrders} <span className="text-xs font-normal text-stone-400">đơn</span>
          </div>
          <Link
            href="/admin/orders?status=PENDING"
            className="mt-2 text-[11px] text-amber-700 font-bold hover:underline inline-block"
          >
            Xem danh sách chờ duyệt &rarr;
          </Link>
        </div>

        {/* Tổng mỹ phẩm đang bán */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Sản phẩm trong kho
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tracking-tight">
            {summary?.totalProducts ?? 0} <span className="text-xs font-normal text-stone-400">mặt hàng</span>
          </div>
          <Link
            href="/admin/products"
            className="mt-2 text-[11px] text-blue-600 font-bold hover:underline inline-block"
          >
            Quản lý kho hàng &rarr;
          </Link>
        </div>
      </div>

      {/* Chart Section & Status Breakdown (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-600" />
                Biểu đồ doanh thu gần đây
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Thống kê doanh thu bán mỹ phẩm theo ngày
              </p>
            </div>
          </div>

          {chartItems.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2">
              {chartItems.map((item, idx) => {
                const heightPercent = Math.max(
                  12,
                  Math.round((item.revenue / maxRevenueInChart) * 100)
                );

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-bold text-stone-400 group-hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {formatVND(item.revenue)}
                    </div>
                    <div
                      className="w-full max-w-[42px] bg-rose-100 group-hover:bg-rose-500 rounded-2xl transition-all duration-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute inset-x-0 top-0 h-2 bg-rose-400 rounded-t-2xl opacity-60" />
                    </div>
                    <div className="text-[10px] font-bold text-stone-500 truncate text-center w-full">
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-stone-400">
              Chưa có dữ liệu biểu đồ doanh thu trong tuần này.
            </div>
          )}
        </div>

        {/* Order Status Counts (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-600" />
            Tình trạng đơn hàng
          </h2>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Chờ xử lý (PENDING)
              </div>
              <span className="font-mono font-black text-amber-700 text-sm">
                {statusCounts?.pendingCount ?? statusCounts?.pending ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Đã xác nhận (CONFIRMED)
              </div>
              <span className="font-mono font-black text-blue-700 text-sm">
                {statusCounts?.confirmedCount ?? statusCounts?.confirmed ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Đang giao (SHIPPING)
              </div>
              <span className="font-mono font-black text-purple-700 text-sm">
                {statusCounts?.shippingCount ?? statusCounts?.shipping ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Hoàn tất (COMPLETED)
              </div>
              <span className="font-mono font-black text-emerald-700 text-sm">
                {statusCounts?.completedCount ?? statusCounts?.completed ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                Đã hủy (CANCELLED)
              </div>
              <span className="font-mono font-black text-stone-600 text-sm">
                {statusCounts?.cancelledCount ?? statusCounts?.cancelled ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products & Category Revenue (6 cols + 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 5 Products (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            Top mỹ phẩm bán chạy nhất
          </h2>

          {topSelling.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              Chưa có dữ liệu sản phẩm bán ra.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {topSelling.map((prod, idx) => (
                <div key={prod.productId} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono font-black text-xs text-rose-600">
                      #{idx + 1}
                    </span>
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image
                        src={prod.imageUrl || "/images/NoImage.jpg"}
                        alt={prod.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 line-clamp-1">
                        {prod.productName}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Đã bán: <span className="font-bold text-stone-700">{prod.totalQuantitySold ?? prod.soldQuantity ?? 0}</span> sp
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-rose-600">
                      {formatVND(prod.totalRevenue ?? prod.revenue ?? 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Revenue (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-600" />
            Doanh số theo danh mục
          </h2>

          {categoryRevenues.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              Chưa có doanh thu theo danh mục.
            </div>
          ) : (
            <div className="space-y-3">
              {categoryRevenues.map((cat) => (
                <div key={cat.categoryId} className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">{cat.categoryName}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{cat.totalOrders || 0} đơn hàng</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-stone-900">{formatVND(cat.revenue)}</div>
                    <div className="text-[10px] font-bold text-rose-600">{cat.percentage?.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
