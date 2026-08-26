"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItemResponse, CartResponse, GuestCartItemRequest } from "@/types/cart";
// [Mock Phase 1: Pure UI Template]
const cartService = {
  getCart: async () => null,
  getGuestCartPreview: async () => null,
  addToCart: async () => ({}),
  updateItemQuantity: async () => ({}),
  removeItem: async () => ({}),
  clearCart: async () => ({}),
  syncGuestCart: async () => ({}),
};

import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: CartResponse | null;
  items: CartItemResponse[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  isLoading: boolean;
  addToCart: (variantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (targetId: number, quantity: number) => Promise<void>;
  removeFromCart: (targetId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const GUEST_CART_KEY = "guest_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Khi thay đổi trạng thái đăng nhập: đồng bộ giỏ vãng lai hoặc tải giỏ người dùng
  useEffect(() => {
    if (isAuthenticated) {
      syncGuestCartToBackend();
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated]);

  // Lấy danh sách món từ LocalStorage cho khách vãng lai
  const getGuestCartItems = (): GuestCartItemRequest[] => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveGuestCartItems = (items: GuestCartItemRequest[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  };

  // Tải thông tin xem trước giỏ hàng cho khách vãng lai từ Backend (POST /guest-preview)
  const loadGuestCart = async () => {
    try {
      setIsLoading(true);
      const guestItems = getGuestCartItems();
      if (guestItems.length === 0) {
        setCart({
          id: null,
          userId: null,
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        });
        return;
      }

      const previewRes = await cartService.previewGuestCart(guestItems);
      setCart(previewRes);
    } catch (error) {
      console.warn("Lỗi tải xem trước giỏ hàng khách vãng lai:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Đồng bộ các món từ LocalStorage lên Database khi khách đăng nhập
  const syncGuestCartToBackend = async () => {
    try {
      setIsLoading(true);
      const guestItems = getGuestCartItems();

      if (guestItems.length > 0) {
        // Đẩy từng món lên backend
        for (const item of guestItems) {
          try {
            await cartService.addToCart(item.variantId, item.quantity);
          } catch (e) {
            console.warn("Lỗi gộp sản phẩm vào tài khoản:", e);
          }
        }
        // Xóa giỏ tạm sau khi đồng bộ
        if (typeof window !== "undefined") {
          localStorage.removeItem(GUEST_CART_KEY);
        }
      }

      // Tải giỏ hàng chính thức từ Database
      const userCart = await cartService.getCart();
      setCart(userCart);
    } catch (error) {
      console.warn("Lỗi tải giỏ hàng người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    if (isAuthenticated) {
      try {
        const userCart = await cartService.getCart();
        setCart(userCart);
      } catch (err) {
        console.warn("Lỗi refresh giỏ hàng user:", err);
      }
    } else {
      await loadGuestCart();
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (variantId: number, quantity: number = 1) => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const updated = await cartService.addToCart(variantId, quantity);
        setCart(updated);
      } else {
        // Chế độ khách vãng lai: cập nhật localStorage rồi gọi preview
        const currentItems = getGuestCartItems();
        const existing = currentItems.find((i) => i.variantId === variantId);

        let newItems: GuestCartItemRequest[];
        if (existing) {
          newItems = currentItems.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          newItems = [...currentItems, { variantId, quantity }];
        }

        saveGuestCartItems(newItems);
        const preview = await cartService.previewGuestCart(newItems);
        setCart(preview);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật số lượng (+ / -)
  const updateQuantity = async (targetId: number, quantity: number) => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const updated = await cartService.updateQuantity(targetId, quantity);
        setCart(updated);
      } else {
        // Khách vãng lai: targetId chính là variantId
        let currentItems = getGuestCartItems();
        if (quantity <= 0) {
          currentItems = currentItems.filter((i) => i.variantId !== targetId);
        } else {
          currentItems = currentItems.map((i) =>
            i.variantId === targetId ? { ...i, quantity } : i
          );
        }

        saveGuestCartItems(currentItems);
        const preview = await cartService.previewGuestCart(currentItems);
        setCart(preview);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa 1 món khỏi giỏ
  const removeFromCart = async (targetId: number) => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const updated = await cartService.deleteCartItem(targetId);
        setCart(updated);
      } else {
        const currentItems = getGuestCartItems().filter(
          (i) => i.variantId !== targetId
        );
        saveGuestCartItems(currentItems);
        const preview = await cartService.previewGuestCart(currentItems);
        setCart(preview);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const updated = await cartService.clearCart();
        setCart(updated);
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem(GUEST_CART_KEY);
        }
        setCart({
          id: null,
          userId: null,
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        });
      }
    } catch (error) {
      console.warn("Lỗi làm rỗng giỏ hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const items = cart?.items || [];
  const itemCount = cart?.totalQuantity || items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const subtotal = cart?.totalAmount || items.reduce((sum, i) => sum + (i.subtotal || 0), 0);
  // Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên, dưới 500k phí là 30.000đ
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        subtotal,
        shippingFee,
        totalAmount,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
