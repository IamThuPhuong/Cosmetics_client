"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  QrCode,
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { formatVND } from "@/lib/utils";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderCode = searchParams.get("orderCode");
  const paypalOrderId = searchParams.get("paypalOrderId");
  const paymentMethod = searchParams.get("paymentMethod");
  const status = searchParams.get("status");

  const isPayPal = Boolean(paypalOrderId) || paymentMethod === "PAYPAL";
  const isBankTransfer = paymentMethod === "BANK_TRANSFER";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 max-w-3xl">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-rose-100/40 border border-rose-100 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-rose-100/50 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 border-4 border-white shadow-lg shadow-emerald-500/20 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Cảm ơn bạn đã tin tưởng LuxeBeauty. Đơn hàng của bạn đã được tiếp nhận và nhân viên tư vấn sẽ chuẩn bị đóng gói sản phẩm cẩn thận.
        </p>

        {/* Order Code Highlight */}
        {orderCode && (
          <div className="inline-flex items-center gap-3 bg-rose-50/70 border border-rose-200/80 px-6 py-3 rounded-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Mã đơn hàng:
            </span>
            <span className="font-mono text-base font-black text-rose-950 tracking-wider">
              {orderCode}
            </span>
          </div>
        )}

        {/* Payment Specific Information */}
        {isPayPal && (
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 mb-8 text-left text-sm text-blue-900">
            <div className="flex items-center gap-2 font-bold mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              Thanh toán PayPal Sandbox đã được xác nhận
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              Giao dịch trực tuyến của bạn đã được ghi nhận thành công trên hệ thống thanh toán quốc tế PayPal.
              {paypalOrderId && (
                <span className="block mt-1 font-mono text-[11px] text-blue-600">
                  PayPal Order ID: {paypalOrderId}
                </span>
              )}
            </p>
          </div>
        )}

        {isBankTransfer && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center gap-2 font-black text-amber-950 text-sm mb-3">
              <QrCode className="w-5 h-5 text-amber-600" />
              Thông tin chuyển khoản ngân hàng (VietQR)
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 bg-white/80 p-3.5 rounded-xl border border-amber-100">
                <div className="text-gray-400 font-medium">Ngân hàng thụ hưởng:</div>
                <div className="font-bold text-gray-900">MB Bank (Quân Đội)</div>
                <div className="text-gray-400 font-medium pt-1">Số tài khoản:</div>
                <div className="font-mono font-bold text-base text-rose-600">8888 6666 9999</div>
                <div className="text-gray-400 font-medium pt-1">Chủ tài khoản:</div>
                <div className="font-bold text-gray-900 uppercase">LUXEBEAUTY COSMETICS</div>
              </div>
              <div className="space-y-1.5 bg-white/80 p-3.5 rounded-xl border border-amber-100">
                <div className="text-gray-400 font-medium">Nội dung chuyển khoản:</div>
                <div className="font-mono font-black text-sm text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200 inline-block">
                  DH {orderCode || "MA_DON_HANG"}
                </div>
                <div className="text-[11px] text-amber-800 leading-relaxed pt-2">
                  * Vui lòng chuyển khoản đúng cú pháp để hệ thống tự động xác nhận đơn hàng trong vòng 5-15 phút.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps / Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-8">
          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-4">
            <Clock className="w-5 h-5 text-rose-500 mb-2" />
            <div className="text-xs font-bold text-stone-900 mb-1">Xác nhận nhanh</div>
            <div className="text-[11px] text-stone-500 leading-relaxed">
              Tổng đài viên sẽ gọi xác nhận đơn hàng trong giờ hành chính.
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-4">
            <Package className="w-5 h-5 text-rose-500 mb-2" />
            <div className="text-xs font-bold text-stone-900 mb-1">Đóng gói cẩn thận</div>
            <div className="text-[11px] text-stone-500 leading-relaxed">
              100% bọc túi khí chống sốc 3 lớp, kèm quà tặng sample cao cấp.
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-4">
            <ShieldCheck className="w-5 h-5 text-rose-500 mb-2" />
            <div className="text-xs font-bold text-stone-900 mb-1">Cam kết chính hãng</div>
            <div className="text-[11px] text-stone-500 leading-relaxed">
              Đồng kiểm khi nhận hàng, hoàn tiền 200% nếu phát hiện hàng giả.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/20 active:scale-[0.98]"
          >
            <Package className="w-4 h-4" />
            Xem lịch sử đơn hàng
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Tiếp tục mua sắm
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Support Contact */}
        <div className="mt-10 pt-6 border-t border-stone-100 text-xs text-stone-400 flex items-center justify-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
          Cần hỗ trợ gấp? Gọi ngay hotline miễn cước:{" "}
          <span className="font-bold text-stone-700">1900 6868</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
