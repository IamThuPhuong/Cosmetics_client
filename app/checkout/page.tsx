"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
// [Mock Phase 1: Pure UI Template]
const orderService = {
  createOrder: async (req: any) => ({ id: 1, orderCode: "ORD-MOCK-001" }),
};

import { paymentService } from "@/services/payment.service";
import { PaymentMethod } from "@/types/order";
import { formatVND } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Tự động điền thông tin nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  // Nếu giỏ hàng trống thì quay về trang giỏ hàng
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên người nhận");
      return;
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      setErrorMessage("Số điện thoại không đúng định dạng Việt Nam (10 chữ số, ví dụ 0912345678)");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ giao hàng chi tiết");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Gửi request tạo đơn hàng
      const validCartItemIds = items.map((i) => i.id).filter(Boolean) as number[];
      const orderItems = items
        .filter((i) => i.variantId)
        .map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity || 1,
        }));

      const orderResponse = await orderService.createOrder({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        note: note.trim() || undefined,
        selectedCartItemIds: validCartItemIds.length > 0 ? validCartItemIds : undefined,
        items: orderItems,
      });

      if (!orderResponse || !orderResponse.orderCode) {
        throw new Error("Không nhận được mã đơn hàng từ hệ thống");
      }

      // 2. Nếu chọn thanh toán PayPal -> Khởi tạo phiên PayPal và chuyển hướng sang PayPal Sandbox
      if (paymentMethod === "PAYPAL") {
        try {
          const paypalRes = await paymentService.createPayPalPayment(
            orderResponse.orderCode,
            orderResponse.id
          );

          if (paypalRes && paypalRes.approvalUrl) {
            // Làm sạch giỏ hàng trước khi chuyển hướng
            await clearCart();
            window.location.href = paypalRes.approvalUrl;
            return;
          } else {
            throw new Error("Không thể tạo phiên thanh toán PayPal");
          }
        } catch (paypalErr: any) {
          console.error("Lỗi PayPal:", paypalErr);
          setErrorMessage(
            paypalErr?.message ||
              "Lỗi tạo phiên PayPal. Đơn hàng của bạn đã được tạo, vui lòng thử lại sau."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // 3. Nếu là COD hoặc BANK_TRANSFER hoặc VNPAY -> Dọn giỏ hàng & chuyển sang trang thành công
      await clearCart();
      router.push(
        `/checkout/success?orderCode=${orderResponse.orderCode}&paymentMethod=${paymentMethod}`
      );
    } catch (error: any) {
      setErrorMessage(error?.message || "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Back to Cart */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery Form & Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Thông Tin Đặt Hàng & Thanh Toán
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Vui lòng điền thông tin người nhận để LuxeBeauty tiến hành đóng gói và giao hàng
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitOrder} id="checkout-form" className="space-y-6">
            {/* Section 1: Thông tin người nhận */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-rose-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Thông Tin Người Nhận
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Email (nhận thông báo đơn hàng)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Địa Chỉ Nhận Hàng Chi Tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50/50 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Ghi chú cho Shipper
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Section 2: Phương thức thanh toán */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-rose-100">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Chọn Phương Thức Thanh Toán
              </h3>

              <div className="space-y-3">
                {/* 1. COD */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-rose-500 bg-rose-50/40 shadow-xs"
                      : "border-gray-200 hover:border-rose-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 accent-rose-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-bold text-gray-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Thanh toán tiền mặt trực tiếp cho nhân viên bưu tá khi nhận được kiện hàng mỹ phẩm.
                    </p>
                  </div>
                </label>

                {/* 2. Chuyển khoản ngân hàng QR */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-rose-500 bg-rose-50/40 shadow-xs"
                      : "border-gray-200 hover:border-rose-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="mt-1 accent-rose-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-gray-900">
                        Chuyển khoản Ngân Hàng (Quét mã VietQR)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Chuyển khoản qua số tài khoản cửa hàng sau khi đặt, kèm mã QR tiện lợi.
                    </p>
                  </div>
                </label>

                {/* 3. Cổng Quốc Tế PayPal Sandbox */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "PAYPAL"
                      ? "border-rose-500 bg-rose-50/40 shadow-xs"
                      : "border-gray-200 hover:border-rose-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "PAYPAL"}
                    onChange={() => setPaymentMethod("PAYPAL")}
                    className="mt-1 accent-rose-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-indigo-700">PayPal</span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        Quốc tế & Visa/Mastercard
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Hệ thống sẽ tự động chuyển hướng bạn sang trang thanh toán bảo mật của PayPal Sandbox để hoàn tất giao dịch.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white border border-rose-100/80 shadow-lg space-y-6 sticky top-28">
            <h3 className="text-lg font-extrabold text-gray-900 pb-3 border-b border-rose-100">
              Đơn Hàng Của Bạn ({items.length} món)
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id || item.variantId} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-rose-100">
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-rose-600 font-medium">
                      {item.variantName} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right text-xs font-bold text-gray-900">
                    {formatVND(item.subtotal || item.effectivePrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-rose-100 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-semibold text-gray-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Miễn Phí
                    </span>
                  ) : (
                    formatVND(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-rose-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Tổng thanh toán</span>
                <span className="text-2xl font-black text-rose-600">
                  {formatVND(totalAmount)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-rose-300/50 hover:shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang Xử Lý Đơn Hàng...
                </>
              ) : paymentMethod === "PAYPAL" ? (
                <>
                  <Lock className="w-4 h-4" />
                  Thanh Toán Ngay Với PayPal →
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Xác Nhận Đặt Hàng Ngay
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              Bằng việc bấm đặt hàng, bạn đồng ý với các Điều khoản mua sắm và Chính sách bảo mật của LuxeBeauty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
