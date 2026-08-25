"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// [Mock Phase 1: Pure UI Template]
const productService = {
  getProductById: async (id: any) => null,
  getRelatedProducts: async (id: any) => [],
};

import { useCart } from "@/context/CartContext";
import { ProductResponse, ProductVariantResponse } from "@/types/product";
import { formatVND } from "@/lib/utils";
import {
  ShoppingCart,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Heart,
  Share2,
  Loader2,
  ChevronRight,
  Info,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "skin" | "ingredients" | "usage">("desc");

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProductById(productId);
      if (data) {
        setProduct(data);

        // Chọn biến thể đầu tiên còn active
        const variants = data.productVariantResponses || [];
        if (variants.length > 0) {
          const defaultVariant = variants.find((v) => v.isActive && v.stockQuantity > 0) || variants[0];
          setSelectedVariant(defaultVariant);
        }

        // Chọn ảnh chính
        const images = data.productImages || [];
        const mainImg = images.find((img) => img.isMain) || images[0];
        if (mainImg) {
          setSelectedImage(mainImg.imageUrl);
        }
      }
    } catch (error) {
      console.warn("Lỗi tải chi tiết sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      setIsAdding(true);
      await addToCart(selectedVariant.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } catch (err: any) {
      alert(err?.message || "Không thể thêm vào giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    try {
      setIsAdding(true);
      await addToCart(selectedVariant.id, quantity);
      router.push("/checkout");
    } catch (err: any) {
      alert(err?.message || "Không thể tiến hành mua ngay");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
        <p className="text-base text-gray-500 font-medium">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-5xl">💄</span>
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 text-sm">Sản phẩm này có thể đã ngừng kinh doanh hoặc không tồn tại.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
        >
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const variants = product.productVariantResponses || [];
  const images = product.productImages || [];
  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || 0;
  const originalPrice = selectedVariant?.price || 0;
  const hasSale = selectedVariant?.salePrice && selectedVariant.salePrice < originalPrice;
  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-rose-600 transition-colors">
          Trang Chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link href="/products" className="hover:text-rose-600 transition-colors">
          Sản Phẩm
        </Link>
        {product.brand?.name && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-rose-600 font-semibold">{product.brand.name}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Detail Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-rose-50/40 border border-rose-100 shadow-lg">
            <img
              src={
                selectedImage ||
                images[0]?.imageUrl ||
                "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
              }
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.isFeatured && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> Nổi Bật
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img) => {
                const isCurrent = selectedImage === img.imageUrl;
                return (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      isCurrent
                        ? "border-rose-500 ring-2 ring-rose-200 scale-105"
                        : "border-gray-200 hover:border-rose-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Purchasing Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
              <span>{product.brand?.name || "Chính Hãng"}</span>
              {product.category?.name && <span>• {product.category.name}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-rose-600">
              {formatVND(currentPrice)}
            </span>
            {hasSale && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatVND(originalPrice)}
                </span>
                <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                  Tiết kiệm {Math.round((1 - (selectedVariant?.salePrice || 0) / originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Variants Selector (Shade Colors / Capacity) */}
          {variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center justify-between">
                <span>Chọn Màu Son / Biến Thể</span>
                {selectedVariant && (
                  <span className="text-rose-600 font-semibold normal-case">
                    Đang chọn: {selectedVariant.variantName}
                  </span>
                )}
              </label>

              <div className="flex flex-wrap gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isVariantOutOfStock = v.stockQuantity <= 0;

                  return (
                    <button
                      key={v.id}
                      disabled={!v.isActive || isVariantOutOfStock}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        isSelected
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-200 scale-102"
                          : isVariantOutOfStock
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                          : "bg-white text-gray-800 border-rose-100 hover:border-rose-300 hover:bg-rose-50/50"
                      }`}
                    >
                      {v.shadeColor && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0 shadow-xs"
                          style={{
                            backgroundColor: v.shadeColor.startsWith("#")
                              ? v.shadeColor
                              : "#c84a56",
                          }}
                        />
                      )}
                      <span>{v.variantName}</span>
                      {v.capacity && <span className="opacity-80">({v.capacity})</span>}
                      {isVariantOutOfStock && (
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded-full">
                          Hết
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-time Stock Status */}
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span className="font-semibold text-gray-800">Tình trạng kho:</span>
            {isOutOfStock ? (
              <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                Tạm thời hết hàng
              </span>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Còn {selectedVariant?.stockQuantity} sản phẩm
              </span>
            )}
          </div>

          {/* Quantity Selector & Purchase Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Số Lượng:
              </span>
              <div className="flex items-center border border-rose-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-rose-50 text-gray-700 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  disabled={
                    isOutOfStock ||
                    (selectedVariant ? quantity >= selectedVariant.stockQuantity : false)
                  }
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-rose-50 text-gray-700 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                  addedSuccess
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 animate-in zoom-in" />
                    Đã Thêm Vào Giỏ Hàng!
                  </>
                ) : isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang Thêm...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Thêm Vào Giỏ Hàng
                  </>
                )}
              </button>

              <button
                disabled={isOutOfStock || isAdding}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-700 hover:to-pink-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-300/50 hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                Mua Ngay
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Cards */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-rose-100 text-center text-xs text-gray-600">
            <div className="p-2 rounded-xl bg-rose-50/40 space-y-1">
              <ShieldCheck className="w-4 h-4 text-rose-600 mx-auto" />
              <p className="font-bold text-gray-800">100% Authentic</p>
              <p className="text-[10px] text-gray-500">Đền 200% nếu phát hiện giả</p>
            </div>
            <div className="p-2 rounded-xl bg-rose-50/40 space-y-1">
              <Truck className="w-4 h-4 text-rose-600 mx-auto" />
              <p className="font-bold text-gray-800">Freeship từ 500k</p>
              <p className="text-[10px] text-gray-500">Giao nhanh toàn quốc</p>
            </div>
            <div className="p-2 rounded-xl bg-rose-50/40 space-y-1">
              <RotateCcw className="w-4 h-4 text-rose-600 mx-auto" />
              <p className="font-bold text-gray-800">Đổi trả 7 ngày</p>
              <p className="text-[10px] text-gray-500">Nếu lỗi nhà sản xuất</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Chuyên Sâu Về Mỹ Phẩm */}
      <div className="mt-16 bg-white rounded-3xl border border-rose-100/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4 border-b border-rose-100 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: "desc", label: "Mô Tả Sản Phẩm" },
            { id: "skin", label: "Loại Da Phù Hợp" },
            { id: "ingredients", label: "Thành Phần Mỹ Phẩm" },
            { id: "usage", label: "Hướng Dẫn & Hạn Mở Nắp" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-bold pb-2 shrink-0 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "text-rose-600 border-rose-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 text-sm text-gray-700 leading-relaxed">
          {activeTab === "desc" && (
            <div className="space-y-4">
              <p>{product.description || "Dòng son môi cao cấp mang lại vẻ đẹp tự nhiên, rạng rỡ và quyến rũ cho mọi cô gái."}</p>
            </div>
          )}

          {activeTab === "skin" && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Loại Da Khuyên Dùng:</h4>
              <p className="px-4 py-3 bg-rose-50/50 rounded-2xl border border-rose-100">
                {product.suitableSkinType || "Phù hợp với mọi loại da, kể cả làn da nhạy cảm hoặc môi khô dễ bong tróc."}
              </p>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Bảng Thành Phần Chi Tiết:</h4>
              <p className="font-mono text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200 leading-normal">
                {product.ingredients || "Dimethicone, Polyglyceryl-2 Triisostearate, Bơ hạt mỡ hữu cơ, Dầu hạnh nhân, Vitamin E, Tinh dầu hoa hồng..."}
              </p>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Cách Sử Dụng:</h4>
                <p>{product.usageInstructions || "Thoa một lớp mỏng nhẹ lòng môi để tạo hiệu ứng ombre ngọt ngào, hoặc thoa full môi để tạo vẻ ngoài sang trọng quyến rũ."}</p>
              </div>
              <div className="pt-2">
                <span className="font-bold text-gray-900">Hạn Mở Nắp (PAO): </span>
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  {product.pao || "12M"} (12 tháng kể từ ngày mở hộp)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
