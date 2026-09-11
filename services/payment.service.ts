import { api } from "./api";
import {
  PaymentTransactionResponse,
  PayPalCaptureRequest,
  PayPalCaptureResponse,
  PayPalPaymentRequest,
  PayPalPaymentResponse,
} from "@/types/payment";

export const paymentService = {
  /**
   * Khởi tạo phiên thanh toán PayPal và lấy URL duyệt approvalUrl (POST /api/v1/payments/paypal/create)
   */
  createPayPalPayment: async (orderCode: string, orderId?: number) => {
    const req: PayPalPaymentRequest = { orderCode, orderId };
    const res = await api.post<PayPalPaymentResponse>(
      "/payments/paypal/create",
      req
    );
    return res.data;
  },

  /**
   * REST API Capture thanh toán sau khi khách duyệt trên PayPal (POST /api/v1/payments/paypal/capture)
   */
  capturePayPalPayment: async (paypalOrderId: string) => {
    const req: PayPalCaptureRequest = { paypalOrderId };
    const res = await api.post<PayPalCaptureResponse>(
      "/payments/paypal/capture",
      req
    );
    return res.data;
  },

  /**
   * Tra cứu lịch sử các lần giao dịch của đơn hàng (GET /api/v1/payments/paypal/transactions/{orderCode})
   */
  getTransactionsByOrderCode: async (orderCode: string) => {
    const res = await api.get<PaymentTransactionResponse[]>(
      `/payments/paypal/transactions/${orderCode}`
    );
    return res.data;
  },
};
