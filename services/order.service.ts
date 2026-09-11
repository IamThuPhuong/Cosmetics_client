import { api } from "./api";
import {
  OrderCreateRequest,
  OrderResponse,
  OrderSummaryResponse,
} from "@/types/order";
import { PageResponse } from "@/types/product";

export const orderService = {
  /**
   * Tạo đơn hàng mới cho Khách vãng lai và User đã đăng nhập (POST /api/v1/orders)
   */
  createOrder: async (request: OrderCreateRequest) => {
    const res = await api.post<OrderResponse>("/orders", request);
    return res.data;
  },

  /**
   * Lấy lịch sử đơn hàng của người dùng hiện tại (GET /api/v1/orders/my-orders)
   */
  getMyOrders: async (status?: string, page: number = 0, size: number = 10) => {
    const params: Record<string, any> = { page, size };
    if (status && status !== "ALL") {
      params.status = status;
    }
    const res = await api.get<PageResponse<OrderSummaryResponse>>(
      "/orders/my-orders",
      params
    );
    return res.data;
  },

  /**
   * Xem chi tiết đơn hàng theo mã đơn orderCode (GET /api/v1/orders/code/{orderCode})
   */
  getMyOrderDetailByCode: async (orderCode: string) => {
    const res = await api.get<OrderResponse>(`/orders/code/${orderCode}`);
    return res.data;
  },

  /**
   * Xem chi tiết đơn hàng theo ID (GET /api/v1/orders/{orderId})
   */
  getMyOrderDetailById: async (orderId: number | string) => {
    const res = await api.get<OrderResponse>(`/orders/${orderId}`);
    return res.data;
  },

  /**
   * Khách tự hủy đơn hàng PENDING (PATCH /api/v1/orders/{orderId}/cancel)
   */
  cancelMyOrder: async (orderId: number | string, reason: string = "Khách hàng yêu cầu hủy đơn") => {
    const res = await api.patch<OrderResponse>(
      `/orders/${orderId}/cancel`,
      null,
      { reason }
    );
    return res.data;
  },
};
