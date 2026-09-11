"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { OrderResponse } from "@/types/order";
import {
  formatVND,
  formatDate,
  getOrderStatusInfo,
  getPaymentStatusInfo,
  getPaymentMethodLabel,
} from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Ban,
  Printer,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";

const TIMELINE_STEPS = [
  { key: "PENDING", label: "Tiếp nhận đơn" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "SHIPPING", label: "Đang giao hàng" },
  { key: "COMPLETED", label: "Đã hoàn tất" },
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Modal hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      let data: OrderResponse;
      // Nếu orderId là số thì gọi theo ID, nếu là mã chuỗi thì gọi theo Code
      if (!isNaN(Number(orderId))) {
        data = await orderService.getMyOrderDetailById(orderId);
      } else {
        data = await orderService.getMyOrderDetailByCode(orderId);
      }
      setOrder(data);
    } catch (err: any) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
      setErrorMessage(err?.message || "Không tìm thấy thông tin đơn hàng này.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setIsCancelling(true);
      await orderService.cancelMyOrder(
        order.id,
        cancelReason.trim() || "Khách hàng đổi ý muốn mua lại sau"
      );
      setShowCancelModal(false);
      setCancelReason("");
      fetchOrderDetail();
    } catch (err: any) {
      alert(err?.message || "Không thể hủy đơn hàng này.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        <span className="text-xs">Đang tải chi tiết đơn hàng...</span>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-rose-100">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            {errorMessage || "Mã đơn hàng không hợp lệ hoặc bạn không có quyền truy cập đơn hàng này."}
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider"
          >
            Quay lại danh sách đơn
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.orderStatus);
  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
  const isCancelled = order.orderStatus === "CANCELLED";

  // Tính vị trí timeline
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách đơn hàng
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl bg-white cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          In hóa đơn
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-rose-100 space-y-8">
        {/* Header Title */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-mono text-xl sm:text-2xl font-black text-gray-900 tracking-wider">
                #{order.orderCode}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Đặt lúc: <span className="text-gray-700 font-medium">{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {order.orderStatus === "PENDING" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              Hủy đơn hàng
            </button>
          )}
        </div>

        {/* Timeline Stepper (if not cancelled) */}
        {!isCancelled ? (
          <div className="py-4">
            <div className="relative flex items-center justify-between max-w-xl mx-auto">
              {/* Connector line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-rose-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (TIMELINE_STEPS.length - 1)) * 100}%`,
                }}
              />

              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isPassed
                          ? "bg-rose-600 text-white shadow-md shadow-rose-500/30"
                          : "bg-white text-gray-400 border-2 border-gray-200"
                      } ${isCurrent ? "ring-4 ring-rose-100" : ""}`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-[11px] font-bold whitespace-nowrap ${
                        isCurrent ? "text-rose-600" : isPassed ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <Ban className="w-4 h-4 shrink-0" />
            <span>Đơn hàng này đã bị hủy. Tồn kho sản phẩm đã được tự động hoàn lại cho hệ thống.</span>
          </div>
        )}

        {/* Product Items Table */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-rose-500" />
            Danh sách mỹ phẩm đã đặt
          </h2>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-stone-50/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <Image
                      src={item.imageUrl || "/images/NoImage.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 leading-snug">
                      {item.productName}
                    </div>
                    {item.variantInfo && (
                      <div className="text-[11px] text-rose-600 font-medium mt-0.5">
                        Phân loại: {item.variantInfo}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Đơn giá: {formatVND(item.price)} x {item.quantity}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-gray-900">
                    {formatVND((item.subtotal || item.price * item.quantity))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receiver & Payment Information (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Shipping Details */}
          <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              Thông tin nhận hàng
            </div>
            <div className="text-xs space-y-1.5 text-gray-600">
              <div>
                <span className="text-gray-400">Người nhận:</span>{" "}
                <span className="font-bold text-gray-900">{order.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400">Số điện thoại:</span>{" "}
                <span className="font-bold text-gray-900">{order.phone}</span>
              </div>
              {order.email && (
                <div>
                  <span className="text-gray-400">Email:</span> {order.email}
                </div>
              )}
              <div>
                <span className="text-gray-400">Địa chỉ:</span>{" "}
                <span className="text-gray-800">{order.shippingAddress}</span>
              </div>
              {order.note && (
                <div className="pt-1 text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200">
                  Ghi chú: &ldquo;{order.note}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Payment Details & Totals */}
          <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-500" />
              Thanh toán &amp; Chi phí
            </div>
            <div className="text-xs space-y-2 text-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Phương thức:</span>
                <span className="font-bold text-gray-900">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Trạng thái thanh toán:</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${paymentInfo.bgClass} ${paymentInfo.textClass}`}
                >
                  {paymentInfo.label}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200/60 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Tạm tính hàng:</span>
                  <span>{formatVND(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Phí giao hàng:</span>
                  <span>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-600 font-medium">
                    <span>Giảm giá:</span>
                    <span>-{formatVND(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-rose-600 pt-2 border-t border-stone-200/80">
                  <span>Tổng thanh toán:</span>
                  <span>{formatVND(order.finalAmount || order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              Xác nhận hủy đơn #{order.orderCode}?
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi hủy, bạn sẽ cần đặt lại nếu vẫn muốn mua hàng.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Lý do hủy đơn:
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="VD: Muốn đổi phân loại sản phẩm khác..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setShowCancelModal(false)}
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
                    Đang hủy...
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
