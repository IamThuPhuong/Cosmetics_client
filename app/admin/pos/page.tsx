"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/services/product.service";
// [Mock Phase 1: Pure UI Template]
const adminService = {
  getAdminProducts: async (p: any) => ({ content: [] }),
  createPosOrder: async (d: any) => ({ id: 1, orderCode: "POS-001" }),
};

import { ProductSummaryResponse, ProductResponse } from "@/types/product";
import { AdminOrderItemRequest, PaymentMethod } from "@/types/order";
import { formatVND } from "@/lib/utils";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShoppingBag,
  CreditCard,
  User,
  MapPin,
  Phone,
  Store,
} from "lucide-react";

interface POSSelectedItem {
  variantId: number;
  productName: string;
  variantInfo: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxStock: number;
}

export default function AdminPOSPage() {
  // Product Search State
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<ProductSummaryResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Selected Variant details modal / inline selector
  const [inspectingProduct, setInspectingProduct] = useState<ProductResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // POS Cart State
  const [selectedItems, setSelectedItems] = useState<POSSelectedItem[]>([]);

  // Customer Form
  const [fullName, setFullName] = useState("Khách vãng lai");
  const [phone, setPhone] = useState("0900000000");
  const [shippingAddress, setShippingAddress] = useState("Mua trực tiếp tại Showroom LuxeBeauty");
  const [orderSource, setOrderSource] = useState<"POS" | "PHONE" | "ZALO" | "FACEBOOK" | "WEB">("POS");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [note, setNote] = useState("");

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Tải danh sách sản phẩm ban đầu
  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  const fetchProducts = async () => {
    try {
      setIsSearching(true);
      const res = await productService.getProducts({
        keyword: keyword.trim() || undefined,
        size: 12,
      });
      setProducts(res.content || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = async (prodSummary: ProductSummaryResponse) => {
    try {
      setIsLoadingDetail(true);
      const fullProd = await productService.getProductById(prodSummary.id);
      setInspectingProduct(fullProd);
    } catch (err) {
      console.error("Lỗi lấy chi tiết sản phẩm:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleAddVariantToCart = (variant: any) => {
    if (!inspectingProduct) return;

    const existingIdx = selectedItems.findIndex((i) => i.variantId === variant.id);
    if (existingIdx > -1) {
      const updated = [...selectedItems];
      if (updated[existingIdx].quantity < (variant.stockQuantity || 999)) {
        updated[existingIdx].quantity += 1;
        setSelectedItems(updated);
      }
    } else {
      const variantName =
        [variant.variantName || variant.shadeName || variant.shadeColor, variant.capacity || (variant.volumeMl ? `${variant.volumeMl}ml` : "")]
          .filter(Boolean)
          .join(" - ") || "Tiêu chuẩn";

      const mainImg =
        inspectingProduct.productImages?.find((i) => i.isMain)?.imageUrl ||
        inspectingProduct.productImages?.[0]?.imageUrl ||
        inspectingProduct.thumbnailUrl ||
        "/images/NoImage.jpg";

      setSelectedItems([
        ...selectedItems,
        {
          variantId: variant.id,
          productName: inspectingProduct.name,
          variantInfo: variantName,
          price: variant.salePrice || variant.regularPrice || variant.price || 0,
          quantity: 1,
          imageUrl: variant.imageUrl || mainImg,
          maxStock: variant.stockQuantity || 999,
        },
      ]);
    }
    setInspectingProduct(null);
  };

  const handleUpdateQuantity = (variantId: number, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(nextQty, item.maxStock) } : null;
          }
          return item;
        })
        .filter(Boolean) as POSSelectedItem[]
    );
  };

  const handleRemoveItem = (variantId: number) => {
    setSelectedItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitPOSOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (selectedItems.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất 1 sản phẩm vào đơn hàng.");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !shippingAddress.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ tên khách hàng, số điện thoại và địa chỉ nhận.");
      return;
    }

    try {
      setIsSubmitting(true);
      const itemsPayload: AdminOrderItemRequest[] = selectedItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      const res = await adminService.createAdminOrder({
        fullName: fullName.trim(),
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
        orderSource,
        paymentMethod,
        note: note.trim() || undefined,
        items: itemsPayload,
      });

      setSuccessOrder(res);
      setSelectedItems([]);
    } catch (err: any) {
      console.error("Lỗi tạo đơn POS:", err);
      setErrorMessage(err?.message || "Không thể tạo đơn hàng POS. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-rose-600" />
            Tạo đơn POS &amp; Bán hàng tại quầy
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Giao diện bán hàng nhanh cho nhân viên Showroom, tiếp nhận qua Zalo, Facebook hoặc Hotline
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Gõ tìm kiếm tên sản phẩm mỹ phẩm, thương hiệu..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>

          {/* Product Grid */}
          {isSearching ? (
            <div className="py-20 text-center text-xs text-stone-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
              Đang tìm sản phẩm...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="bg-white rounded-2xl p-3 border border-stone-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-50 mb-2">
                    <Image
                      src={prod.imageUrl || prod.thumbnailUrl || "/images/NoImage.jpg"}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                      {prod.brandName}
                    </span>
                    <h4 className="text-xs font-bold text-stone-800 line-clamp-2 leading-snug">
                      {prod.name}
                    </h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-black text-rose-600">
                      {formatVND(prod.minPrice)}
                    </span>
                    <button className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: POS Order Summary & Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-rose-600" />
              Đơn hàng tại quầy ({selectedItems.length} mặt hàng)
            </h2>

            {/* Selected Items List */}
            <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
              {selectedItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  Chưa có sản phẩm nào được chọn. Hãy bấm vào sản phẩm bên trái để thêm vào đơn.
                </div>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.variantId} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-rose-600 font-medium">
                        {item.variantInfo} &bull; {formatVND(item.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.variantId, -1)}
                        className="w-6 h-6 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.variantId, 1)}
                        className="w-6 h-6 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.variantId)}
                        className="w-6 h-6 ml-1 rounded-lg text-stone-400 hover:text-rose-600 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Tổng tiền thanh toán:</span>
              <span className="text-base font-black text-rose-600">{formatVND(totalAmount)}</span>
            </div>

            {/* Customer & Delivery Form */}
            <form onSubmit={handleSubmitPOSOrder} className="space-y-3 pt-2 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase">
                    Kênh bán hàng
                  </label>
                  <select
                    value={orderSource}
                    onChange={(e) => setOrderSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-white"
                  >
                    <option value="POS">Tại quầy Showroom</option>
                    <option value="PHONE">Hotline điện thoại</option>
                    <option value="ZALO">Zalo Official</option>
                    <option value="FACEBOOK">Fanpage Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase">
                    Phương thức TT
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-white"
                  >
                    <option value="COD">Tiền mặt tại quầy (COD)</option>
                    <option value="BANK_TRANSFER">Chuyển khoản VietQR</option>
                    <option value="PAYPAL">PayPal Quốc tế</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase">
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase">
                  Ghi chú đơn hàng
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Gói quà sinh nhật, tặng thêm sample serum..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo đơn POS...
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4" />
                    Tạo đơn &amp; Xuất hóa đơn POS
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Variant Selector Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scaleIn">
            <h3 className="text-base font-black text-stone-900 mb-1">
              Chọn phân loại màu / dung tích
            </h3>
            <p className="text-xs text-stone-500 mb-4">{inspectingProduct.name}</p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {((inspectingProduct.productVariantResponses || inspectingProduct.variants || []) as any[]).length > 0 ? (
                ((inspectingProduct.productVariantResponses || inspectingProduct.variants || []) as any[]).map((variant: any) => (
                  <div
                    key={variant.id}
                    onClick={() => handleAddVariantToCart(variant)}
                    className="p-3 rounded-xl border border-stone-200 hover:border-rose-500 hover:bg-rose-50/30 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {variant.variantName || variant.shadeColor || variant.shadeName || "Tiêu chuẩn"}
                        {variant.capacity ? ` (${variant.capacity})` : variant.volumeMl ? ` (${variant.volumeMl}ml)` : ""}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Tồn kho: <span className="font-bold text-stone-700">{variant.stockQuantity}</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-rose-600">
                      {formatVND(variant.salePrice || variant.regularPrice || variant.price)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-stone-400">
                  Không có biến thể cho sản phẩm này.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingProduct(null)}
                className="px-4 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Success Modal */}
      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border-4 border-white shadow-md mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-1">
              Tạo đơn POS thành công!
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Mã đơn: <span className="font-mono font-bold text-rose-600 text-sm">#{successOrder.orderCode}</span>
            </p>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-left mb-6 space-y-1">
              <div>Khách hàng: <span className="font-bold">{successOrder.fullName || fullName}</span></div>
              <div>Tổng tiền: <span className="font-bold text-rose-600">{formatVND(successOrder.finalAmount || totalAmount)}</span></div>
              <div>Hình thức: <span className="font-bold">{orderSource}</span></div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSuccessOrder(null)}
                className="flex-1 py-2.5 rounded-full border border-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider"
              >
                Tạo đơn tiếp
              </button>
              <Link
                href={`/admin/orders`}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-block"
              >
                Xem danh sách
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
