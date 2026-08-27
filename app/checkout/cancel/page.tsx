"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  XCircle,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
  PhoneCall,
  HelpCircle,
  CreditCard,
} from "lucide-react";

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams.get("paypalOrderId");
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  const isError = status === "error";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 max-w-2xl">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-rose-100/30 border border-stone-200 text-center relative overflow-hidden">
        {/* Warning Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 text-rose-500 border-4 border-white shadow-lg shadow-rose-500/20 mb-6">
          <XCircle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
          {isError ? "Lỗi trong quá trình thanh toán" : "Thanh toán chưa hoàn tất"}
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
          {isError
            ? (message || "Không thể hoàn tất xác nhận thanh toán với PayPal. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.")
            : "Giao dịch qua cổng PayPal đã bị hủy hoặc chưa được xác nhận. Tài khoản của bạn chưa bị trừ tiền cho giao dịch này."}
        </p>

        {/* Order Code / Paypal ID */}
        {(orderCode || paypalOrderId) && (
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 mb-8 max-w-md mx-auto">
            {orderCode && (
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-400">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-stone-800">{orderCode}</span>
              </div>
            )}
            {paypalOrderId && (
              <div className="flex justify-between py-1">
                <span className="text-stone-400">PayPal Ref:</span>
                <span className="font-mono text-stone-600">{paypalOrderId}</span>
              </div>
            )}
          </div>
        )}

        {/* Suggested Actions */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 mb-8 text-left text-xs text-stone-700">
          <div className="font-bold text-rose-950 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-rose-500" />
            Bạn muốn tiếp tục xử lý đơn hàng?
          </div>
          <ul className="space-y-2 text-stone-600 list-disc list-inside">
            <li>Bạn có thể chọn phương thức <strong>Thanh toán khi nhận hàng (COD)</strong> tiện lợi và an toàn.</li>
            <li>Hoặc thanh toán qua <strong>Chuyển khoản VietQR</strong> với tốc độ duyệt tự động.</li>
            <li>Liên hệ hotline nếu bạn gặp trở ngại kỹ thuật với cổng thanh toán.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/cart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/20 active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            Quay lại giỏ hàng &amp; Đặt lại
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Xem các sản phẩm khác
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Support */}
        <div className="mt-10 pt-6 border-t border-stone-100 text-xs text-stone-400 flex items-center justify-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
          Hotline chăm sóc khách hàng:{" "}
          <span className="font-bold text-stone-700">1900 6868</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CheckoutCancelContent />
    </Suspense>
  );
}
