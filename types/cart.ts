export interface CartItemResponse {
  id?: number; // CartItem ID in DB (null for guest)
  variantId: number;
  productId?: number;
  productName: string;
  variantName?: string;
  sku?: string;
  imageUrl?: string;
  price: number;
  salePrice?: number;
  effectivePrice: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface CartResponse {
  id?: number | null;
  userId?: number | null;
  items: CartItemResponse[];
  totalQuantity: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId?: number;
  variantId?: number;
  quantity: number;
}

export interface GuestCartItemRequest {
  variantId: number;
  quantity: number;
}
