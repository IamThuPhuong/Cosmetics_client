"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
// [Mock Phase 1: Pure UI Template]
const adminService = {
  getAdminOrders: async (p: any) => ({ content: [], totalPages: 1 }),
  updateOrderStatus: async (id: any, s: any) => ({}),
};

import {
  OrderSummaryResponse,
  OrderStatus,
  PaymentStatus,
  OrderFilterParams,
  OrderStatusUpdateRequest,
} from "@/types/order";
import {
  formatVND,
  formatDate,
  getOrderStatusInfo,
  getPaymentStatusInfo,
  getPaymentMethodLabel,
} from "@/lib/utils";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Edit3,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  RefreshCw,
  FileText,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderSummaryResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("");

  // Modal State Update
  const [selectedOrder, setSelectedOrder] = useState<OrderSummaryResponse | null>(null);
  const [orderDetail, setOrderDetail] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>("PENDING");
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [internalNote, setInternalNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: OrderFilterParams = {
        page: currentPage,
        size: 10,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedStatus && selectedStatus !== "ALL") params.status = selectedStatus as OrderStatus;
      if (selectedPaymentStatus && selectedPaymentStatus !== "ALL") params.paymentStatus = selectedPaymentStatus as PaymentStatus;

      const data = await adminService.getAllOrders(params);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err: any) {
      console.error("Lỗi lấy danh sách đơn:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, keyword, selectedStatus, selectedPaymentStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenEditModal = async (order: OrderSummaryResponse) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setUpdateMessage(null);
    setShowModal(true);

    try {
      setIsDetailLoading(true);
      const detail = await adminService.getAdminOrderDetail(order.id);
      setOrderDetail(detail);
      setInternalNote(detail?.internalNote || "");
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn admin:", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      setUpdateMessage(null);

      // Cập nhật trạng thái đơn & thanh toán
      const updateReq: OrderStatusUpdateRequest = {
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
        note: internalNote.trim() || undefined,
      };
      await adminService.updateOrderStatus(selectedOrder.id, updateReq);

      // Cập nhật ghi chú nội bộ nếu có
      if (internalNote.trim()) {
        await adminService.updateInternalNote(selectedOrder.id, internalNote.trim());
      }

      setUpdateMessage({ type: "success", text: "Đã cập nhật trạng thái đơn hàng thành công!" });
      fetchOrders();

      setTimeout(() => {
        setShowModal(false);
      }, 1200);
    } catch (err: any) {
      setUpdateMessage({
        type: "error",
        text: err?.message || "Cập nhật thất bại. Vui lòng thử lại!",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Quản lý Đơn hàng
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tổng số: <span className="font-bold text-stone-800">{totalElements}</span> đơn hàng trên toàn hệ thống
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Tìm theo mã đơn, họ tên, số điện thoại..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="">Tất cả trạng thái đơn</option>
          <option value="PENDING">Chờ xử lý (PENDING)</option>
          <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
          <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
          <option value="COMPLETED">Hoàn tất (COMPLETED)</option>
          <option value="CANCELLED">Đã hủy (CANCELLED)</option>
        </select>

        {/* Payment Filter */}
        <select
          value={selectedPaymentStatus}
          onChange={(e) => {
            setSelectedPaymentStatus(e.target.value);
            setCurrentPage(0);
          }}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
        >
          <option value="">Tất cả trạng thái thanh toán</option>
          <option value="PENDING">Chưa thanh toán</option>
          <option value="PAID">Đã thanh toán (PAID)</option>
          <option value="REFUNDED">Đã hoàn tiền (REFUNDED)</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            <span className="text-xs">Đang tải danh sách đơn hàng...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Mã đơn</th>
                  <th className="py-3.5 px-4">Ngày tạo</th>
                  <th className="py-3.5 px-4">Khách hàng</th>
                  <th className="py-3.5 px-4">Số lượng</th>
                  <th className="py-3.5 px-4">Tổng tiền</th>
                  <th className="py-3.5 px-4">Trạng thái đơn</th>
                  <th className="py-3.5 px-4">Thanh toán</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.orderStatus);
                  const payInfo = getPaymentStatusInfo(order.paymentStatus);

                  return (
                    <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        #{order.orderCode}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{order.fullName || "Khách vãng lai"}</div>
                        <div className="text-[11px] text-stone-400">{order.phone || "---"}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {order.totalQuantity || 1} sp
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-600 whitespace-nowrap">
                        {formatVND(order.finalAmount || order.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${payInfo.bgClass} ${payInfo.textClass}`}
                        >
                          {payInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-700 font-bold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Modal Cập nhật trạng thái đơn */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  Xử lý đơn hàng #{selectedOrder.orderCode}
                </h3>
                <span className="text-xs text-stone-400">
                  Tạo lúc: {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateMessage && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  updateMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {updateMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{updateMessage.text}</span>
              </div>
            )}

            {/* Order Items Preview */}
            {isDetailLoading ? (
              <div className="py-6 text-center text-xs text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                Đang tải thông tin sản phẩm...
              </div>
            ) : orderDetail?.items ? (
              <div className="mb-6 bg-stone-50 rounded-2xl p-4 border border-stone-200/70 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  Sản phẩm trong đơn ({orderDetail.items.length})
                </div>
                <div className="divide-y divide-stone-200/50 max-h-40 overflow-y-auto">
                  {orderDetail.items.map((item: any) => (
                    <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-800">{item.productName}</span>
                        {item.variantInfo && (
                          <span className="text-[11px] text-rose-600 block">
                            Phân loại: {item.variantInfo}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500">{item.quantity} x {formatVND(item.price)}</span>
                        <div className="font-bold text-stone-900">{formatVND(item.subtotal || item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-black text-rose-600">
                  <span>Tổng tiền thanh toán:</span>
                  <span>{formatVND(orderDetail.finalAmount || orderDetail.totalAmount)}</span>
                </div>
              </div>
            ) : null}

            {/* Edit Form */}
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="PENDING">Chờ xử lý (PENDING)</option>
                    <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                    <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
                    <option value="COMPLETED">Đã hoàn tất (COMPLETED)</option>
                    <option value="CANCELLED">Hủy đơn (CANCELLED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Trạng thái thanh toán
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="PENDING">Chưa thanh toán (PENDING)</option>
                    <option value="PAID">Đã thanh toán (PAID)</option>
                    <option value="REFUNDED">Đã hoàn tiền (REFUNDED)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Ghi chú nội bộ Admin
                </label>
                <textarea
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Ghi chú nội bộ cho nhân viên kho / vận đơn..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-full border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu cập nhật"
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
