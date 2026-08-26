"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatVND } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const freeshipThreshold = 500000;
  const remainingForFreeship = Math.max(0, freeshipThreshold - subtotal);
  const freeshipPercent = Math.min(100, Math.round((subtotal / freeshipThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Chưa có sản phẩm nào trong giỏ. Hãy dạo quanh cửa hàng và chọn những thỏi son yêu thích nhé!
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-200 hover:shadow-lg hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bạn đang có <strong className="text-rose-600 font-bold">{itemCount}</strong> sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?")) {
                clearCart();
              }
            }}
            className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors"
          >
            Xóa toàn bộ giỏ
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Mua thêm son khác
          </Link>
        </div>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="mb-8 p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
          <span className="flex items-center gap-1.5 text-rose-600">
            <Truck className="w-4 h-4" />
            {remainingForFreeship === 0 ? (
              <span className="text-emerald-700 font-bold">
                🎉 Đơn hàng của bạn đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!
              </span>
            ) : (
              <span>
                Mua thêm <strong className="font-bold">{formatVND(remainingForFreeship)}</strong> để được Miễn Phí Vận Chuyển
              </span>
            )}
          </span>
          <span className="text-gray-500">{freeshipPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-rose-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
            style={{ width: `${freeshipPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const targetId = item.id || item.variantId;
            const isOutOfStock = !item.inStock;

            return (
              <div
                key={targetId}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-100/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-rose-200 transition-colors"
              >
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-rose-50 shrink-0 border border-rose-100">
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80"
                      }
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={item.productId ? `/product/${item.productId}` : "/products"}
                      className="text-sm sm:text-base font-bold text-gray-900 hover:text-rose-600 line-clamp-1 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    {item.variantName && (
                      <span className="inline-block text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                        Màu: {item.variantName}
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
                        <AlertCircle className="w-3 h-3" /> Tạm hết hàng hoặc vượt tồn kho
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing, Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity */}
                  <div className="flex items-center border border-rose-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <button
                      onClick={() => updateQuantity(targetId, item.quantity - 1)}
                      className="p-1.5 hover:bg-rose-50 text-gray-600 transition-colors"
                      title="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900 min-w-[32px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(targetId, item.quantity + 1)}
                      className="p-1.5 hover:bg-rose-50 text-gray-600 transition-colors"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <span className="text-sm sm:text-base font-black text-rose-600 block">
                      {formatVND(item.subtotal || item.effectivePrice * item.quantity)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatVND(item.effectivePrice)} / thỏi
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(targetId)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Xóa món này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-white border border-rose-100/80 shadow-lg space-y-6 sticky top-28">
            <h3 className="text-lg font-extrabold text-gray-900 pb-3 border-b border-rose-100">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng ({itemCount} món)</span>
                <span className="font-semibold text-gray-900">{formatVND(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                      MIỄN PHÍ
                    </span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-rose-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
                <span className="text-2xl font-black text-rose-600">
                  {formatVND(totalAmount)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-center text-sm shadow-lg shadow-rose-300/50 hover:shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              Tiến Hành Đặt Hàng
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Policy Notes */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo mật đơn hàng an toàn 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Hỗ trợ thanh toán COD, Bank QR & PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
