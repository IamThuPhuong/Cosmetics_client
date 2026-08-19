export type PaymentMethod = "COD" | "VNPAY" | "BANK_TRANSFER" | "PAYPAL";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItemResponse {
  id: number;
  variantId: number;
  productName: string;
  variantInfo?: string;
  price: number;
  quantity: number;
  subtotal?: number;
  imageUrl?: string;
}

export interface OrderSummaryResponse {
  id: number;
  orderCode: string;
  totalAmount: number;
  finalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  totalQuantity: number;
  firstProductImage?: string;
  fullName?: string;
  phone?: string;
}

export interface OrderResponse {
  id: number;
  orderCode: string;
  userId?: number;
  fullName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderStatusDescription?: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItemResponse[];
}

export interface OrderCreateRequest {
  fullName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  selectedCartItemIds?: number[];
  note?: string;
  items?: {
    variantId: number;
    quantity: number;
  }[];
}

export interface AdminOrderItemRequest {
  variantId: number;
  quantity: number;
  unitPrice?: number;
}

export interface AdminOrderCreateRequest {
  fullName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  orderSource?: "POS" | "PHONE" | "ZALO" | "FACEBOOK" | "WEB";
  paymentMethod?: PaymentMethod;
  note?: string;
  items: AdminOrderItemRequest[];
}

export interface OrderStatusUpdateRequest {
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  note?: string;
}

export interface OrderFilterParams {
  keyword?: string;
  orderCode?: string;
  phone?: string;
  orderStatus?: OrderStatus;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
