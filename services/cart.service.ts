import { api } from "./api";
import {
  AddToCartRequest,
  CartResponse,
  GuestCartItemRequest,
  UpdateCartItemRequest,
} from "@/types/cart";

export const cartService = {
  /**
   * Lấy giỏ hàng cho người dùng đã đăng nhập (GET /api/v1/cart)
   */
  getCart: async () => {
    const res = await api.get<CartResponse>("/cart");
    return res.data;
  },

  /**
   * Xem trước giỏ hàng cho Khách vãng lai từ LocalStorage (POST /api/v1/cart/guest-preview)
   * Không cần đăng nhập, tính giá & kiểm tra tồn kho thời gian thực
   */
  previewGuestCart: async (items: GuestCartItemRequest[]) => {
    const res = await api.post<CartResponse>("/cart/guest-preview", items);
    return res.data;
  },

  /**
   * Thêm sản phẩm vào giỏ hàng (POST /api/v1/cart/add)
   */
  addToCart: async (variantId: number, quantity: number = 1) => {
    const req: AddToCartRequest = { variantId, quantity };
    const res = await api.post<CartResponse>("/cart/add", req);
    return res.data;
  },

  /**
   * Cập nhật số lượng sản phẩm trong giỏ (PUT /api/v1/cart/items/{itemId})
   */
  updateQuantity: async (itemId: number, quantity: number) => {
    const req: UpdateCartItemRequest = { quantity };
    const res = await api.put<CartResponse>(`/cart/items/${itemId}`, req);
    return res.data;
  },

  /**
   * Xóa một sản phẩm khỏi giỏ hàng (DELETE /api/v1/cart/items/{itemId})
   */
  deleteCartItem: async (itemId: number) => {
    const res = await api.delete<CartResponse>(`/cart/items/${itemId}`);
    return res.data;
  },

  /**
   * Xóa toàn bộ giỏ hàng (DELETE /api/v1/cart/clear)
   */
  clearCart: async () => {
    const res = await api.delete<CartResponse>("/cart/clear");
    return res.data;
  },
};
