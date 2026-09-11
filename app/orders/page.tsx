"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/order.service";
import { OrderSummaryResponse, OrderStatus } from "@/types/order";
import {
  formatVND,
  formatDate,
  getOrderStatusInfo,
  getPaymentStatusInfo,
} from "@/lib/utils";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Eye,
  Ban,
  Search,
} from "lucide-react";

const STATUS_TABS: { label: string; value: string; count?: number }[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Hoàn tất", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<OrderSummaryResponse[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal hủy đơn
  const [cancellingOrder, setCancellingOrder] = useState<OrderSummaryResponse | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyOrders(activeTab, currentPage, 10);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, fetchOrders]);

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;
    try {
      setIsCancelling(true);
      setCancelError("");
      await orderService.cancelMyOrder(
        cancellingOrder.id,
        cancelReason.trim() || "Khách hàng đổi ý muốn mua lại sau"
      );
      setCancellingOrder(null);
      setCancelReason("");
      fetchOrders();
    } catch (err: any) {
      setCancelError(err?.message || "Không thể hủy đơn hàng này. Vui lòng thử lại!");
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rose-100">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Đăng nhập để xem đơn hàng</h1>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Vui lòng đăng nhập tài khoản của bạn để tra cứu lịch sử mua hàng, tình trạng giao hàng và tiến trình xử lý đơn.
          </p>
          <Link
            href="/login?redirect=/orders"
            className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/25 flex items-center justify-center gap-2"
          >
            Đăng nhập ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Đơn hàng của tôi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý và theo dõi hành trình giao nhận các đơn hàng mỹ phẩm của bạn
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
        >
          <ShoppingBag className="w-4 h-4" />
          Tiếp tục mua hàng
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(0);
              }}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                  : "bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200/80"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <span className="text-xs">Đang tải danh sách đơn hàng...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 inline-flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Chưa có đơn hàng nào</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Bạn chưa có đơn hàng nào ở trạng thái này. Khám phá các dòng mỹ phẩm chính hãng tại LuxeBeauty nhé!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            Mua sắm ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.orderStatus);
            const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
            const canCancel = order.orderStatus === "PENDING";

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-rose-100/80 hover:border-rose-200 transition-all"
              >
                {/* Header bar of order card */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-gray-900 tracking-wider">
                      #{order.orderCode}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status badges */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}
                    >
                      {statusInfo.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${paymentInfo.bgClass} ${paymentInfo.textClass}`}
                    >
                      {paymentInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content preview */}
                <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                      <Image
                        src={order.firstProductImage || "/images/NoImage.jpg"}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 mb-1">
                        Đơn hàng gồm {order.totalQuantity || 1} sản phẩm
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Người nhận: <span className="font-medium text-gray-700">{order.fullName || "Khách hàng"}</span>
                        {order.phone && <span> ({order.phone})</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:pl-6 border-gray-100 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <div className="text-[11px] text-gray-400">Tổng thanh toán:</div>
                    <div className="text-base font-black text-rose-600">
                      {formatVND(order.finalAmount || order.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  {canCancel && (
                    <button
                      onClick={() => setCancellingOrder(order)}
                      className="px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Hủy đơn hàng
                    </button>
                  )}

                  <Link
                    href={`/orders/${order.id}`}
                    className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-rose-500/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Trang trước
              </button>
              <span className="text-xs text-gray-500 font-medium px-2">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal xác nhận hủy đơn */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              Xác nhận hủy đơn hàng #{cancellingOrder.orderCode}?
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Thao tác này sẽ cập nhật trạng thái đơn hàng sang ĐÃ HỦY và hoàn lại số lượng tồn kho mỹ phẩm.
            </p>

            {cancelError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs">
                {cancelError}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Lý do hủy đơn (Tùy chọn):
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="VD: Muốn đổi màu son khác, đặt nhầm số lượng..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => {
                  setCancellingOrder(null);
                  setCancelError("");
                }}
                className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelOrder}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đồng ý hủy đơn"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
